---
title: What's Available & What's Coming
description: "Vela is moving fast. Local development, Base Sepolia testnet, and Horizen testnet are available today. ERC-20 tokens, compliance reports, and multi-app support are fully shipped. Mainnet is coming next."
sidebar_position: 1
---

# What's Available and What's Coming

Vela is moving fast. Here's an honest look at where things stand today and what the team is shipping next. For the full platform overview, visit the [official Vela page](https://horizenlabs.io/vela/).

## Available Today

### Deployment Environments

| Environment | Details |
|---|---|
| **Local (Docker)** | Full Vela stack with software-emulated TEE. Zero cloud dependencies, just Docker. Ideal for development and iteration. |
| **Base Sepolia and Horizen Testnet** | Live. Real AWS Nitro Enclave on a public testnet. Deployment is currently permissioned and done by the Vela team. [Reach out on Discord](https://discord.gg/horizen) to get access. |

### Shipped Features

| Feature | Since | What it enables |
|---|---|---|
| **ERC-20 Token Support** | v0.1.0 | Deposit and withdraw any allowlisted ERC-20 token through the platform, including gasless flows via EIP-2612 permit. |
| **Audit and Compliance Reports** | v0.1.x | Authorized auditors can request encrypted reports from the TEE. Access is managed on-chain via the `AuthorityRegistry` contract. In v0.2.0 reports are produced by `process_request` with `requestType=2`. |
| **Multi-App Support** | v0.1.0 | One Vela environment hosts multiple WASM applications, each with isolated state and locked funds (10 by default, admin-configurable). |



## What's Coming Next

### Mainnet

Mainnet is the next major milestone. If you're building on Vela now, locally or on testnet, you'll be ready to deploy the moment it launches.

### Self-Service Deployment

Testnet deployment is permissioned today. Fully self-serve deployment may become available for teams in the future.



## A Note on the Local TEE

The local Docker stack runs a software-emulated TEE rather than a real AWS Nitro Enclave. This is intentional. It lets you build and iterate without any cloud dependency. The emulated environment behaves identically to production from your application's perspective. The only difference is the absence of hardware-level attestation, which is a deployment-time concern, not a development one.

---

The team shares updates as new environments and features go live. Follow progress on [Discord](https://discord.gg/horizen) or open an issue on the [Vela repository](https://github.com/HorizenOfficial/vela).
