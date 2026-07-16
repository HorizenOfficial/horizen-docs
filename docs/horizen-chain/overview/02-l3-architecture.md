---
title: The L3 Architecture
description: "Horizen is an OP Stack L3 that settles on Base, inheriting Ethereum's security and Base's scalability while adding opt-in confidential execution for private onchain finance."
sidebar_position: 2
---

Horizen Chain is an OP Stack rollup that settles directly onto Base, which in turn settles onto Ethereum.


## The Layered Model

**Ethereum - Security & Final Settlement**: The root of trust. Ethereum provides the cryptographic finality that everything above it inherits.

**Base - Scalable Execution & Data Availability**: Horizen's settlement surface. Transaction data and state commitments from Horizen are published directly to Base's native data-availability layer.

**Horizen Chain - Capital Coordination & Execution**: An EVM-compatible rollup using the OP Stack. Horizen inherits Base's scalability and sequencing infrastructure, with opt-in confidential execution available through [Vela](https://vela.horizenlabs.io/).

**Vela - Confidential Coprocessor**: An emerging confidential coprocessor by Horizen Labs that sits alongside Horizen Chain. Applications offload sensitive computation to TEE enclaves, receive cryptographically attested results back, and anchor those results on-chain.

<img src="/horizen-chain/l3-architecture.png" alt="L3 Architecture" style={{width: '520px', display: 'block', margin: '0 auto'}} />


