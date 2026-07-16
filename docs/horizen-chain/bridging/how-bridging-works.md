---
title: How Bridging Works on Horizen
description: "How the native OP Stack bridge works for moving assets to and from Horizen."
sidebar_position: 1
---

## The Native Bridge

Horizen supports two bridges: the **native OP Stack bridge** and the **Stargate bridge**. This page covers how the native bridge works — it is the canonical, most trust-minimized way to move ETH between Base and Horizen. For bridging ZEN, USDC, cbBTC, or other chains, see [Bridge Assets via Stargate](./bridge-assets-stargate.md).

| Network | Bridge URL |
| --- | --- |
| Mainnet | `https://hub.horizen.io/` |
| Testnet | `https://hub-testnet.horizen.io/` |

The native bridge relies entirely on the OP Stack's optimistic rollup security model —
the same model that secures Base itself. No third-party protocol is involved in the
bridging path.


## Deposit and Withdrawal Mechanics

Moving assets in each direction behaves very differently. Understanding this before
you bridge will prevent surprises.

### Deposits: Base → Horizen

Deposits are straightforward and fast. When you deposit from Base to Horizen:

1. Your ETH (or supported asset) is locked in the bridge contract on Base
2. An equivalent amount is minted on Horizen
3. Funds arrive on Horizen **within a few minutes**

There is no challenge window for deposits. Once the transaction is confirmed on Base
and the Horizen Sequencer processes it, your funds are available.

<div style={{display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', margin: '24px 0'}}>
  <div style={{flex: '1 1 260px', maxWidth: '420px', textAlign: 'center'}}>
    <img src="/horizen-chain/bridge1.png" alt="Bridge UI — set direction from Base to Horizen" style={{width: '100%', borderRadius: '8px', border: '1px solid #e5e7eb'}} />
    <p style={{fontSize: '13px', color: '#666', marginTop: '6px'}}>Set direction: Base → Horizen</p>
  </div>
  <div style={{flex: '1 1 260px', maxWidth: '420px', textAlign: 'center'}}>
    <img src="/horizen-chain/bridge2.png" alt="Bridge UI — enter deposit amount" style={{width: '100%', borderRadius: '8px', border: '1px solid #e5e7eb'}} />
    <p style={{fontSize: '13px', color: '#666', marginTop: '6px'}}>Enter amount and confirm</p>
  </div>
  <div style={{flex: '1 1 260px', maxWidth: '420px', textAlign: 'center'}}>
    <img src="/horizen-chain/bridge3.png" alt="Deposit success screen" style={{width: '100%', borderRadius: '8px', border: '1px solid #e5e7eb'}} />
    <p style={{fontSize: '13px', color: '#666', marginTop: '6px'}}>Deposit confirmed</p>
  </div>
</div>

### Withdrawals: Horizen → Base

Withdrawals are a two-step process and take significantly longer due to the
**7-day challenge window** that is a core property of the optimistic rollup model.


<div style={{margin: '24px 0', textAlign: 'center'}}>
  <img src="/horizen-chain/WithdrawalsOnHorizen.png" alt="Withdrawal flow diagram — two-step process with 7-day challenge window" style={{width: '100%', maxWidth: '720px', borderRadius: '8px'}} />
</div>


:::warning 7-Day Withdrawal Window
Withdrawals from Horizen to Base take a minimum of **7 days** to complete.
It is the security mechanism of the optimistic rollup
model. Plan accordingly. Do not initiate a withdrawal if you need your funds on Base
sooner than 7 days from now.
:::

:::note Two Transactions Required
A withdrawal requires **two separate transactions**:
- Transaction 1: Initiate the withdrawal on Horizen (costs gas on Horizen)
- Transaction 2: Claim the funds on Base after 7 days (costs gas on Base)

You must return to `https://hub.horizen.io/` after the 7-day window to complete
the claim. Funds are not automatically sent to your Base wallet.
:::

<div style={{display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', margin: '24px 0'}}>
  <div style={{flex: '1 1 320px', maxWidth: '560px', textAlign: 'center'}}>
    <img src="/horizen-chain/bridge4.png" alt="Bridge UI — set direction from Horizen to Base" style={{width: '100%', borderRadius: '8px', border: '1px solid #e5e7eb'}} />
    <p style={{fontSize: '13px', color: '#666', marginTop: '6px'}}>Step 1 — Initiate: set direction Horizen → Base, enter amount</p>
  </div>
  <div style={{flex: '1 1 320px', maxWidth: '560px', textAlign: 'center'}}>
    <img src="/horizen-chain/bridge5.png" alt="Claim is ready screen after 7-day window" style={{width: '100%', borderRadius: '8px', border: '1px solid #e5e7eb'}} />
    <p style={{fontSize: '13px', color: '#666', marginTop: '6px'}}>Step 2 — Claim: return after 7 days and submit the claim on Base</p>
  </div>
</div>



## What the Bridge Supports

The native bridge currently supports **ETH** between Base and Horizen.

:::note
Additional assets may be available through the bridge UI. Always verify the asset
list directly at `https://hub.horizen.io/` — this documentation reflects the state
at the time of writing and the bridge may be updated independently.
:::



## Trust Model

The native bridge inherits the full security of the OP Stack and Base:

- **Deposits** are secured by Base's smart contracts and finality guarantees
- **Withdrawals** are secured by the 7-day optimistic challenge window — any
  invalid state can be disputed during this period before funds are released
- **No third party** is involved in the bridging path — there is no relayer,
  liquidity provider, or off-chain validator between you and the contracts

This makes the native bridge the most trust-minimized option available. The
tradeoff is the 7-day withdrawal window.
