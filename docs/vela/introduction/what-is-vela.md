---
title: What is Vela?
description: "Vela is Horizen Labs' TEE-based confidential execution solution: run application logic inside TEE hardware enclaves where data is encrypted in memory, outputs are cryptographically attested, and compliance is verifiable without exposing raw data. Chain-agnostic, integrates with EVM contracts."
sidebar_position: 1
slug: /vela/introduction
---

# What is Vela?

<!-- <div style={{display: 'flex', justifyContent: 'center', margin: '24px 0'}}>
  <img src="/vela/vela-hl-banner.png" alt="VELA" style={{maxWidth: '100%', width: '720px', borderRadius: '8px'}} />
</div> -->

Vela is a TEE-based confidential execution solution by Horizen Labs, now in closed beta. It allows developers to run application logic inside Trusted Execution Environments (TEEs), where data is encrypted in memory and computations are cryptographically attested.

No operator, cloud provider, or third party can access the data being processed. At the same time, regulators and auditors can verify compliance through cryptographic proof without requiring access to raw application state.

## Key Properties

**Confidential execution** — Application logic runs inside a TEE. Data is encrypted in memory and inaccessible to the host machine, the cloud provider, or any external observer.

**Cryptographic attestation** — Every computation produces a verifiable attestation that proves the code ran correctly inside a genuine enclave, without revealing the data itself.

**Compliance without exposure** — Authorized parties (auditors, regulators) can verify that specific rules were followed using cryptographic proofs. They do not need access to the underlying data.

**Chain-agnostic** — Vela is not limited to Horizen Chain. It is designed as a coprocessor that can serve applications across multiple EVM-compatible networks.

## How It Fits with Horizen

Horizen Chain is an EVM-native L3 built on Base. Vela extends it by providing the confidential computation layer that the base chain does not offer. Together, they enable applications that are both publicly verifiable and privately executed.

## Current Status

Vela is in active development and open for developer testing. The local development environment runs via Docker with an emulated TEE. For details on getting started, see the [Getting Started](/vela/getting-started/prerequisites) section.

→ [Vela website](https://vela.horizenlabs.io/)
