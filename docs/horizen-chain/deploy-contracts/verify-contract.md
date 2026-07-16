---
title: Verify a Contract
description: "How to verify deployed smart contracts on the Horizen block explorer."
sidebar_position: 3
---

Verifying your contract publishes the source code to the block explorer, allowing anyone to read and audit it.

## Verify using Foundry

Foundry's `forge verify-contract` command supports Blockscout-based explorers directly.

**Testnet:**
```bash
forge verify-contract <DEPLOYED_CONTRACT_ADDRESS> \
  src/Counter.sol:Counter \
  --verifier blockscout \
  --verifier-url https://explorer-testnet.horizen.io/api/
```

**Mainnet:**
```bash
forge verify-contract <DEPLOYED_CONTRACT_ADDRESS> \
  src/Counter.sol:Counter \
  --verifier blockscout \
  --verifier-url https://explorer.horizen.io/api/
```

If your contract uses a specific compiler version or optimization settings, add them explicitly:
```bash
forge verify-contract <DEPLOYED_CONTRACT_ADDRESS> \
  src/Counter.sol:Counter \
  --verifier blockscout \
  --verifier-url https://explorer.horizen.io/api/ \
  --compiler-version 0.8.28 \
  --num-optimization-runs 200
```

## Verify using Hardhat

Install the Hardhat Verify plugin if it is not already included:
```bash
npm install --save-dev @nomicfoundation/hardhat-verify
```

Add the Blockscout verifier configuration to `hardhat.config.ts`:
```typescript
import "@nomicfoundation/hardhat-verify";

const config: HardhatUserConfig = {
  // ...existing config...
  etherscan: {
    apiKey: {
      horizen_testnet: "placeholder", // Blockscout does not require an API key
      horizen_mainnet: "placeholder",
    },
    customChains: [
      {
        network: "horizen_testnet",
        chainId: 2651420,
        urls: {
          apiURL: "https://explorer-testnet.horizen.io/api",
          browserURL: "https://explorer-testnet.horizen.io",
        },
      },
      {
        network: "horizen_mainnet",
        chainId: 26514,
        urls: {
          apiURL: "https://explorer.horizen.io/api",
          browserURL: "https://explorer.horizen.io",
        },
      },
    ],
  },
};
```

Then verify:
**Testnet**
```bash
npx hardhat verify --network horizen_testnet <DEPLOYED_CONTRACT_ADDRESS>
```

**Mainnet**
```bash
npx hardhat verify --network horizen_mainnet <DEPLOYED_CONTRACT_ADDRESS>
```

## Verify manually via the block explorer

If you prefer a UI:
1. Go to your contract address on the explorer.
2. Click the Contract tab.
3. Select Verify & Publish.
4. Choose your verification method: Solidity (Single file), Solidity (Standard JSON input), or Solidity (Multi-part files).
5. Fill in the compiler version and optimization settings that match your build exactly.
6. Submit — the explorer will compile and match the bytecode.

Once verified, your contract's source code, ABI, and read/write methods will be publicly visible on the explorer under the Contract tab.