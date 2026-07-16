---
title: Subgraph Indexing (Goldsky)
description: "How to index Horizen onchain data using Goldsky subgraphs and Mirror pipelines."
sidebar_position: 2
---

<div style={{display: 'flex', justifyContent: 'center', margin: '24px 0'}}>
  <img src="/tutorials/goldsky-banner.png" alt="Goldsky" style={{maxWidth: '100%', width: '720px', borderRadius: '8px'}} />
</div>

Goldsky is a data indexing provider that makes it straightforward to extract, transform, and serve on-chain data as queryable APIs — powering dashboards, analytics, and application backends without building custom indexing infrastructure.

Goldsky offers two core products:

- **Subgraphs** — define event-driven indexing logic, query via GraphQL
- **Mirror** — real-time data replication pipelines that stream on-chain data directly into your own databases or data warehouses

**Horizen Testnet** is available on Goldsky with the chain slug: **`horizen-testnet`**



## Getting Started

**Install the Goldsky CLI:**

```bash
curl https://goldsky.com | sh
```

**Authenticate:**

```bash
goldsky login
```



## Deploy via CLI (Subgraph Config Files)

This is the standard approach if you are already familiar with subgraph development. You define your indexing logic locally across three files:

- `subgraph.yaml` — defines data sources, event handlers, and the network
- `schema.graphql` — defines the entities your subgraph will index
- `src/mappings.ts` — AssemblyScript handlers that transform raw events into entities

**subgraph.yaml — targeting Horizen Testnet:**

```yaml
specVersion: 0.0.5
schema:
  file: ./schema.graphql
dataSources:
  - kind: ethereum
    name: MyContract
    network: horizen-testnet
    source:
      address: "0xYourContractAddress"
      abi: MyContract
      startBlock: 0
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.7
      language: wasm/assemblyscript
      entities:
        - MyEntity
      abis:
        - name: MyContract
          file: ./abis/MyContract.json
      eventHandlers:
        - event: MyEvent(indexed address,uint256)
          handler: handleMyEvent
      file: ./src/mappings.ts
```

**Deploy to Goldsky:**

```bash
goldsky subgraph deploy my-subgraph/1.0.0 --path .
```

Full step-by-step guide: [docs.goldsky.com/subgraphs/deploying-subgraphs](https://docs.goldsky.com/subgraphs/deploying-subgraphs)



## Deploy via Instant Subgraphs (No Config Required)

If you want to get up and running immediately without writing indexing logic, Goldsky can auto-generate the subgraph configuration from a contract address and ABI. This is the fastest way to start querying contract events as a GraphQL API.

```bash
goldsky subgraph deploy my-subgraph/1.0.0 \
  --from-abi <path-to-abi.json> \
  --address <YOUR_CONTRACT_ADDRESS> \
  --network horizen-testnet \
  --startBlock <DEPLOYMENT_BLOCK>
```

Goldsky will generate the `subgraph.yaml`, `schema.graphql`, and mapping files automatically and deploy in one step.



## Mirror — Real-Time Data Pipelines

Goldsky Mirror lets you stream raw on-chain data — blocks, transactions, logs, traces — directly into your own infrastructure in real time. This is useful for analytics databases, alerting systems, and any use case where you need the full raw chain data rather than event-driven entity indexing.

**Create a pipeline interactively:**

```bash
goldsky pipeline create my-horizen-pipeline
```

This launches a guided CLI flow where you select:
- Data source type (subgraph, chain-level dataset)
- Filters to apply
- Destination sink (PostgreSQL, ClickHouse, Kafka, webhooks, and more)

**Create a pipeline from a definition file:**

```bash
goldsky pipeline create my-horizen-pipeline \
  --definition-path ./pipeline.json
```

Definition files are useful for complex pipelines with multiple sources or sinks.



## Reference Links

| Resource | URL |
|---|---|
| Goldsky Documentation | `https://docs.goldsky.com` |
| Deploying Subgraphs Guide | `https://docs.goldsky.com/subgraphs/deploying-subgraphs` |
| Instant Subgraphs Guide | `https://docs.goldsky.com/subgraphs/instant-subgraphs` |
| Mirror Pipelines Guide | `https://docs.goldsky.com/mirror/introduction` |
