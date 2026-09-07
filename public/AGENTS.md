# Horizen Documentation — Agent Instructions

Horizen is an EVM-identical L3 on Base (Ethereum L2) using the OP Stack. It adds compliant, verifiable privacy via Vela, a confidential execution coprocessor powered by Trusted Execution Environments (TEEs).

## Key Files for AI/LLM Access

- `/llms.txt` — structured index of all documentation pages
- `/llms-full.txt` — complete documentation in markdown (~300KB, for full-context retrieval)
- `/llms-ctx.txt` — minimal curated quick-reference for coding assistants

## Per-Page Markdown

Every documentation page has a raw markdown endpoint at the same URL path with `.md` appended:
- HTML page: `https://docs.horizen.io/horizen-chain/network/mainnet`
- Raw markdown: `https://docs.horizen.io/horizen-chain/network/mainnet.md`

## Developer Quickstart

- Deploy standard Solidity contracts using Foundry or Hardhat (same tooling as Base/Ethereum)
- Mainnet chain ID: 26514 | Testnet chain ID: 2651420
- Native governance token: ZEN
- RPC and contract addresses: see `/horizen-chain/api-reference/contract-addresses`

## Documentation Sections

- **Getting Started** — environment setup, first contract deployment
- **Architecture** — L3 design, OP Stack integration, Base settlement
- **Vela** — confidential execution coprocessor (TEE), organized as:
  - Getting Started: prerequisites, local environment setup, first confidential app
  - Roadmap: what's available today and what's coming next
  - Developer Reference: smart contracts, TypeScript client, trigger contracts, WASM development
- **Tutorials** — step-by-step guides for common developer tasks
- **Reference** — RPC endpoints, contract addresses, chain parameters
