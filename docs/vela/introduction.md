---
title: What is Vela?
description: "Vela is Horizen Labs' TEE-based confidential execution solution: run application logic inside AWS Nitro Enclaves where data is encrypted in memory, outputs are cryptographically attested, and compliance reports are delivered encrypted to authorized auditors. Chain-agnostic, integrates with EVM contracts."
sidebar_position: 1
---

# What is Vela?

<!-- <div style={{display: 'flex', justifyContent: 'center', margin: '24px 0'}}>
  <img src="/vela/vela-hl-banner.png" alt="Vela" style={{maxWidth: '100%', width: '720px', borderRadius: '8px'}} />
</div> -->

Vela is a TEE-based confidential execution solution by Horizen Labs. It allows developers to run application logic inside Trusted Execution Environments (TEEs), where data is encrypted in memory and computations are cryptographically attested.

No operator, cloud provider, or third party can access the data being processed. At the same time, authorized auditors can request encrypted compliance reports from the TEE without exposing any other user's data.

## Key Properties

**Confidential execution** — Application logic runs inside a TEE. Data is encrypted in memory and inaccessible to the host machine, the cloud provider, or any external observer.

**Cryptographic attestation** — Every computation produces a verifiable attestation that proves the code ran correctly inside a genuine enclave, without revealing the data itself.

**Compliance without exposure** — Authorized auditors can request a private compliance report from the TEE. The enclave generates the report from its confidential ledger, encrypts it specifically for the auditor's registered public key, and makes it available through the Authority Service. Only the authorized auditor can decrypt the report — no other user's data is exposed in the process. Access is controlled per-application via the `AuthorityRegistry` contract, which governs which addresses are permitted to request reports.

**Chain-agnostic** — Vela is not limited to Horizen Chain. It is designed as a coprocessor that can serve applications across multiple EVM-compatible networks.

## Trusted Execution Environment

Vela uses **AWS Nitro Enclaves** as its Trusted Execution Environment. Nitro Enclaves are isolated virtual machines with no persistent storage, no interactive access, and no external networking, backed by cryptographic attestation from the AWS Nitro Hypervisor.

**In local development**, the Nitro Enclave is replaced by a software-emulated container that behaves identically from the application's perspective but does not provide hardware-level attestation. The `NoAttestationTeeAuthenticator` contract variant is used in the local Docker Compose stack, so no AWS account or hardware is required to develop and test Vela applications.

## Regulatory Compliance and Authorization

Authorization to request deanonymization reports is managed on-chain by the `AuthorityRegistry` contract. Each application has its own set of permitted auditor addresses. Only addresses registered in the registry for a given application can submit `DEANONYMIZATION` requests — attempting to do so from an unregistered address will be rejected. The set of authorized auditors is therefore transparent and auditable on-chain, while the report content itself remains encrypted end-to-end.

## How You Build on Vela

Applications on Vela are **WebAssembly (WASM) modules** compiled from Go code using **TinyGo**. Your application implements a small set of exported functions that the Vela Executor calls at specific points in the request lifecycle:

| Export | When called |
|--------|------------|
| `deploy` | Once, when the application is first deployed — receives constructor parameters and returns initial state |
| `load_module` | On Executor restart — rebuilds the default state cache |
| `deposit` | When a request includes a token or ETH deposit — credits the user's in-app account |
| `process_request` | For every standard (`PROCESS`) or audit (`DEANONYMIZATION`) request |
| `trusted_request` | For requests triggered automatically by an external trigger contract (advanced, optional) |

Your application never handles encryption directly. The Executor decrypts incoming payloads, calls your WASM functions with plaintext data, then encrypts the results before posting them on-chain. All state is stored encrypted (AES-256) between requests. Common types like `Address`, `Uint256`, and `Withdrawal` come from the shared library `vela-common-go`.

:::note
The `deposit` and `process_request` exports accept an `appId` parameter for interface compatibility, but the value is discarded at runtime — application identity is carried in state rather than per-call. Do not rely on `appId` in your application logic.
:::

## How It Fits with Horizen

Horizen Chain is an EVM-native L3 built on Base. Vela extends it by providing the confidential computation layer that the base chain does not offer. Together, they enable applications that are both publicly verifiable and privately executed.

## Current Status

Vela is at v0.2.0 and open for builders to experiment with. Run it locally via Docker with a software-emulated TEE (no AWS account required), or deploy to **Base Sepolia testnet** if you're building early and want real network conditions. **Base mainnet is next on the roadmap.** For details on getting started, see the [Getting Started](/vela/getting-started/prerequisites) section.

→ [Vela website](https://horizenlabs.io/vela/)
