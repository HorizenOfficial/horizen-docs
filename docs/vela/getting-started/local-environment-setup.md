---
title: Local Environment Setup (Docker)
description: "Set up a local Vela development environment using Docker. Covers the full service startup sequence, volume management, and troubleshooting shared volume issues."
sidebar_position: 2
---

The Vela local environment runs a complete stack on your machine via Docker Compose. It includes a local EVM chain, automatic smart contract deployment, a subgraph indexer, the TEE Executor, the Manager, and the Authority Service. Everything you need to develop and test a WASM application without touching a testnet.

The TEE is emulated in this environment using a software container. No real AWS Nitro Enclave is used. Only one WASM application deployment is supported per environment (`appId 1`).

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) with Docker Compose v2+
- Git

No other local tooling is required to run the environment. You only need a language toolchain (Go + TinyGo) if you intend to build your own WASM module from source.

## Setup

**1. Clone the starter kit**

```bash
git clone https://github.com/HorizenOfficial/vela-starterkit
cd vela-starterkit/dockerfiles
```

**2. Create your environment file**

```bash
cp .env.dev .env
```

The `.env.dev` file has everything pre-configured for local use. You do not need to modify it to get started.

**3. Start the stack**

```bash
docker compose up
```

To run a specific version of the Vela service images, set `VELA_IMAGE_TAG` before starting:

```bash
VELA_IMAGE_TAG=v0.2.0 docker compose up
```

This applies to all Vela images (`executor`, `manager`, `authorityservice`, `chain`, `deployer`, `subgraph-deployer`). Third-party images (Graph Node, PostgreSQL, IPFS) are not affected.

## Service Startup Sequence

Docker Compose brings up nine services in a defined dependency chain:

| Step | Service | What it does |
|---|---|---|
| 1 | `chain` | Foundry Anvil starts and becomes available on port 8545 |
| 2 | `subgraph-postgres`, `subgraph-ipfs` | Graph Node infrastructure (database and IPFS) |
| 3 | `deployer` | Deploys all Vela smart contracts, writes addresses to a shared volume, then exits |
| 4 | `subgraph-node` | Connects to the chain and becomes healthy |
| 5 | `subgraph-deployer` | Reads deployed contract addresses, generates the subgraph manifest, deploys the subgraph, then exits |
| 6 | `executor` | Starts inside the emulated TEE container and waits for the Manager to connect and complete the keyset handshake |
| 7 | `manager` | Reads contract addresses, connects to the Executor, performs the keyset handshake (exchanges encryption keys), then begins polling the chain for pending requests |
| 8 | `authorityservice` | Reads contract addresses, connects to the subgraph, begins serving the compliance report API |

The `executor` is the component that runs all WASM modules and holds all encryption keys. The `manager` will not begin processing requests until the keyset handshake with the `executor` succeeds. If the stack appears to be running but no requests are being processed, check `executor` logs first.

The stack is fully ready when `executor`, `manager`, and `authorityservice` are all healthy. This typically takes 30 to 60 seconds after `docker compose up`.

## Connecting MetaMask

To interact with the local chain from a browser wallet:

| Field | Value |
|---|---|
| RPC URL | `http://localhost:8545` |
| Chain ID | `31337` |
| Currency | ETH |

Anvil pre-funds a set of default accounts with 1000 ETH each. Their private keys are printed in the `chain` service logs on startup.

## Data Persistence and Volume Management

All state is persisted across restarts in Docker named volumes.

| Volume | Contents |
|---|---|
| `vela-skit-chain-data` | Foundry Anvil blockchain data (block history, state) |
| `vela-skit-manager-data` | Manager's LevelDB database (encrypted application state, WASM bytecode, keyset recovery data) |
| `vela-skit-deploy-data` | Deployed contract addresses shared across all services |
| `vela-skit-shared-data` | Shared directory written by the Manager and read by the Authority Service. A named volume is required here because the default image declares an anonymous per-container volume, which would be invisible to other containers. |
| `vela-skit-manager-reports` | Compliance reports stored by the Manager |
| `vela-skit-logs` | Centralized log files from all services |
| `vela-skit-subgraph-postgres` | Graph Node PostgreSQL database |
| `vela-skit-subgraph-ipfs` | Graph Node IPFS storage |

**Restart without data loss:**
```bash
docker compose down && docker compose up
```
The deployer detects existing contracts and skips redeployment.

**Full reset (start from scratch):**
```bash
docker compose down
docker volume rm \
  dockerfiles_vela-skit-chain-data \
  dockerfiles_vela-skit-deploy-data \
  dockerfiles_vela-skit-manager-data \
  dockerfiles_vela-skit-shared-data \
  dockerfiles_vela-skit-manager-reports \
  dockerfiles_vela-skit-subgraph-postgres \
  dockerfiles_vela-skit-subgraph-ipfs
docker compose up
```

**If you modify contracts,** rebuild the deployer image and delete both the chain and deploy volumes before restarting.

## Troubleshooting

**`wasm module is empty (code 11)` during `deployapp`**

This happens when the `manager` and `authorityservice` containers are not sharing a named volume, so the Manager cannot find the uploaded WASM artifact. This is usually caused by the `vela-skit-shared-data` volume not being declared correctly in your `docker-compose.yml`.

Fix: verify that `vela-skit-shared-data` is declared as a named volume in the `volumes:` section at the bottom of `docker-compose.yml`, and that both `manager` and `authorityservice` mount it at `/shared-data`. Then force-recreate both containers:

```bash
cd <repo-root>/dockerfiles
docker compose up -d --force-recreate manager authorityservice
```

Retry the `deployapp` command after both containers are healthy.

**Stack starts but no requests are processed**

Check `executor` logs first. The `manager` will not begin processing until the keyset handshake with the `executor` completes successfully. Look for handshake confirmation messages in both service logs before submitting requests.
