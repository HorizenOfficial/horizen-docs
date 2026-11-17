# Horizen Documentation — Agent Instructions

Horizen's developer documentation covers **Vela**, a confidential execution coprocessor by Horizen Labs; the **ZEN token migration** to Base; and **Horizen DAO governance**. Vela runs application logic as WebAssembly (compiled from Go with TinyGo) inside a Trusted Execution Environment (AWS Nitro Enclave), signs every result under hardware attestation, and settles verifiable, confidential results on-chain. It is chain-agnostic and live (gated / early access) on Base. The standalone Horizen Chain (EVM L3) has been wound down; its routes now redirect into the sections below.

## Key Files for AI/LLM Access

- `/llms.txt` — structured index of all documentation pages
- `/llms-full.txt` — complete documentation in markdown (for full-context retrieval)
- `/llms-ctx.txt` — minimal curated quick-reference for coding assistants

## Per-Page Markdown

Every documentation page has a raw markdown endpoint at the same URL path with `.md` appended:
- HTML page: `https://docs.horizen.io/vela/introduction`
- Raw markdown: `https://docs.horizen.io/vela/introduction.md`

## Developer Quickstart (Vela)

- Build confidential apps as WASM modules written in Go and compiled with TinyGo; implement the exported functions (`deploy`, `load_module`, `deposit`, `process_request`, `trusted_request`) that the Vela Executor calls.
- Smart contracts are the entrypoint and exitpoint: submit an encrypted request, then verify the attested, signed result on-chain.
- Develop locally via Docker with a software-emulated TEE (no AWS account required); Vela is live (gated / early access) on Base mainnet and Base Sepolia.
- Current release: v0.2.0. Client library: `@horizen/vela-common-ts`.
- Start at `/vela/getting-started/prerequisites`.

## Documentation Sections

- **Vela** — confidential execution coprocessor (TEE), organized as:
  - Getting Started: prerequisites, local environment setup, first confidential app
  - Roadmap: what's available today and what's coming next
  - Reference: smart contracts, TypeScript client, trigger contracts, WASM development
- **Migration** — ZEN token migration from the legacy Horizen mainchain (ZEND) and EON to a ZEN ERC-20 on Base (completed July 23, 2025; manual claim for ZEND holders, no deadline)
- **Governance** — Horizen DAO: overview, proposal categories, voting process (ZenIP), and reference (foundational documents, transparency report)
