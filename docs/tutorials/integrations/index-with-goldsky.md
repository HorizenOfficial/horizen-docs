---
title: Index Your Contract with Goldsky
description: "Index your Horizen smart contract events and data using Goldsky subgraphs."
---

[Goldsky](https://goldsky.com) is a high-performance blockchain data indexing platform. It lets you extract on-chain events from your Horizen smart contracts, transform them into queryable entities, and serve them over a GraphQL API without running your own infrastructure.


<div style={{display: 'flex', justifyContent: 'center', margin: '24px 0'}}>
  <img src="/tutorials/goldsky-banner.png" alt="Goldsky" style={{maxWidth: '100%', width: '720px', borderRadius: '8px'}} />
</div> 


This tutorial walks through two paths:

- **Instant Subgraph** — zero config, fastest way to get a GraphQL endpoint from a deployed contract
- **Custom Subgraph via CLI** — full control over schema, mappings, and entity relationships

By the end you'll have a live GraphQL endpoint indexing your Horizen contract's events.


## Prerequisites

- A deployed contract on Horizen (mainnet or testnet). You'll need the contract address and ABI
- [Node.js](https://nodejs.org) ≥ 18
- A [Goldsky account](https://app.goldsky.com) (free tier available)

 

## Step 1: Install the Goldsky CLI

For macOS/Linux:

```bash
curl https://goldsky.com | sh
```

For Windows (requires [Node.js](https://nodejs.org)):

```bash
npm install -g @goldskycom/cli
```

Verify the installation:

```bash
goldsky --version
```

Log in to your Goldsky account:

```bash
goldsky login
```

When prompted, paste the API key from your [Goldsky Project Settings](https://app.goldsky.com) page.

 

## Path A — Instant Subgraph (Low-Code)

The instant subgraph mode is the fastest path to a working GraphQL API. You provide a config file with your contract details; Goldsky auto-generates the subgraph manifest, schema, and event mappings.

### 1. Export your contract ABI

If you deployed with Foundry, the ABI is in `out/<ContractName>.sol/<ContractName>.json`. Extract just the ABI array:

```bash
cat out/MyToken.sol/MyToken.json | jq '.abi' > abi.json
```

With Hardhat:

```bash
cat artifacts/contracts/MyToken.sol/MyToken.json | jq '.abi' > abi.json
```

Alternatively, find the ABI in the **Contract** tab of the [Horizen Testnet Explorer](https://explorer-testnet.horizen.io/) and save it to `abi.json`.

### 2. Create a config file

Create a file named `horizen-config.json` in your project directory:

```json
{
  "version": "1",
  "name": "my-token",
  "abis": {
    "mytoken": {
      "path": "./abi.json"
    }
  },
  "instances": [
    {
      "abi": "mytoken",
      "address": "0xYourContractAddress",
      "startBlock": 1500000,
      "chain": "horizen-testnet"
    }
  ]
}
```

**Fields explained:**

| Field | Description |
|---|---|
| `abis` | Maps a name to your local ABI file. The key (`mytoken`) is referenced by instances |
| `instances[].address` | Your deployed contract address |
| `instances[].startBlock` | Block number to begin indexing from — use your contract's deployment block |
| `instances[].chain` | Goldsky chain slug — use `horizen-testnet` or `horizen` |

> For multiple contracts or chains, add more entries to `instances`. Each additional chain produces a separate subgraph.

### 3. Deploy the instant subgraph

```bash
goldsky subgraph deploy my-token/1.0.0 --from-abi horizen-config.json
```

Once deployed, Goldsky returns a GraphQL endpoint:

```
https://api.goldsky.com/api/public/<project-id>/subgraphs/my-token/1.0.0/gn
```

Every event emitted by your contract is now queryable. If your contract emits `Transfer(address indexed from, address indexed to, uint256 value)`, the generated schema will include a `Transfer` entity you can query immediately.



## Path B — Custom Subgraph via CLI

For production-grade indexing — custom entity relationships, derived fields, aggregations — you define the subgraph manually. This is the same developer experience as The Graph Protocol.

### Project Structure

```
my-subgraph/
├── subgraph.yaml        # Manifest: chain, contract, event handlers
├── schema.graphql       # Entity definitions
├── src/
│   └── mapping.ts       # AssemblyScript event handlers
├── abis/
│   └── MyToken.json     # Contract ABI
└── package.json
```

### 1. Scaffold the project

Install the Graph CLI:

```bash
npm install -g @graphprotocol/graph-cli
```

Initialize a new subgraph:

```bash
graph init my-subgraph \
  --protocol ethereum \
  --network horizen-testnet \
  --contract-address 0xYourContractAddress \
  --abi ./abis/MyToken.json \
  --index-events
```

### 2. Define your schema (`schema.graphql`)

```graphql
type Transfer @entity(immutable: true) {
  id: Bytes!
  from: Bytes!
  to: Bytes!
  value: BigInt!
  blockNumber: BigInt!
  blockTimestamp: BigInt!
  transactionHash: Bytes!
}

type TokenHolder @entity {
  id: Bytes!           # holder address
  balance: BigInt!
  transferCount: BigInt!
}
```

Entities marked `@entity(immutable: true)` are optimized for append-only data (ideal for events). Mutable entities like `TokenHolder` allow updates.

### 3. Configure the manifest (`subgraph.yaml`)

```yaml
specVersion: 0.0.5
schema:
  file: ./schema.graphql
dataSources:
  - kind: ethereum
    name: MyToken
    network: horizen-testnet
    source:
      address: "0xYourContractAddress"
      abi: MyToken
      startBlock: 1500000  # Replace with your contract's deployment block
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.7
      language: wasm/assemblyscript
      entities:
        - Transfer
        - TokenHolder
      abis:
        - name: MyToken
          file: ./abis/MyToken.json
      eventHandlers:
        - event: Transfer(indexed address,indexed address,uint256)
          handler: handleTransfer
      file: ./src/mapping.ts
```

> **Finding your start block:** Look up your contract deployment transaction on the [Horizen Testnet Explorer](https://explorer-testnet.horizen.io/) and use that block number. Indexing from block 0 works but is slow.

### 4. Write event handlers (`src/mapping.ts`)

```typescript
import { Transfer as TransferEvent } from "../generated/MyToken/MyToken";
import { Transfer, TokenHolder } from "../generated/schema";
import { BigInt, Bytes } from "@graphprotocol/graph-ts";

export function handleTransfer(event: TransferEvent): void {
  // Persist the raw event
  let transfer = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  transfer.from = event.params.from;
  transfer.to = event.params.to;
  transfer.value = event.params.value;
  transfer.blockNumber = event.block.number;
  transfer.blockTimestamp = event.block.timestamp;
  transfer.transactionHash = event.transaction.hash;
  transfer.save();

  // Update or create the recipient's balance
  let recipient = TokenHolder.load(event.params.to);
  if (recipient == null) {
    recipient = new TokenHolder(event.params.to);
    recipient.balance = BigInt.fromI32(0);
    recipient.transferCount = BigInt.fromI32(0);
  }
  recipient.balance = recipient.balance.plus(event.params.value);
  recipient.transferCount = recipient.transferCount.plus(BigInt.fromI32(1));
  recipient.save();

  // Update the sender's balance
  let sender = TokenHolder.load(event.params.from);
  if (sender != null) {
    sender.balance = sender.balance.minus(event.params.value);
    sender.save();
  }
}
```

### 5. Generate types and build

```bash
graph codegen && graph build
```

`graph codegen` generates TypeScript types from your schema and ABIs. Always run it after changing `schema.graphql` or adding new ABIs.

### 6. Deploy to Goldsky

```bash
goldsky subgraph deploy my-token/1.0.0 --path .
```

Goldsky reads your local `subgraph.yaml` and deploys to their managed infrastructure. You'll get a GraphQL endpoint on success.

 

## Querying Your Subgraph

Once deployed, test your endpoint with a GraphQL query:

```graphql
{
  transfers(
    first: 10
    orderBy: blockTimestamp
    orderDirection: desc
  ) {
    id
    from
    to
    value
    blockTimestamp
    transactionHash
  }

  tokenHolders(
    first: 5
    orderBy: balance
    orderDirection: desc
  ) {
    id
    balance
    transferCount
  }
}
```

You can run this directly in [Goldsky's GraphQL playground](https://app.goldsky.com) or integrate it into your frontend with any GraphQL client.

### Example: fetching with `fetch` in JavaScript

```javascript
const SUBGRAPH_URL = "https://api.goldsky.com/api/public/<project-id>/subgraphs/my-token/1.0.0/gn";

async function getRecentTransfers() {
  const query = `{
    transfers(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
      from
      to
      value
      blockTimestamp
    }
  }`;

  const res = await fetch(SUBGRAPH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  const { data } = await res.json();
  return data.transfers;
}
```

 

## Managing Subgraphs

```bash
# List all your deployed subgraphs
goldsky subgraph list

# Check indexing status and current block
goldsky subgraph inspect my-token/1.0.0

# Delete a subgraph version
goldsky subgraph delete my-token/1.0.0
```

To deploy a new version without downtime, increment the version:

```bash
goldsky subgraph deploy my-token/1.1.0 --path .
```

Old versions remain queryable until explicitly deleted, allowing zero-downtime migrations.

