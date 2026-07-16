# Horizen Documentation — Agent Instructions

Horizen is an EVM-identical L3 on Base (Ethereum L2) using the OP Stack. It adds compliant, verifiable privacy via VELA, a confidential execution coprocessor powered by Trusted Execution Environments (TEEs).

## Key Files for AI/LLM Access

- `/llms.txt` — structured index of all documentation pages
- `/llms-full.txt` — complete documentation in markdown (~300KB, for full-context retrieval)
- `/llms-ctx.txt` — minimal curated quick-reference for coding assistants

## Developer Quickstart

- Deploy standard Solidity contracts using Foundry or Hardhat (same tooling as Base/Ethereum)
- Mainnet chain ID: 26514 | Testnet chain ID: 2651420
- Native governance token: ZEN
- RPC and contract addresses: see `/docs/network-details`

## Documentation Sections

- **Getting Started** — environment setup, first contract deployment
- **Architecture** — L3 design, OP Stack integration, Base settlement
- **VELA** — confidential execution coprocessor, TEE privacy model
- **Tutorials** — step-by-step guides for common developer tasks
- **Reference** — RPC endpoints, contract addresses, chain parameters
