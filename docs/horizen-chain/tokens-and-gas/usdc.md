---
title: USDC on Horizen
description: "USDC.e (bridged USDC) on Horizen: contract addresses, Circle's Bridged USDC Standard compliance, and ERC-20 integration guide."
sidebar_position: 3
---

## What is USDC.e?

USDC.e is the bridged form of USDC available on Horizen Chain. It is deployed via
**Stargate Hydra** — Stargate's Bridging-as-a-Service model- and backed 1:1 by
USDC locked in Stargate's liquidity pool on Base.

When a user bridges USDC from any Stargate-connected chain to Horizen, their USDC is
locked in Stargate's pool on the origin chain and an equivalent amount of USDC.e is
minted on Horizen. When leaving Horizen, USDC.e is burned and native USDC is released
on any Stargate-supported destination chain — not necessarily Base.

The `.e` suffix denotes that this is a bridged, pre-native representation of USDC. It
is not issued by Circle, is not directly redeemable through Circle, and does not have
access to Circle products such as Circle Mint or CCTP. These are properties of native
USDC. USDC.e's value is entirely backed by USDC locked in Stargate's pool.


## Circle's Bridged USDC Standard

USDC.e on Horizen is deployed in conformance with
**[Circle's Bridged USDC Standard](https://www.circle.com/bridged-usdc)** — Circle's
official specification for deploying bridged USDC on EVM chains in a way that preserves
a defined, seamless upgrade path to native issuance.

The standard requires the bridged USDC contract to be deployed with bytecode identical
to Circle's native USDC contracts on other EVM chains. This allows Circle to trustlessly
verify the contract, and if both Horizen and Circle agree, take ownership of the contract
and upgrade it to native USDC in place.

**What this means practically:**

- The **contract address does not change** on upgrade to native USDC. Any dApp
  integrating `0xDF7108f8B10F9b9eC1aba01CCa057268cbf86B6c` today will automatically be
  using native USDC after an upgrade — zero code changes, zero liquidity migration.
- **Existing holders require no action.** All supply, holders, and on-chain integrations
  are retained exactly as-is through the upgrade.
- **The upgrade is Circle's option, not a guarantee.** Circle evaluates supply size,
  growth rate, number of holders, and supported applications when prioritising native
  issuance for any chain.

:::note
This is the same upgrade path that World Chain recently completed — USDC.e was upgraded
in-place to native USDC with the contract address unchanged and no developer action
required.
:::



## Contract Addresses

:::warning
There are no official testnet USDC.e addresses for Horizen at this time.
USDC.e is available on **mainnet only**.
:::

| Network | Type | Address |
| --- | --- | --- |
| Mainnet Base | USDC ERC-20 (Circle) | [`0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`](https://basescan.org/token/0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913) |
| Mainnet Base | Stargate Pool / Lock Contract | [`0x27a16dc786820B16E5c9028b75B99F6f604b5d26`](https://basescan.org/address/0x27a16dc786820B16E5c9028b75B99F6f604b5d26) |
| Mainnet Horizen | **USDC.e ERC-20** | [`0xDF7108f8B10F9b9eC1aba01CCa057268cbf86B6c`](https://explorer.horizen.io/token/0xDF7108f8B10F9b9eC1aba01CCa057268cbf86B6c) |
| Mainnet Horizen | OFT Contract (LayerZero) | [`0x3a1293Bdb83bBbDd5Ebf4fAc96605aD2021BbC0f`](https://explorer.horizen.io/address/0x3a1293Bdb83bBbDd5Ebf4fAc96605aD2021BbC0f) |

:::note
The ERC-20 contract (`0xDF7108...`) and the OFT contract (`0x3a1293...`) are **separate
addresses** on Horizen — unlike ZEN and cbBTC where they share the same address. When
integrating USDC.e into your dApp, always use the **ERC-20 address**. The OFT contract
is the bridge mechanism, not the token itself.
:::



## Integrating USDC.e in your dApp

USDC.e is a standard ERC-20 token and is fully compatible with all EVM tooling, DeFi
primitives, and wallet interfaces on Horizen.

:::warning Critical — Decimals
USDC.e uses **6 decimals**, not 18. This is consistent with USDC on all other EVM
chains. Any arithmetic, pricing, or display logic that assumes 18 decimals will produce
completely wrong results. Always use `6` explicitly or read `decimals()` from the
contract.
:::

### Reading USDC.e balance (ethers.js)

```javascript
import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider(
  "https://horizen.calderachain.xyz/http"
);

const USDC_E_ADDRESS = "0xDF7108f8B10F9b9eC1aba01CCa057268cbf86B6c";

const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
];

const usdce = new ethers.Contract(USDC_E_ADDRESS, ERC20_ABI, provider);

const balance = await usdce.balanceOf("0xYourAddress");
const decimals = await usdce.decimals(); // 6
const formatted = ethers.formatUnits(balance, decimals);

console.log(`USDC.e balance: ${formatted}`);
```

### Using USDC.e in a Solidity contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function decimals() external view returns (uint8);
}

contract MyHorizenApp {
    // USDC.e on Horizen Mainnet — 6 decimals
    IERC20 public constant USDC_E =
        IERC20(0xDF7108f8B10F9b9eC1aba01CCa057268cbf86B6c);

    // 1 USDC.e = 1_000_000 base units (6 decimals, not 1e18)
    uint256 public constant ONE_USDC_E = 1_000_000;

    function getUsdcBalance(address user) external view returns (uint256) {
        // Returns amount in 6 decimal base units
        return USDC_E.balanceOf(user);
    }

    function pay(address recipient, uint256 usdcAmount) external {
        // usdcAmount in base units e.g. 5 USDC = 5_000_000
        require(usdcAmount >= ONE_USDC_E, "Minimum 1 USDC.e");
        USDC_E.transferFrom(msg.sender, recipient, usdcAmount);
    }
}
```

## Bridging USDC.e

For step-by-step instructions on bridging USDC from Base to Horizen and back,
see the [Bridge Assets](/horizen-chain/bridging/bridge-assets) section.
