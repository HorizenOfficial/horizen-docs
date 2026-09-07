---
title: WASM Application Development
description: "Building Vela WASM applications with TinyGo: required exports, the v0.2.0 breaking change to process_request, and build commands."
sidebar_position: 2
---

# WASM Application Development

Vela applications are WebAssembly modules compiled from Go using TinyGo. Your module implements a small set of exported functions that the Executor calls at specific points in the request lifecycle.

## Required Exports

| Export | When called |
|---|---|
| `deploy` | Once at application deployment — receives constructor parameters and returns the initial encrypted state |
| `load_module` | On Executor restart — rebuilds any in-memory state cache from persisted encrypted state |
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

Any module compiled against v0.1.x that exports `generate_deanonymization_report` will fail to deploy on a v0.2.0 Executor. Remove the export and move the report generation logic into `process_request`:

```go
func processRequest(requestType int32, ...) *ProcessResult {
    if requestType == 2 {
        return &ProcessResult{Report: generateReport()}
    }
    // Handle normal process requests
    ...
}
```

The transaction log inside the app is capped at 50 entries (`MaxTransactions = 50`). Older records are dropped silently. Auditors requesting `tx_history` reports should be aware they may not see the full history on high-volume applications.
