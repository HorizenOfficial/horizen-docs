---
title: JSON-RPC Endpoints
description: "JSON-RPC endpoints for Horizen mainnet (chain ID 26514) and testnet (2651420). Supports full Ethereum JSON-RPC (eth_call, eth_sendRawTransaction, eth_getLogs, etc.) plus OP Stack rollup methods."
sidebar_position: 1
---

Horizen is fully EVM-compatible and supports the standard Ethereum JSON-RPC API. Use these endpoints to connect wallets, submit transactions, query state, and interact with deployed contracts.

## Mainnet

| Parameter | Value |
|---|---|
| **Chain ID** | `26514` |
| **RPC (HTTPS)** | `https://horizen.calderachain.xyz/http` |
| **RPC (WebSocket)** | `wss://horizen.calderachain.xyz/ws` |
| **Currency Symbol** | `ETH` |
| **Block Explorer** | `https://explorer.horizen.io/` |
| **Bridge** | `https://hub.horizen.io/` |

## Testnet (Base Sepolia)

| Parameter | Value |
|---|---|
| **Chain ID** | `2651420` |
| **RPC (HTTPS)** | `https://horizen-testnet.rpc.caldera.xyz/http` |
| **RPC (WebSocket)** | `wss://horizen-testnet.rpc.caldera.xyz/ws` |
| **Currency Symbol** | `ETH` |
| **Block Explorer** | `https://explorer-testnet.horizen.io/` |
| **Faucet** | `https://hub-testnet.horizen.io/` |



## Supported JSON-RPC Methods

Horizen supports the full standard Ethereum JSON-RPC specification. The most commonly used methods are listed below.

**Chain & Network**

| Method | Description |
|---|---|
| `eth_chainId` | Returns the current chain ID |
| `net_version` | Returns the network ID |
| `eth_blockNumber` | Returns the latest block number |
| `eth_gasPrice` | Returns the current gas price in wei |

**Accounts & Balances**

| Method | Description |
|---|---|
| `eth_accounts` | Returns a list of addresses owned by the client |
| `eth_getBalance` | Returns the ETH balance of an address |
| `eth_getTransactionCount` | Returns the nonce of an address |

**Blocks**

| Method | Description |
|---|---|
| `eth_getBlockByHash` | Returns block data by hash |
| `eth_getBlockByNumber` | Returns block data by block number |
| `eth_getBlockTransactionCountByHash` | Returns number of transactions in a block by hash |
| `eth_getBlockTransactionCountByNumber` | Returns number of transactions in a block by number |

**Transactions**

| Method | Description |
|---|---|
| `eth_sendRawTransaction` | Submits a signed transaction |
| `eth_getTransactionByHash` | Returns transaction data by hash |
| `eth_getTransactionReceipt` | Returns receipt for a mined transaction |
| `eth_estimateGas` | Estimates gas required for a transaction |
| `eth_call` | Executes a call without creating a transaction |

**Logs & Events**

| Method | Description |
|---|---|
| `eth_getLogs` | Returns logs matching a filter |
| `eth_newFilter` | Creates a new filter for log events |
| `eth_getFilterLogs` | Returns logs for an existing filter |
| `eth_uninstallFilter` | Removes a filter |



**Example for Querying Chain ID:**

```bash
curl -X POST https://horizen.calderachain.xyz/http \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'
```

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x6792"
}
```

> `0x6792` is `26514` in decimal — Horizen Mainnet's Chain ID.

**Example for Querying ETH Balance:**

```bash
curl -X POST https://horizen.calderachain.xyz/http \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "eth_getBalance",
    "params": ["0xYourAddress", "latest"],
    "id": 1
  }'
```

**Example for WebSocket subscription (ethers.js):**

```javascript
import { ethers } from "ethers";

const provider = new ethers.WebSocketProvider(
  "wss://horizen.calderachain.xyz/ws"
);

provider.on("block", (blockNumber) => {
  console.log("New block:", blockNumber);
});
```
