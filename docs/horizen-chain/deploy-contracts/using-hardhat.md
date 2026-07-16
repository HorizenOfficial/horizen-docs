---
title: Using Hardhat
description: "Deploy Solidity smart contracts to Horizen mainnet (chain ID 26514) or testnet (2651420) using Hardhat. Covers project setup with TypeScript, hardhat.config.ts network config, Ignition modules, and deployment scripts."
sidebar_position: 2
---

[**Hardhat**](https://hardhat.org/) is a flexible JavaScript/TypeScript development environment for Ethereum. It is well suited for teams that prefer a Node.js-based workflow, plugin ecosystem, and scripted deployments.

## Initialize a new project

Hardhat requires **Node.js (v18+)** and **npm**. It works on **macOS**, **Linux**, and **Windows**. On Windows, we recommend using [WSL 2](https://learn.microsoft.com/en-us/windows/wsl/install) for a smoother experience, though native CMD/PowerShell is also supported.

```bash
mkdir hardhat-tutorial
cd hardhat-tutorial
npx hardhat init
```

Follow the prompts to create a TypeScript project. Hardhat will scaffold the project with a sample contract, test, and ignition deployment module.

## Install dependencies

```bash
npm install
```

## Configure Horizen in hardhat.config.ts

Open `hardhat.config.ts` and add Horizen Testnet and Mainnet as named networks:

```typescript
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    horizen_testnet: {
      type: "http",
      url: "https://horizen-testnet.rpc.caldera.xyz/http",
      accounts: ["<YOUR_PRIVATE_KEY>"],
      chainId: 2651420,
    },
    horizen_mainnet: {
      type: "http",
      url: "https://horizen.calderachain.xyz/http",
      accounts: ["<YOUR_PRIVATE_KEY>"],
      chainId: 26514,
    },
  },
};

export default config;
```

Use environment variables for your private key in production. See the `.env` pattern in the Foundry section above — it works identically with `process.env.PRIVATE_KEY` in Hardhat configs.

## Compile your contracts

```bash
npx hardhat compile
```

## Deploy to Horizen Testnet

Hardhat uses Ignition for deployments. Your deployment module lives at `ignition/modules/`. Deploy with:

```bash
npx hardhat ignition deploy ignition/modules/Counter.ts --network horizen_testnet
```

## Deploy to Horizen Mainnet

```bash
npx hardhat ignition deploy ignition/modules/Counter.ts --network horizen_mainnet
```

## Run tests

```bash
npx hardhat test
```

For contract verification after deployment, see [Verify a Contract](/horizen-chain/deploy-contracts/verify-contract).