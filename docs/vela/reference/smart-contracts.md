---
title: Smart Contracts Reference
description: "ProcessorEndpoint request types, TokenAllowlist, meta-transactions, and contract-level access control for Vela v0.2.0."
sidebar_position: 1
---

# Smart Contracts Reference

This page covers the contracts you interact with when building on Vela: how to submit requests, which contracts do what, and the access control rules that govern them.

## Submitting Requests

All user interactions with a deployed Vela application go through `ProcessorEndpoint`. There are five request types. Not all types can be submitted by all callers, and not all contract functions accept all types.

| Request type | Value | Submitted via | Who can submit |
|---|---|---|---|
| `DEPLOYAPP` | `0` | `submitDeployRequest` or `submitDeployRequestWithTrigger` | Caller must hold `DEPLOYER_ROLE` on `ProcessorEndpoint` |
| `PROCESS` | `1` | `submitRequest` or `submitRequestFor` | Any address |
| `DEANONYMIZATION` | `2` | `submitRequest` | Addresses registered in `AuthorityRegistry` for the target application |
| `ASSOCIATEKEY` | `3` | `submitRequest` or `submitRequestFor` | Any address |
| `TRUSTPROCESS` | `4` | Enqueued automatically by a trigger contract — cannot be submitted directly by users | Trigger contract only |

Calling `submitRequest` with type `DEPLOYAPP` (`0`) or `TRUSTPROCESS` (`4`) will revert with `InvalidRequestType`.

### What each type does

**`PROCESS` (1):** The standard request type. If the request includes a deposit, the Executor calls `deposit` first, then `process_request(requestType=1)`.

**`DEANONYMIZATION` (2):** An audit request. The Executor calls `process_request(requestType=2)`. Your WASM application must detect this value and return a non-empty audit report in `ProcessResult.Report`. The Executor rejects a deanonymization result with an empty `Report`, and rejects a non-deanonymization result with a non-empty `Report`.

**`ASSOCIATEKEY` (3):** Registers the sender's P-521 public key in the Executor's key store. This key is used to ECDH-encrypt all subsequent response payloads sent to this address. Handled entirely by the Executor — the WASM application is not called.

**`DEPLOYAPP` (0):** Deploys a new WASM application. The Executor validates the module, calls `load_module` to initialize state caching, then calls `deploy` with the constructor parameters from the request payload and stores the resulting encrypted initial state.

**`TRUSTPROCESS` (4):** A follow-up request enqueued automatically by a trigger contract after a normal request completes. Processed before normal requests in the queue (trigger queue has higher priority). Routed to the WASM `trusted_request` export. No sender address, no user signature, no application fee, no minimum-fee check. The payload is plaintext since it comes from the on-chain trigger contract, not from a user.

---

## `TokenAllowlist`

`TokenAllowlist` is a standalone contract deployed separately from `ProcessorEndpoint`. It maintains the list of ERC-20 token addresses the platform accepts as deposits. `ProcessorEndpoint` receives a reference to it at construction time and exposes it via `tokenAllowlist()`.

To check whether a given token is accepted before submitting a deposit:

```solidity
processorEndpoint.tokenAllowlist().isAllowed(tokenAddress)
```

Adding tokens to the allowlist requires the appropriate admin role on the `TokenAllowlist` contract itself, not on `ProcessorEndpoint`. The two contracts have independent access control.

---

## Meta-Transactions (`submitRequestFor`)

`ProcessorEndpoint` supports EIP-712 meta-transactions: a facilitator address can submit a `PROCESS` or `ASSOCIATEKEY` request on behalf of an end user, paying the gas cost themselves. This enables gasless UX flows where end users do not need to hold ETH.

**How it works:**

1. The end user signs an EIP-712 authorization message covering: their address (`sender`), the protocol version, application ID, request type, payload hash, token address, asset amount, a per-user nonce, and a deadline timestamp.
2. The facilitator calls `submitRequestFor` on `ProcessorEndpoint` with the signed authorization and the actual encrypted payload, paying gas via `msg.value`.
3. The contract validates the EIP-712 signature, checks that the deadline has not passed, and increments the per-user nonce stored in `facilitatorNonces[sender]`.
4. The resulting `PendingRequest` records both `sender` (the end user) and `facilitator` (the caller). Both addresses appear in the emitted `RequestSubmitted` event.

For ERC-20 deposits in a meta-transaction, include an EIP-2612 `permit` signature in the `depositPermit` field. This allows the token to be pulled from the user's wallet without a separate `approve` transaction.

The current per-user nonce for any address is readable via `getFacilitatorNonce(userAddress)`.

---

## `adminReset` and `adminResetApps`

:::warning Testnet and development only
These functions are gated behind the `RESET_OPERATOR` role on `ProcessorEndpoint`. The role can only be granted at deployment time via the constructor parameter `resetOperator`. In production deployments the constructor is called with `resetOperator = address(0)`, which permanently disables the role. There is no way to re-enable it at runtime.

Do not design production systems that depend on these functions being available.
:::
