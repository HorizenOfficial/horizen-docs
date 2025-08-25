# How to Bridge ETH from Sepolia to Horizen Testnet

## Video Guide

This is the video, step by step guide that you can follow: [Link here](https://next.frame.io/share/8595fc25-cc47-4a4d-9df8-07c3d46a2a5a/view/82ab09ec-68dd-4174-9e49-5ddd0ee23677).

Follow these steps to move ETH from Sepolia into the Horizen Testnet so you can trade on DarkSwap.

## Step 1: Get Sepolia ETH

- Use any public faucet to request Sepolia ETH ([Google Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)). 
- This ETH will cover gas fees for your test transactions.

## Step 2: Bridge Sepolia → Base Sepolia

- Go to [Superbridge](https://superbridge.app/base-sepolia).
- Connect your wallet on Sepolia.
- Bridge your SepoliaETH to Base Sepolia.

## Step 3: Bridge Base Sepolia → Horizen Testnet

1. Go to [Horizen Bridge](https://horizen-bridge.vercel.app/).
2. **Create a Base Smart Wallet**: The bridge will prompt you to create one if you don’t have it already.
3. **Fund your Smart Wallet**: Transfer your Base SepoliaETH into the Base Smart Wallet. 
4. **Change Receiver**: On the bridge, set the receiver to your **Horizen wallet address** (click “Send to 0x… on Horizen”).
5. **Execute the Bridge**: Bridge funds from your Base Smart Wallet (on Base Sepolia) to your wallet on Horizen Testnet.

## Step 4: Verify on Explorer

- Open [Horizen Explorer](https://horizen-explorer-testnet.appchain.base.org/).
- Enter your wallet address to confirm your bridged ETH has arrived.

✅ You’re now funded with ETH on Horizen Testnet and ready to trade on Darkswap.

**A tutorial video is available to guide you through the process:** [Link](https://f.io/JO8WE45q)

## Tips & Network Setup

- Use **the same wallet address** when claiming Sepolia faucet ETH and when receiving ETH on Horizen
- **MockUSDC on Sepolia**: 0xA182eE3e160C7Ae37E7B55d4663FaE66a11406cc
- **MockUSDC on Horizen Testnet**: 0x152f1051c8D37Fba9A362Fc9b32a0eeF8496202F

## Base Sepolia Network

- Network Name: Base Sepolia
- New RPC URL: https://sepolia.base.org
- Chain ID: 84532
- Currency Symbol: ETH

## Horizen Testnet Appchain

- Network Name: Horizen Testnet (Base Appchain)
- New RPC URL: https://horizen-rpc-testnet.appchain.base.org
- Chain ID: 845320009
- Currency Symbol: ETH
