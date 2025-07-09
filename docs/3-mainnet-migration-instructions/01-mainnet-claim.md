# Start Here - Prerequisites

This guide will explain how to claim ZEN from the Horizen ZEND mainchain to Base L2 chain. Importantly, there is no time window in place for claiming tokens.

## Get ETH First
Before going through the claim process you will need to have some ETH on Base L2 to process the claim. Please ensure you have at least **0.004 ETH per claim** to cover the necessary transaction costs. If you have multiple claims, the total amount in your wallet must be sufficient to cover all of them.

**Getting ETH on Base (Required to Claim ZEN)**

#### Option 1: Use a Centralized Exchange (Recommended Path)
The most straightforward way to get ETH on Base is by using a centralized exchange like Coinbase, Binance.	

1. Buy ETH on your preferred exchange.
2. Withdraw it to your Base wallet address (e.g., MetaMask).
   - If using Coinbase and Binance, select “Base” as the destination network.
   - For other exchanges, users may need to first withdraw to Ethereum and then bridge to Base using a third-party bridge. See below for bridging instructions. 

#### Option 2: Bridge ETH from Ethereum or Other Chains to Base
If your exchange doesn’t support direct Base withdrawals, or if you already have ETH on another network (like Ethereum Mainnet, Arbitrum, or Optimism), you can bridge ETH to Base using a third-party bridge. For bridging ETH from Ethereum to Base, the recommendation is to use [Superbridge](https://superbridge.app/base).

1. Connect your wallet (e.g., MetaMask).
2. Choose the source network and Base as the destination.
3. Enter the amount and confirm the bridge transaction.
4. ETH will typically arrive on Base within a few minutes.

#### Option 3: Buy ETH Using Credit Card or Local Payment
Some services allow you to buy ETH directly on Base using a debit card, credit card, or other local payment methods. Popular onramps include [MoonPay](https://www.moonpay.com/) or [Onramp](https://onramp.money/). Note that these services usually require a minimum purchase of $20-$25. Once ETH is obtained, make sure to follow the instructions (in Option 2) to bridge ETH over to Base. 

#### Final Tip
To confirm that you’ve received ETH on Base, check your wallet (e.g., MetaMask) or visit https://basescan.org. Once you see ETH in your Base wallet, you’re ready to claim your ZEN.

## Claim Process
Claiming is a two step process, first you will sign a message with your old Horizen wallet, then you will submit a claim with your new wallet on Base.

**Step 1: Create a Signature**<br/>
**Step 2: Submit the Claim**

## Create A Signature
The process for creating a signature **varies depending on your wallet**. Messages have to use the format shown below. Signing messages and claiming requires providing an EVM compatible destination address. This will be the Base address where ZEN will be sent to after claiming. **Note that this should NOT be an exchange deposit address**.

Mainnet Message Format
```
"ZENCLAIM" + destinationAddress
```

For example, if your destination address is `0x1B9aCc8d2c9e20aC2e78904e6f123f2D22Dd2A8w` then your message format will be the following:
```
Mainnet message example: 
ZENCLAIM0x1B9aCc8d2c9e20aC2e78904e6f123f2D22Dd2A8w
```

Save your message format as it will be used when generating a signature.

Instructions for claiming will vary depending on where and how you are holding ZEN. Choose from one of the bullet points below:

- [Sphere Wallet Users](/mainnet-migration-instructions/sphere-wallet-users)
- [Ledger Wallet Users](/mainnet-migration-instructions/ledger-wallet-users)
- [Other Wallet Users](/mainnet-migration-instructions/other-wallet-users) <br/>For users who manage ZEN with other wallets not listed above. Note that users need access to their private keys in order to use this tool.
- [Super Users - CLI Tool](#cli-tool) <br/>For users or organizations who manage multiple wallet addresses, have access to private keys, and need to generate multiple signatures. This tool can also be used to claim from multiple wallets.
