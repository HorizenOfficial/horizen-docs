---
title: Troubleshooting & FAQ
description: "Common issues and solutions for the ZEN token migration and claim process."
---


### I've copied my address from Sphere wallet but I get an error saying I'm using a testnet address

There are two versions of Sphere, one for testnet, and one for mainnet. Make sure you are using the production version of Sphere when copying addresses.

### I've followed all the steps but I'm not able to process the transaction, or an insufficient funds error is showing up in my wallet

Make sure you have ETH in your wallet on Base L2. You need at least **0.000004 ETH per claim**. See the [Prerequisites](/migration/claiming-zen#prerequisites) section for instructions on getting ETH on Base.

### It's saying I need to connect to the Base network but I don't know how

You may need to add the network to your wallet manually. Using MetaMask as an example:

Click on the **Add Custom Network** button at the bottom of the network dropdown on the top left of MetaMask.

Enter the following credentials for Base Mainnet:
```text
Network Name: Base Mainnet
RPC URL: https://mainnet.base.org
Chain ID: 8453
Symbol: ETH
Block Explorer URL: https://basescan.org
```

### The claim portal is saying I've entered an incorrect signature

- Message format should not have any commas, apostrophes, or quotations.
- Use the appropriate claim prefix.
- Message format is: `ZENCLAIM` + destination address (no space between them).
- Make sure the signature was made from the same Horizen wallet address you created the signature with.
- The destination address entered must match the one you used to sign the message.
- Double check to make sure the wallet addresses entered have no typos.

### I don't have an EVM address yet or am not able to connect my wallet

Make sure that you have a wallet extension installed on your browser/device. A common EVM wallet to use is [MetaMask](https://metamask.io/).

### I'm seeing a message about interacting with the wallet for the first time, what should I do?

If you see a message about a first-time interaction, this is normal. Just click the **Got It** button and proceed.

### I have a wallet installed but I don't know how to connect it

On the claim portal page there is a **Connect Wallet** button. Click this and follow the steps. Make sure that popups are not blocked as this is how wallets connect to a dApp. Once connected you should see your wallet address displayed where the button was.

### I've finished my claim but ZEN is not showing up in my wallet

Make sure to import the ZEN token into your wallet. In MetaMask, go to **Import Tokens** and add the ZEN ERC-20 contract address on Base. See the [Claim Page](/migration/migration-tools#claim-page) section in the migration tools guide.

### I added up my Mainchain ZEND balance and EON balance, but the total doesn't exactly match what I see in MetaMask. Why?

MetaMask may truncate decimal values when displaying token balances. This can cause your displayed ZEN balance to appear slightly different than what you expected.

For the most accurate result, check the precise token amounts on the block explorers:

- For your ZEND Mainchain balance: https://explorer.horizen.io
- For your EON balance: https://eon-explorer.horizenlabs.io/
- For your final Base ZEN balance (after claiming): https://basescan.org

When doing your addition, make sure to use the exact numbers shown on the explorers — not the rounded balances in MetaMask.
