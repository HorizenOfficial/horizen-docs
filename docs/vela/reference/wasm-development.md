---
title: WASM Application Development
description: "Building Vela WASM applications with TinyGo: required exports, the v0.2.0 breaking change to process_request, and build commands."
sidebar_position: 4
---

# WASM Application Development

Vela applications are WebAssembly modules compiled from Go using TinyGo. Your module implements a small set of exported functions that the Executor calls at specific points in the request lifecycle.

## Required Exports

| Export | When called |
|---|---|
| `deploy` | Once at application deployment — receives constructor parameters and returns the initial encrypted state. Every module must export it; v0.2.0 calls it at deploy time, and a module without it fails to deploy. |
| `load_module` | Whenever the Executor needs the module and it is not in its in-memory cache (after a restart, or after the module was evicted from the LRU cache). It receives only `appId`, not the application state, and its returned state is not used. Keep it side-effect free and never use it to initialise state; `deploy` does that. |
| `deposit` | When a request includes a token or ETH deposit — called before `process_request` to credit the user's account |
| `process_request` | For every `PROCESS` (requestType=1) and `DEANONYMIZATION` (requestType=2) request |
| `trusted_request` | For `TRUSTPROCESS` (requestType=4) requests enqueued by a trigger contract — optional, only needed for trigger-contract patterns |

Your module never handles encryption directly. The Executor decrypts incoming payloads, calls your exported functions with plaintext data, then re-encrypts the results before posting them on-chain. All state is stored AES-256 encrypted between requests.

Common types (`Address`, `Uint256`, `Withdrawal`, `ProcessResult`) are provided by `vela-common-go/wasm/types`. You do not redefine them per application.

## Build Command

Standard `go build` will not work for Vela modules. The binary must be compiled with TinyGo targeting WASI:

```bash
tinygo build -target=wasi -o payment_app.wasm .
```

CI pins TinyGo v0.39.0. Using a different version may produce a module the Executor cannot load.

---

## v0.2.0 Breaking Change

**`generate_deanonymization_report` has been removed.**

In v0.2.0, deanonymization is handled through the existing `process_request` export. When the Executor receives a `DEANONYMIZATION` request, it calls `process_request` with `requestType=2`. Your module must check the value of `requestType` and, when it equals `2`, generate and return an audit report in the `Report` field of `ProcessResult`.

The Executor enforces these invariants on the result:
- A `DEANONYMIZATION` result with an empty `Report` field is rejected.
- A non-`DEANONYMIZATION` result with a non-empty `Report` field is also rejected.

The v0.2.0 Executor never calls `generate_deanonymization_report`, so reports from a module that still relies on it will not be produced. Remove that export and move the report generation logic into `process_request` (`requestType == 2`):

```go
func processRequest(requestType int32, state []byte, ...) types.ProcessResult {
    if requestType == 2 {
        report := generateReport(state)
        return types.ProcessResult{
            State:  state,  // return the current state unchanged alongside the report
            Report: report,
        }
    }
    // Handle normal process requests
    ...
}
```

Always return the application's current `State` alongside the `Report`; a report can only include data the app has already saved in state.

The example payment app (`vela-nova`) keeps only its last 50 transactions in private state (`MaxTransactions = 50`), so its `tx_history` report may be incomplete on busy apps. This is a choice in that app, not a Vela limit: your app decides what history to keep.
