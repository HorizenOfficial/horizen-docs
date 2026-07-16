---
title: Multisig Wallets (Den)
description: "Set up and manage multisig wallets on Horizen using Den and Safe contracts."
sidebar_position: 3
---

Den is the multisig wallet interface for Horizen Chain. It is a **self-custodial, multi-signature wallet** built on top of **Safe contracts** — the most widely audited and trusted smart contract wallet infrastructure in the EVM ecosystem, securing billions in assets across hundreds of protocols.

Den is available for Horizen at: **`https://safe.horizen.io/welcome`**

With Den on Horizen you can:

- Create and manage new Safe multisig wallets on Horizen Chain
- Import and use existing Safe wallets
- Create, simulate, and execute transactions
- Batch multiple transactions into a single execution
- Manage signers and approval thresholds



## Creating a New Multisig Wallet

1. Go to `https://safe.horizen.io/welcome` and connect your wallet
2. Click **Create new Safe**
3. Give your Safe a name
4. Add the signer addresses and set the required approval threshold (e.g. 2-of-3)
5. Review the setup and deploy — this submits a contract deployment transaction on Horizen
6. Once confirmed, your multisig is live and ready to use

Full guide: [docs.onchainden.com/set-up-den/creating-and-managing-safes](https://docs.onchainden.com/set-up-den/creating-and-managing-safes)



## Using an Existing Safe

If you already have a Safe deployed on another EVM network, you can import it into Den on Horizen using the same address (EVM addresses are consistent across chains).

Guide: [docs.onchainden.com/set-up-den/using-existing-safes](https://docs.onchainden.com/set-up-den/using-existing-safes)



## Creating Transactions

1. Open your Safe in Den at `https://safe.horizen.io`
2. Click **New Transaction**
3. Choose the transaction type: send assets, contract interaction, or raw transaction
4. Fill in the details and click **Create**
5. Share with co-signers — each required signer approves via their wallet
6. Once the threshold is reached, any signer can execute the transaction on-chain

Guide: [docs.onchainden.com/creating-transactions/getting-started](https://docs.onchainden.com/creating-transactions/getting-started)



## Simulating Transactions

Before executing a multisig transaction on-chain, Den lets you simulate it to preview exactly what state changes will occur — token transfers, contract state changes, and any potential reverts — without spending gas.

Guide: [docs.onchainden.com/creating-transactions/simulations](https://docs.onchainden.com/creating-transactions/simulations)



## Batching Transactions

Den supports batching multiple transactions into a single on-chain execution. This is particularly useful for DeFi operations (e.g. approve + swap in one step) or protocol management actions that need to be atomic.

Guide: [docs.onchainden.com/creating-transactions/batching](https://docs.onchainden.com/creating-transactions/batching)



## Reference Links

| Resource | URL |
|---|---|
| Den on Horizen | `https://safe.horizen.io/welcome` |
| Den Documentation | `https://docs.onchainden.com` |
| Create & Manage Safes | `https://docs.onchainden.com/set-up-den/creating-and-managing-safes` |
| Using Existing Safes | `https://docs.onchainden.com/set-up-den/using-existing-safes` |
| Creating Transactions | `https://docs.onchainden.com/creating-transactions/getting-started` |
| Simulating Transactions | `https://docs.onchainden.com/creating-transactions/simulations` |
| Batching Transactions | `https://docs.onchainden.com/creating-transactions/batching` |

