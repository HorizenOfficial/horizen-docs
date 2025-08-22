# Make a Trade on DarkSwap (Horizen Testnet)


## Video Guide

This is the video, step by step guide that you can follow: [Link here](https://next.frame.io/share/f5f81519-c482-4af5-bc72-f99813ced875/view/42c1688a-50d4-4ea5-b24c-56ea27c094a2).

## Prerequisites

- **EVM wallet** (e.g., MetaMask).
- **Gas**: Some ETH on Horizen Testnet (Sepolia ETH bridged in).

Tip: [Learn how to bridge ETH from Base to Horizen Testnet Here](https://docs.google.com/document/d/19bdP6938AZSn9936UN1nCaA5ccvMtgGJ-LwNA9qWGK4/edit?usp=sharing)

## [DarkSwap Testnet App](https://uat-app.darkswap.me/)

## Steps

1. **Connect your wallet**
  - Click the wallet button (top-right).
  - Select your EVM wallet and connect.
2. **Choose an order type tab**
  - Left side of the screen.
  - Choose an order type tab: **Limit**, **Stop Limit**, or **Take Profit**.
3. **Choose what you’re trading**
  - **You sell**: e.g., **ETH** (enter the amount).
  - **You get**: e.g., **MockUSDC** (the UI will show the expected amount).
4. **Set the price logic**
  - **Limit**: Enter **Limit price** (price you want).
  - **Stop Limit**: Enter **Trigger price** (when to place) and **Limit price** (price to place at).
  - **Take Profit**: Enter **Trigger price** and **Limit price** for your take-profit.
  - Or tick **Use Market Price** to execute at the current displayed rate.
5. **Review details**
  - Check the live **Rate** (e.g., 1 ETH = 4235.96 MockUSDC).
  - **Service fee** and **Time in force** (default: **Good till cancelled**).
6. **Create the order**
  - Click **Create order**.
  - Confirm the transaction in your wallet.
7. **Track and manage your order**
  - Use the **Order Management dashboard** (center panel).
  - Filter by **All / Settled / Finalized / Open / Not triggered / Cancelled**.
  - **Status meanings**:
    - **Open**: Awaiting trigger/fill.
    - **Settled**: Executed in the protocol.
    - **Finalized**: Claimed/finished in your wallet.
    - **Not triggered**: Waiting for price to hit your trigger.
    - **Cancelled**: You cancelled it.
  - **Quick Actions**:
    - **Finalize** to complete settlement/claim outputs.
    - **Cancel** to stop an open/not-triggered order.
8. **Verify receipt**
  - After **Finalize**, check your wallet for the **You get** token (e.g., MockUSDC) in your wallet. 
  - If your wallet doesn’t show it, add the token as a “custom/hidden asset.”
9. **Track on Explorer**
  - You can view your order creation on the [Horizen Testnet Explorer](https://horizen-explorer-testnet.appchain.base.org/)
  - **Note: Only order creation is visible on-chain—you cannot see pair details or execution paths.**
