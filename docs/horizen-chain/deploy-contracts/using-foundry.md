---
title: Using Foundry
description: "Deploy Solidity smart contracts to Horizen mainnet (chain ID 26514) or testnet (2651420) using Foundry (forge, cast, anvil). Covers install, compile, and deploy with forge create."
sidebar_position: 1
---

[**Foundry**](https://www.getfoundry.sh/) is a fast, Rust-based development toolkit for Ethereum. It handles everything from compilation and testing to deployment and on-chain interaction via the command line.

## Install Foundry

Foundry runs natively on **macOS** and **Linux**. On **Windows**, you must use [WSL 2](https://learn.microsoft.com/en-us/windows/wsl/install) — Foundry does not support PowerShell or CMD. Make sure `curl` and `git` are installed before proceeding.

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

Verify the installation:

```bash
forge --version
```

## Create a new project

```bash
forge init hello_horizen && cd hello_horizen
```

This scaffolds a new Foundry project with a sample `Counter.sol` contract at `src/Counter.sol`, a test file, and a default `foundry.toml` config.

## Configure Horizen in foundry.toml

Open `foundry.toml` and add the Horizen Testnet as a named network:

```toml
[rpc_endpoints]
horizen_testnet = "https://horizen-testnet.rpc.caldera.xyz/http"
horizen_mainnet = "https://horizen.calderachain.xyz/http"
```

This lets you reference networks by name in scripts and commands instead of pasting the full RPC URL each time.

## Compile your contracts

```bash
forge build
```

## Deploy to Horizen Testnet

```bash
forge create src/Counter.sol:Counter \
  --rpc-url https://horizen-testnet.rpc.caldera.xyz/http \
  --private-key <YOUR_PRIVATE_KEY>
```

On success, the output will include the deployed contract address:

```
Deployer: 0xYourWalletAddress
Deployed to: 0xYourContractAddress
Transaction hash: 0xYourTxHash
```

## Deploy to Horizen Mainnet

Swap the RPC URL to the mainnet endpoint and make sure your wallet has mainnet ETH:

```bash
forge create src/Counter.sol:Counter \
  --rpc-url https://horizen.calderachain.xyz/http \
  --private-key <YOUR_PRIVATE_KEY>
```

## Using a .env file (recommended)

Avoid exposing your private key in terminal history by storing it in a `.env` file:

```
# .env
PRIVATE_KEY=your_private_key_here
RPC_URL=https://horizen-testnet.rpc.caldera.xyz/http
```

Then load it in your deploy command:

```bash
source .env
forge create src/Counter.sol:Counter \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY
```

Add `.env` to your `.gitignore` — never commit private keys to a repository.

## Run tests

```bash
forge test
```

To run tests against a live fork of Horizen:

```bash
forge test --fork-url https://horizen-testnet.rpc.caldera.xyz/http
```

For contract verification after deployment, see [Verify a Contract](/horizen-chain/deploy-contracts/verify-contract).
