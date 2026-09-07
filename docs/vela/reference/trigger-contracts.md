---
title: Trigger Contracts
description: "How trigger contracts and the TRUSTPROCESS flow work in Vela v0.2.0. Covers deploying with a trigger, the stateUpdate callback sequence, and chaining guard patterns."
sidebar_position: 1
---

# Trigger Contracts

Vela supports an advanced pattern where an external smart contract (a "trigger") can automatically enqueue a follow-up request as a side effect of any normal request completing. This enables use cases like anonymous execution pools, where processing a user's request causes an on-chain action to be taken from a shared pool address rather than from the user's own address.

## Deploying with a Trigger

Use `submitDeployRequestWithTrigger(protocolVersion, payload, triggerAddress)` instead of `submitDeployRequest`. The trigger contract must be deployed separately before the application deployment, and must extend `AbstractTrigger` from the Vela contracts library.

## What Happens During `stateUpdate`

After any request for a trigger-wired application completes, `ProcessorEndpoint` calls four trigger callbacks in strict order. Each callback runs inside an isolated `try/catch` so that a reverting trigger does not block the state update.

| Step | Callback | What it does |
|---|---|---|
| 1 | `claim` | Withdrawals whose recipient is the trigger contract address are pushed into the trigger. Funds move from the endpoint's custody into the trigger contract. |
| 2 | `execute(appEventData)` | The plaintext `AppEvent` array from the WASM execution is passed to the trigger. The trigger contract uses this data to perform an on-chain action. Emits `TriggerExecuted`. |
| 3 | `withdraw()` | A non-overridable sweep returns all ETH and token balances held by the trigger back into the endpoint's custody. Emits `TriggerWithdraw`. |
| 4 | `getTrustProcessPayload(...)` | If this returns non-empty bytes, a `TRUSTPROCESS` request (type `4`) is enqueued in a separate high-priority queue. An empty return means no follow-up is enqueued. |

## The `TRUSTPROCESS` Request

- Processed before any normal request in the queue. The trigger queue has higher priority than the standard request queue.
- Routed to the WASM application's `trusted_request` export.
- The payload is plaintext. It originates from the on-chain trigger contract, not from a user, so ECDH decryption is not applied.
- No application fee is charged and the minimum-fee check is skipped.

## Avoiding Infinite Chains

A `TRUSTPROCESS` can itself invoke the trigger again (chaining). Every trigger implementation must include a termination condition. The standard pattern is for `getTrustProcessPayload` to return empty bytes when `appEventData.events.length == 0`, so a trusted request that emits no `AppEvent`s does not enqueue another.

For a fully worked example, see `docs/4_trigger-contract-app.md` in the [vela-starterkit](https://github.com/HorizenOfficial/vela-starterkit) repository.
