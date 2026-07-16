--- 
title: Local Environment Setup (Docker)
description: "Set up a local VELA development environment using Docker."
sidebar_position: 2
---

The VELA local environment runs a complete stack on your machine via 
Docker Compose. It includes a local EVM chain, automatic smart contract 
deployment, a subgraph indexer, the Processor Manager, and the Authority 
Service — everything you need to develop and test a VASM application 
without touching a testnet.

> **Note:** The TEE is emulated in this environment. No real AWS Nitro 
> Enclave is used. Only one WASM application deployment is supported 
> per environment (appId 1).

 

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) with Docker Compose v2+
- Git

No other local tooling is required to run the environment. You only 
need a language toolchain (Go + TinyGo) if you intend to build your 
own WASM module.

 

## Setup

**1. Clone the starter kit**

```bash
git clone https://github.com/HorizenOfficial/vela-starterkit
cd vela-starterkit/dockerfiles
```

**2. Create your environment file**

For local development, copy the pre-configured dev defaults:

```bash
cp .env.dev .env
```

The `.env.dev` file has everything pre-configured for local use. 
You do not need to modify it to get started.

**3. Start the stack**

```bash
docker compose up
```

 

## Service Startup Sequence

Docker Compose brings up six services in a defined dependency chain:

| Step | Service | What It Does |
| --- | --- | --- |
| 1 | `chain` | Starts Foundry Anvil — a local EVM dev chain |
| 2 | `subgraph-postgres`, `subgraph-ipfs` | Starts Graph Node infrastructure |
| 3 | `deployer` | Deploys all VELA smart contracts, writes addresses to a shared volume, then exits |
| 4 | `subgraph-node` | Starts Graph Node, connects to the chain |
| 5 | `subgraph-deployer` | Reads deployed contract addresses, generates the subgraph manifest, deploys it, then exits |
| 6 | `manager`, `authorityservice` | Start and begin polling the chain and subgraph for requests |

The full stack is ready when `manager` and `authorityservice` 
are running and healthy. This takes roughly 30–60 seconds on 
first boot.



## Connecting MetaMask

To interact with the local chain from a browser wallet:

| Field | Value |
|---|---|
| RPC URL | `http://localhost:8545` |
| Chain ID | `31337` |
| Currency | ETH |

Anvil pre-funds a set of default accounts with 1000 ETH each. 
Their private keys are printed in the `chain` service logs on startup.



## Data Persistence and Volume Management

All state is persisted across restarts in Docker volumes.

| Volume | Contents |
|---|---|
| `vela-skit-chain-data` | Anvil chain data |
| `vela-skit-manager-data` | Processor Manager LevelDB state |
| `vela-skit-deploy-data` | Deployed contract addresses |
| `vela-skit-manager-reports` | Deanonymization reports (shared with Authority Service) |
| `vela-skit-logs` | Centralized logs |

**Restart without data loss:**
```bash
docker compose down && docker compose up
```
The deployer detects existing contracts and skips redeployment.

**Full reset — start from scratch:**
```bash
docker compose down
docker volume rm dockerfiles_vela-skit-chain-data \
               dockerfiles_vela-skit-deploy-data \
               dockerfiles_vela-skit-manager-data
docker compose up
```

**If you modify contracts:** rebuild the deployer image and delete 
both the chain and deploy volumes before restarting.

 
