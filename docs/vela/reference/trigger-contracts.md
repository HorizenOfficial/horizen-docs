---
title: Trigger Contracts
description: "How trigger contracts and the TRUSTPROCESS flow work in Vela v0.2.0. Covers deploying with a trigger, the stateUpdate callback sequence, and chaining guard patterns."
sidebar_position: 2
---

# Trigger Contracts

Vela supports an advanced pattern where an external smart contract (a "trigger") can automatically enqueue a follow-up request as a side effect of a normal request completing successfully. This enables use cases like anonymous execution pools, where processing a user's request causes an on-chain action to be taken from a shared pool address rather than from the user's own address.

## Deploying with a Trigger

Use `submitDeployRequestWithTrigger(protocolVersion, payload, triggerAddress)` instead of `submitDeployRequest`. The trigger contract must be deployed separately before the application deployment. The trigger must implement `ITrigger` and must not already be registered to another app. Extending `AbstractTrigger` is recommended: it restricts calls to `ProcessorEndpoint` and provides the non-overridable `withdraw()` sweep described below.

## What Happens During `stateUpdate`

After a request for a trigger-wired application completes **successfully**, `ProcessorEndpoint` runs four trigger steps. If the request fails (result `FAILED`), the trigger is not invoked. `execute`, `withdraw` and `getTrustProcessPayload` each run in their own `try/catch`, so a revert in any of them does not block the state update. Step 1 is different: the endpoint pushes claimable withdrawals to the trigger with a direct transfer, not a callback. If the trigger cannot receive ETH, `stateUpdate` reverts with `TransferFailed`, so the trigger must accept ETH.

| Step | Action | What it does |
|---|---|---|
| 1 | ETH transfer (no callback) | Withdrawals whose recipient is the trigger contract address are pushed into the trigger with a direct transfer. Funds move from the endpoint's custody into the trigger contract. |
| 2 | `execute(appEventData)` | The plaintext `AppEvent` array from the WASM execution is passed to the trigger. The trigger contract uses this data to perform an on-chain action. Emits `TriggerExecuted`. |
| 3 | `withdraw()` | Sweeps all ETH and token balances held by the trigger back into the endpoint's custody. Extending `AbstractTrigger` makes this non-overridable; a bare `ITrigger` implementation must provide `withdraw()` itself. Emits `TriggerWithdraw`. |
| 4 | `getTrustProcessPayload(...)` | If this returns non-empty bytes, a `TRUSTPROCESS` request (type `4`) is enqueued in a separate high-priority queue. An empty return means no follow-up is enqueued. |

## The `TRUSTPROCESS` Request

- Processed before any normal request in the queue. The trigger queue has higher priority than the standard request queue.
- Routed to the WASM application's `trusted_request` export.
- The payload is plaintext. It originates from the on-chain trigger contract, not from a user, so ECDH decryption is not applied.
- No application fee is charged and the minimum-fee check is skipped.

## Avoiding Infinite Chains

A `TRUSTPROCESS` can itself invoke the trigger again (chaining). Every trigger implementation must include a termination condition. The standard pattern is for `getTrustProcessPayload` to return empty bytes when `appEventData.events.length == 0`, so a trusted request that emits no `AppEvent`s does not enqueue another.

For a fully worked example, see `docs/4_trigger-contract-app.md` in the [vela-starterkit](https://github.com/HorizenOfficial/vela-starterkit) repository.
