---
title: cbBTC on Horizen
description: "cbBTC (Coinbase Wrapped BTC) on Horizen: contract addresses, custody model, and ERC-20 integration guide."
sidebar_position: 4
---

## What is cbBTC?

cbBTC is **Coinbase Wrapped BTC** — an ERC-20 token issued by Coinbase, backed 1:1 by
Bitcoin held in Coinbase's custody. It brings Bitcoin liquidity to EVM chains, making
BTC usable in smart contracts, DeFi protocols, and any application that accepts ERC-20
tokens.

cbBTC on Horizen is bridged from Base via the **LayerZero OFT (Omnichain Fungible Token)
standard**. When cbBTC is bridged to Horizen, the cbBTC on Base is locked in the OFT
Adapter contract and an equivalent amount is minted on Horizen. When bridging back, the
Horizen cbBTC is burned and the corresponding amount is released on Base.

## Contract Addresses

### Mainnet

| Network | Type | Address |
| --- | --- | --- |
| Base | cbBTC ERC-20 (Coinbase) | [`0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf`](https://basescan.org/token/0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf) |
| Base | OFT Adapter (LayerZero) | [`0x68fb5BB8330C0b9d907F50f278143873276ee056`](https://basescan.org/address/0x68fb5BB8330C0b9d907F50f278143873276ee056) |
| Horizen | cbBTC ERC-20 / OFT | [`0x68fb5BB8330C0b9d907F50f278143873276ee056`](https://explorer.horizen.io/token/0x68fb5BB8330C0b9d907F50f278143873276ee056) |

### Testnet

| Network | Type | Address |
| --- | --- | --- |
| Base Sepolia | cbBTC ERC-20 | [`0xcbb7c0006f23900c38eb856149f799620fcb8a4a`](https://sepolia.basescan.org/token/0xcbb7c0006f23900c38eb856149f799620fcb8a4a) |
| Base Sepolia | OFT Adapter (LayerZero) | [`0x5dE29d14E72feb79967596F3Ae57A9BfBA192769`](https://sepolia.basescan.org/address/0x5dE29d14E72feb79967596F3Ae57A9BfBA192769) |
| Horizen Testnet | cbBTC ERC-20 / OFT | [`0x06DA6bDD2aB23447af5162ab0975edDA7E8d3747`](https://explorer.horizen.io/token/0x06DA6bDD2aB23447af5162ab0975edDA7E8d3747) |

:::note
On Horizen, the ERC-20 and OFT contract are the **same address** —
`0x68fb5BB8330C0b9d907F50f278143873276ee056` on mainnet and
`0x06DA6bDD2aB23447af5162ab0975edDA7E8d3747` on testnet. Use these addresses for all
on-chain interactions including balance queries, transfers, and approvals.
:::



## Trust Model & Custody

cbBTC's backing is fully custodial. The BTC underlying every cbBTC token is held by
Coinbase in secure custody — not in a decentralised smart contract. Coinbase issues,
mints, and burns cbBTC, and provides regular attestations confirming 1:1 BTC reserves.


## Integrating cbBTC in your dApp

cbBTC is a standard ERC-20 token and is fully compatible with all EVM tooling on
Horizen. There is one critical integration detail that differs from most ERC-20 tokens:

:::warning Critical — Decimals
cbBTC uses **8 decimals**, matching Bitcoin's native precision — not the 18 decimals
used by ETH and most ERC-20 tokens. Any arithmetic, pricing, or display logic that
assumes 18 decimals will produce completely wrong results. Always use `8` explicitly or
read `decimals()` from the contract.
:::

### Reading cbBTC balance (ethers.js)

```javascript
import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider(
  "https://horizen.calderachain.xyz/http"
);

const CBBTC_ADDRESS = "0x68fb5BB8330C0b9d907F50f278143873276ee056";

const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
];

const cbbtc = new ethers.Contract(CBBTC_ADDRESS, ERC20_ABI, provider);

const balance = await cbbtc.balanceOf("0xYourAddress");
const decimals = await cbbtc.decimals(); // 8, not 18
const formatted = ethers.formatUnits(balance, decimals);

console.log(`cbBTC balance: ${formatted}`);
```

### Using cbBTC in a Solidity contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function decimals() external view returns (uint8);
}

contract BTCCollateral {
    // cbBTC on Horizen Mainnet — 8 decimals
    IERC20 public constant CBBTC =
        IERC20(0x68fb5BB8330C0b9d907F50f278143873276ee056);

    // 1 cbBTC = 1e8 base units (8 decimals, not 1e18)
    uint256 public constant ONE_CBBTC = 1e8;

    function deposit(uint256 amount) external {
        // amount is in cbBTC base units (8 decimals)
        // e.g. 0.5 BTC = 50_000_000
        require(amount >= ONE_CBBTC / 100, "Minimum 0.01 cbBTC");
        CBBTC.transferFrom(msg.sender, address(this), amount);
    }

    function getBalance(address user) external view returns (uint256) {
        // Returns amount in 8 decimal base units
        return CBBTC.balanceOf(user);
    }
}
```



## Bridging cbBTC

For step-by-step instructions on bridging cbBTC from Base to Horizen and back,
see the [Bridge Assets](/horizen-chain/bridging/bridge-assets) section.
