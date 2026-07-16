---
title: Limitations
description: "VELA current limitations: local Docker development only (no testnet or mainnet deployment yet), emulated TEE (no hardware attestation in dev), and other unsupported features in the active development phase."
sidebar_position: 1
---

VELA is in active development. The following constraints apply to the current release and will be addressed in upcoming iterations.

## No Production Deployment

VELA is not yet deployed to any testnet or mainnet environment. All development and testing happens locally using Docker.

## Emulated TEE

The local development environment uses an emulated Trusted Execution Environment rather than real hardware enclaves. This means your application logic runs in an isolated container, but does not benefit from hardware-level attestation guarantees.

If you have a working prototype and need access to a dedicated AWS Nitro Enclave instance on Horizen Chain, contact the team directly.

## Single WASM Application Per Environment

Only one WebAssembly application can be deployed into a VELA environment at a time. Multi-app support is on the roadmap.

## What the Team is Working On

The VELA team is actively building toward a production-ready release. Below is a summary of what is currently in progress.

### Multi-WASM Application Support

Removing the single-app constraint so that multiple WebAssembly applications can be deployed within a single VELA environment.

### Self-Deployment on Testnet

Enabling developers to deploy their own VELA applications to a shared testnet without needing to coordinate directly with the team.

### Shared Testnet Environment

A single, persistent testnet environment accessible to all developers for testing and integration work.

### ERC-20 Token Support

Adding native support for ERC-20 token interactions within VELA applications.

### Deanonymization Controls

More granular controls for managing when and how data can be revealed to authorized parties such as auditors or regulators.

---

The team shares updates as new features are deployed. If you have feedback or feature requests, reach out through [Discord](https://discord.gg/horizen) or open an issue on the [VELA repository](https://github.com/HorizenOfficial/vela).
