---
title: What is Vela?
description: "Vela is Horizen Labs' TEE-based confidential execution solution: run application logic inside AWS Nitro Enclaves where data is isolated from the host, computations are cryptographically attested, and compliance reports are delivered encrypted to authorized auditors. Chain-agnostic, integrates with EVM contracts."
sidebar_position: 1
---

# What is Vela?

Vela is a TEE-based confidential execution solution by Horizen Labs. It lets developers run application logic inside Trusted Execution Environments (TEEs), where data is isolated from the host and computations run on a genuine, cryptographically attested enclave.

No operator, cloud provider, or third party running the infrastructure can read the data being processed inside the enclave. At the same time, authorized auditors can request encrypted compliance reports from the TEE — generated from data the application has stored in its confidential state — without exposing any other user's data.

## Key Properties

**Confidential execution** — Application logic runs inside a TEE. Enclave memory is isolated from the host machine and the cloud provider, and application state is encrypted at rest (AES-256), so it is inaccessible to the host, the operator, or any external observer.

**Attested identity, signed results** — The enclave's identity is established by hardware attestation, which proves that a specific, measured application is running inside a genuine enclave. Every result the enclave returns is then signed by that attested enclave and verified on-chain. Attestation proves *which* code ran on genuine hardware — it does not prove the application's logic is correct; that remains the developer's responsibility.

**Compliance without exposure** — Authorized auditors can request a private compliance report from the TEE. The enclave generates the report from its confidential state, encrypts it specifically for the auditor's registered public key, and makes it available through the Authority Service. Only the authorized auditor can decrypt the report, and no other user's data is exposed in the process. Access is controlled per-application via the `AuthorityRegistry` contract, which governs which addresses may request reports. Note that a report can only contain data the application chose to persist in its confidential state — producing compliance reports is a feature the application developer designs, not one the platform provides automatically.

**Chain-agnostic** — Vela is not limited to Horizen Chain. It is designed as a coprocessor that can serve applications across multiple EVM-compatible networks.

## Trusted Execution Environment

Vela uses AWS Nitro Enclaves as its Trusted Execution Environment. Nitro Enclaves are isolated virtual machines with no persistent storage, no interactive access, and no external networking, backed by cryptographic attestation from the AWS Nitro system.

Because the enclave has no external networking, an application cannot fetch external data while it runs. Any external data an application needs must be supplied to it as part of the incoming request.

In local development, the Nitro Enclave is replaced by a software-emulated container that behaves identically from the application's perspective but does not provide hardware-level attestation. The `NoAttestationTeeAuthenticator` contract variant is used in the local Docker Compose stack, so no AWS account or hardware is required to develop and test Vela applications.

## Regulatory Compliance and Authorization

Authorization to request deanonymization reports is managed on-chain by the `AuthorityRegistry` contract. Each application has its own set of permitted auditor addresses. Only addresses registered in the registry for a given application can submit `DEANONYMIZATION` requests — attempting to do so from an unregistered address is rejected. The set of authorized auditors is therefore transparent and auditable on-chain, while the report content itself remains encrypted end-to-end.

Vela verifies on-chain *who* is authorized to request a report. *What* the report contains is determined by the application: the enclave can only include data the application has saved in its confidential state, so the disclosure feature — and the scope of what it can reveal — is designed by the application developer.

## How You Build on Vela

Applications on Vela are WebAssembly (WASM) modules compiled from Go code using TinyGo. Your application implements a small set of exported functions that the Vela Executor calls at specific points in the request lifecycle:

| Export | When called |
|---|---|
| `deploy` | Once, when the application is first deployed — receives constructor parameters and returns initial state |
| `load_module` | On Executor restart — reloads the application module into the Executor's cache |
| `deposit` | When a request includes a token or ETH deposit — credits the user's in-app account |
| `process_request` | For every standard (`PROCESS`) or audit (`DEANONYMIZATION`) request |
| `trusted_request` | For requests triggered automatically by an external trigger contract (advanced, optional) |

Your application never handles encryption directly. The Executor decrypts incoming payloads, calls your WASM functions with plaintext data, then encrypts the results before posting them on-chain. All state is stored encrypted (AES-256) between requests. Common types like `Address`, `Uint256`, and `Withdrawal` come from the shared library `vela-common-go`.

Fees are set by the application. There is currently no automatic metering — the developer assigns the fuel cost of each operation, and it should be proportional to the complexity of the work that operation performs.

:::note
The `deposit` and `process_request` exports accept an `appId` parameter for interface compatibility, but the value is discarded at runtime — application identity is carried in state rather than per-call. Do not rely on `appId` in your application logic.
:::

## How It Fits with Horizen

Horizen Chain is an EVM chain built on the OP Stack, settling to Base. Vela extends it by providing the confidential computation layer the base chain does not offer. Together, they enable applications that are both publicly verifiable and privately executed.

## Current Status

Vela is at v0.2.0 and open for builders to experiment with. Run it locally via Docker with a software-emulated TEE (no AWS account required), or build against live network conditions — Vela is deployed on Base Sepolia testnet and Horizen testnet, with mainnet next on the roadmap. For details on getting started, see the [Getting Started](/vela/getting-started/prerequisites) section.

→ [Vela website](https://vela.horizenlabs.io/)
