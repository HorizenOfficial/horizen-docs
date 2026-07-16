---
title: "Bridge Assets via Native Bridge"
description: Step-by-step instructions for depositing assets from Base to Horizen and withdrawing assets from Horizen back to Base using the native bridge.
sidebar_position: 2
---


This page covers step-by-step instructions for using the Horizen native bridge.

:::note Before You Start
- You need a Web3 wallet (MetaMask, Rabby, or Coinbase Wallet)
- **Deposits:** Ensure your wallet has ETH on **Base** (mainnet) or
  **Base Sepolia** (testnet)
- **Withdrawals:** Ensure your wallet has ETH on **Horizen** and enough
  ETH to cover gas on Base when you return to claim
- Always test with a small amount first
:::


## Deposit: Base → Horizen

Use this flow to move ETH from Base into Horizen Chain. The estimated time is a few minutes after Base confirmation

### Steps

**1. Open the bridge**

Go to `https://hub.horizen.io/` (mainnet) or `https://hub-testnet.horizen.io/`
(testnet) in your browser.

**2. Connect your wallet**

Click **Connect Wallet** and approve the connection in your wallet. Make sure your
wallet is set to **Base** (mainnet) or **Base Sepolia** (testnet) before connecting.

**3. Set the direction**

In the **From** field, select **Base**.
In the **To** field, select **Horizen**.

**4. Enter the amount**

Enter the amount of ETH you want to bridge. Leave enough ETH in your Base wallet to
cover the transaction gas fee.

**5. Confirm the transaction**

Click **Confirm** and approve the transaction in your wallet. The transaction is
submitted to Base.

**6. Wait for arrival**

Your ETH will arrive on Horizen within a few minutes. You can verify the balance
by checking your wallet address on the Horizen explorer:

- Mainnet: `https://explorer.horizen.io/`
- Testnet: `https://explorer-testnet.horizen.io/`

:::note
If your wallet is not yet configured for Horizen, add the network first.
See [Network Configuration →](/horizen-chain/network/mainnet) for the RPC details.
:::



## Withdrawal: Horizen → Base

Use this flow to move ETH from Horizen Chain back to Base.

:::warning Read This Before You Withdraw
Withdrawals take a minimum of **7 days** to complete due to the optimistic rollup
challenge window. This is the security mechanism of the bridge.

You will need to return to the bridge after 7 days to complete a second transaction
(the Claim) on Base. **Funds are not automatically sent to your Base wallet.**
:::

**Estimated time:** 7 days minimum from initiation to receipt on Base

### Step 1 - Initiate the Withdrawal on Horizen

**1. Open the bridge**

Go to `https://hub.horizen.io/` (mainnet) or `https://hub-testnet.horizen.io/`
(testnet).

**2. Connect your wallet**

Click **Connect Wallet** and approve the connection. Make sure your wallet is set to
**Horizen** (mainnet) or **Horizen Testnet**.

**3. Set the direction**

In the **From** field, select **Horizen**.
In the **To** field, select **Base**.

**4. Enter the amount**

Enter the amount of ETH you want to withdraw. Leave enough ETH in your Horizen
wallet to cover the gas fee for this transaction.

**5. Confirm the transaction**

Click **Confirm** and approve the transaction in your wallet. This submits the
withdrawal transaction on Horizen. Once confirmed, the 7-day challenge window begins.

:::note
Keep a record of your transaction hash. You can look up the transaction on the
Horizen explorer to confirm it was included.
:::

---

### Step 2 - Claim on Base (after 7 days)

After the 7-day challenge window has passed, you must return to the bridge to
release your funds on Base. The bridge will show a **Claim** button for any
pending withdrawal that is ready.

**1. Return to the bridge**

Go to `https://hub.horizen.io/` and connect the same wallet you used to initiate
the withdrawal.

**2. Locate your pending withdrawal**

The bridge will display your pending withdrawal with a **Claim** button once the
7-day window has elapsed.

**3. Switch to Base**

Switch your wallet to **Base** (mainnet) before claiming. The claim transaction
is executed on Base.

**4. Submit the claim**

Click **Claim** and approve the transaction in your wallet. This calls the
`OptimismPortal` contract on Base, which releases your ETH.

**5. Confirm receipt**

Your ETH will arrive in your Base wallet once the claim transaction is confirmed.
You can verify this on [Basescan](https://basescan.org).



## Troubleshooting

**My deposit hasn't arrived after 10 minutes**

Check the transaction status on the Horizen block explorer using your wallet address.
If the deposit transaction is confirmed on Base but has not appeared on Horizen,
wait a few more minutes — the Sequencer may be slightly delayed. If the issue
persists, check the [Horizen Discord](https://discord.gg/horizen) for any
known network issues.

**I can't see my Claim button after 7 days**

Make sure you are connected with the same wallet address used to initiate the
withdrawal, and that your wallet is set to **Base**. If the claim button is still
not visible, the 7-day window may not have fully elapsed — check the initiation
transaction timestamp on the explorer.

**I accidentally closed the browser during the withdrawal**

Your withdrawal is recorded on-chain. Return to `https://hub.horizen.io/`, reconnect
the same wallet, and the pending withdrawal will be visible. You do not need to
re-initiate anything.

**I sent ETH to the bridge contract address directly**

Do not interact with bridge contracts directly unless you are using the official
bridge UI or the OP Stack SDK. Direct contract calls require specific parameters
and incorrect usage can result in lost funds. If you have done this, contact
the Horizen team immediately via [Discord](https://discord.gg/horizen).

