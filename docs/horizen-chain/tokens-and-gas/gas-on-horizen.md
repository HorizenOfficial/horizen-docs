---
title: Gas on Horizen (ETH)
description: "How gas fees work on Horizen: L3 execution fee and L1 data fee, both paid in ETH."
sidebar_position: 1
---

Gas on Horizen Chain is paid in ETH, which is the same as on Base and Ethereum mainnet. There is no separate gas token. If you've deployed on Base, the fee mechanics on Horizen are identical.

## How gas fees work on an L3

Every transaction on Horizen has two fee components:

- **L3 execution fee** — the cost of running your transaction on Horizen itself. Calculated the same way as any EVM chain: `gas used × gas price`.
- **L1 data fee** — a small additional fee covering the cost of publishing your transaction data to Base. The OP Stack calculates and appends this automatically — you do not set it manually. It appears as a separate line item in the transaction receipt.

In practice, fees on Horizen are very low. As an L3 on Base, Horizen benefits from Base's already-low data costs, with the L1 data fee typically being a small fraction of the total transaction cost.

## Getting ETH on Horizen

1. **Testnet:** Use the faucet at [https://hub-testnet.horizen.io/](https://hub-testnet.horizen.io/).
2. **Mainnet:** Bridge ETH from Base to Horizen via [https://hub.horizen.io/](https://hub.horizen.io/).