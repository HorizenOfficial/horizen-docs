---
title: Supported Wallets & Tools
description: "List of wallets, developer tools, and SDKs compatible with Horizen."
sidebar_position: 3
---

## Wallets

Any EVM-compatible wallet works on Horizen Chain. Add the network using the RPC configuration above.

| Wallet | Type | Notes |
|---|---|---|
| **MetaMask** | Browser / Mobile | Add Horizen manually via Settings → Networks |
| **Coinbase Wallet** | Browser / Mobile | Add custom network via Settings |
| **Rabby** | Browser | Add manually if not auto-detected |
| **Ledger** | Hardware | Use with MetaMask or Rabby as the interface |
| **Safe (via Den)** | Smart Contract Multisig | [https://safe.horizen.io](https://safe.horizen.io) |

**Adding Horizen Mainnet to MetaMask:**

```
Network Name:    Horizen Mainnet
RPC URL:         https://horizen.calderachain.xyz/http
Chain ID:        26514
Currency Symbol: ETH
Block Explorer:  https://explorer.horizen.io/
```

**Adding Horizen Testnet to MetaMask:**

```
Network Name:    Horizen Testnet
RPC URL:         https://horizen-testnet.rpc.caldera.xyz/http
Chain ID:        2651420
Currency Symbol: ETH
Block Explorer:  https://explorer-testnet.horizen.io/
```



## Developer Tools

| Tool | Type | Notes |
|---|---|---|
| **Foundry** | Smart contract development | Fully supported |
| **Hardhat** | Smart contract development | Fully supported |
| **ethers.js** | JavaScript library | Works out of the box with Horizen RPC |
| **viem** | TypeScript library | Works out of the box with Horizen RPC |
| **wagmi** | React hooks library | Works out of the box with Horizen RPC |
| **Goldsky** | Subgraph indexing | Chain slug: `horizen-testnet` |
| **Stork** | Oracle | Contract: `0xacC0a0cF13571d30B4b8637996F5D6D774d4fd62` |

**Connecting ethers.js to Horizen:**

```javascript
import { ethers } from "ethers";

// HTTPS provider — Mainnet
const provider = new ethers.JsonRpcProvider(
  "https://horizen.calderachain.xyz/http"
);

// WebSocket provider — Mainnet
const wsProvider = new ethers.WebSocketProvider(
  "wss://horizen.calderachain.xyz/ws"
);

// Verify connection
const network = await provider.getNetwork();
console.log("Chain ID:", network.chainId); // 26514n
```

**Connecting viem to Horizen:**

```typescript
import { createPublicClient, http, defineChain } from "viem";

const horizen = defineChain({
  id: 26514,
  name: "Horizen Mainnet",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://horizen.calderachain.xyz/http"],
      webSocket: ["wss://horizen.calderachain.xyz/ws"],
    },
  },
  blockExplorers: {
    default: {
      name: "Horizen Explorer",
      url: "https://explorer.horizen.io",
    },
  },
});

const client = createPublicClient({
  chain: horizen,
  transport: http(),
});

const blockNumber = await client.getBlockNumber();
console.log("Current block:", blockNumber);
```


## Block Explorers

| Network | Explorer | API Base URL |
|---|---|---|
| Mainnet | [https://explorer.horizen.io/](https://explorer.horizen.io/) | `https://explorer.horizen.io/api` |
| Testnet | [https://explorer-testnet.horizen.io/](https://explorer-testnet.horizen.io/) | `https://explorer-testnet.horizen.io/api` |
    
Both explorers are powered by Blockscout and support the full Blockscout REST API — query transactions, blocks, addresses, token transfers, and verified contracts programmatically.

Blockscout API docs: [docs.blockscout.com/for-users/api](https://docs.blockscout.com/for-users/api)



## Bridge & Faucet

| Resource | Network | URL |
|---|---|---|
| **Bridge** | Mainnet | `https://hub.horizen.io/` |
| **Bridge** | Testnet | `https://hub-testnet.horizen.io/` |
| **ZEN Bridge (Stargate)** | Base → Horizen | `https://stargate.finance/?srcChain=base&srcToken=0xf43eB8De897Fbc7F2502483B2Bef7Bb9EA179229&dstChain=horizen&dstToken=0x57da2D504bf8b83Ef304759d9f2648522D7a9280` |
| **Faucet** | Testnet | `https://hub-testnet.horizen.io/` |



## Quick Reference — All URLs

| Resource | URL |
|---|---|
| Mainnet RPC | `https://horizen.calderachain.xyz/http` |
| Mainnet WebSocket | `wss://horizen.calderachain.xyz/ws` |
| Testnet RPC | `https://horizen-testnet.rpc.caldera.xyz/http` |
| Testnet WebSocket | `wss://horizen-testnet.rpc.caldera.xyz/ws` |
| Mainnet Explorer | `https://explorer.horizen.io/` |
| Testnet Explorer | `https://explorer-testnet.horizen.io/` |
| Mainnet Bridge | `https://hub.horizen.io/` |
| Testnet Bridge / Faucet | `https://hub-testnet.horizen.io/` |
| ZEN Bridge (Stargate) | `https://stargate.finance/?srcChain=base&srcToken=0xf43eB8De897Fbc7F2502483B2Bef7Bb9EA179229&dstChain=horizen&dstToken=0x57da2D504bf8b83Ef304759d9f2648522D7a9280` |
| Multisig (Den) | `https://safe.horizen.io/welcome` |
| Official Docs | `https://docs.horizen.io` |
| GitHub | `https://github.com/HorizenOfficial` |
| Stork Oracle Docs | `https://docs.stork.network` |
| Goldsky Docs | `https://docs.goldsky.com` |
| Den Docs | `https://docs.onchainden.com` |
