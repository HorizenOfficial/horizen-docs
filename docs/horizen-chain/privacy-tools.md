---
title: Privacy Tools
description: "Confidentiality primitives available on Horizen: Vela for TEE-based confidential execution and zkVerify for on-chain ZK proof verification. No mandated stack — adopt what your use case needs."
sidebar_position: 6
---

Horizen gives you two complementary confidentiality primitives that operate at different layers, in addition to supporting any other EVM-compatible privacy implementation integrated by developers at the app level. Vela keeps inputs and computation private during execution using a TEE-based approach. zkVerify uses zero-knowledge proofs to prove that computation ran correctly and posts attestations onchain for dApp interoperability. These tools can be used independently or together — what you adopt depends on what your application needs to keep private and how it needs to demonstrate correctness.


## Vela - Confidential Execution

<!-- <div style={{display: 'flex', justifyContent: 'center', margin: '24px 0'}}>
  <img src="/vela/vela-hl-banner.png" alt="Vela" style={{maxWidth: '100%', width: '720px', borderRadius: '8px'}} />
</div> -->

[Vela](https://vela.horizenlabs.io/) is a TEE-based confidential execution solution by Horizen Labs. Application logic runs inside TEE hardware enclaves where data is encrypted in memory, inaccessible to any external observer including the host machine and cloud provider. Every computation produces a cryptographic attestation proving the code ran correctly inside a genuine enclave, without revealing the underlying data or intermediate state.

**Use Vela when:**
- Your application processes sensitive inputs that must stay private during computation — confidential balances, sealed bids, private order books, encrypted AI inference
- You need cryptographic proof that specific logic executed correctly without exposing what it executed on
- Compliance or audit requirements demand verifiable rule enforcement without raw data disclosure

→ [What is Vela?](/vela/introduction)

## zkVerify - On-Chain ZK Proof Verification

<div style={{display: 'flex', justifyContent: 'center', margin: '24px 0'}}>
  <img src="/tutorials/zkverify.png" alt="zkVerify" style={{maxWidth: '100%', width: '720px', borderRadius: '8px'}} />
</div>

zkVerify is a purpose-built L1 for verifying ZK proofs — a separate protocol that integrates with Horizen and any other EVM-compatible chain. Applications generate proofs off-chain using a ZK proving system, submit them to zkVerify, and receive on-chain verification results consumable by Horizen contracts, without deploying a custom verifier contract or paying native chain gas costs for proof verification.

**Use zkVerify when:**
- Your application already generates ZK proofs (from a ZK circuit, prover library, or ZK rollup) and needs cheap, fast on-chain verification
- You want to avoid deploying and maintaining chain-specific verifier contracts
- You need to aggregate or batch proof verification across multiple applications

→ [zkVerify Documentation](https://docs.zkverify.io)
