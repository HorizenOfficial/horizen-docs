# Troubleshooting & FAQ
**1. I’ve copied my address from Sphere wallet but I get an error saying I’m using a testnet address?**

There are two versions of Sphere, one for testnet, and one for mainnet. Make sure you are using the production version of Sphere when copying addresses.


**2. I’ve followed all the steps but I’m not able to process the transaction, or an insufficient funds error is showing up in my wallet?**

You may see a message like the following

<img src="/img/migration-tools/insufficient-funds.png" alt="Insufficient funds screen" style={{ maxWidth: "400px", width: "100%" }} />

Make sure you have ETH in your wallet on Base L2. Instructions for getting ETH are in the intro section of this document: 

[Introduction](#introduction)

**3. It’s saying I need to connect to the Base network but I don’t know how.**

You may need to add the network to the list of connected networks in your wallet. Usually this shows up automatically for common networks like Base, but here's instructions on how to add it manually. 

Using Metamask as the example wallet (Network credentials are the same for other wallets).

Click on the **Add Custom Network** button at the bottom of the dropdown on the top left of Metmask wallet.

<img src="/img/migration-tools/select-a-network.png" alt="Select a Network screen" style={{ maxWidth: "400px", width: "100%" }} />

Enter the following credentials for Base Mainnet network.
```
Network Name: Base Mainnet
RPC URL: https://mainnet.base.org
Chain ID: 8453
Symbol: ETH
Block Explorer URL: https://basescan.org
```

**4. The claim portal is saying I’ve entered an incorrect signature.**

- Message format should  
  - Not have any commas, apostrophes, or quotations.  
  - Use the appropriate claim prefix.   
  - Message format is as described here: [Message Signing Instructions](#message-signing-instructions)  
- Make sure the signature was made from the same Horizen wallet address you created the signature with.  
- Importantly you need to enter the same destination address as the one you used to sign the message.   
- Double check to make sure the wallet addresses entered have no typos.

**5. I don’t have an EVM address yet or am not able to connect my wallet.**

Make sure that you have a wallet extension installed on your browser/device. A common EVM wallet to use is [MetaMask](https://metamask.io/). 

**6. I'm seeing a message about interacting with the wallet for the first time, what should I do?**

If you see the message below it is common and not to worry, just click the **Got It** button

<img src="/img/migration-tools/first-interaction.png" alt="1st Interaction screen" style={{ maxWidth: "400px", width: "100%" }} />

**7. I have a wallet installed but I don’t know how to connect it.**

On the claim portal page there is a Connect Wallet button. Click this and follow the steps. Make sure that popups are not blocked as this is how wallets connect to a dApp.

![Claim page connect wallet button](/img/migration-tools/connect-1.png)
Once connected you should see your wallet address show up where the button is. 
![Claim page address displayed](/img/migration-tools/connect-2.png)

**8. I’ve finished my claim but ZEN is not showing up in my wallet.**

Make sure to import the token as described in step 2 of the [Claim Page](#claim-page) section.


**9. I added up my Mainchain ZEND balance and EON balance, but the total doesn’t exactly match what I see in MetaMask. Why?**

MetaMask may truncate decimal values when displaying token balances. This can cause your displayed ZEN balance to appear slightly different than what you expected based on your own calculations.

For the most accurate result, check the precise token amounts on the block explorers:

- For your ZEND Mainchain balance: https://explorer.horizen.io
- For your EON balance: https://eon-explorer.horizenlabs.io/ 
- For your final Base ZEN balance (after claiming): https://basescan.org 

When doing your addition, make sure to use the exact numbers shown on the explorers - not the rounded balances in MetaMask.

![Check balance on BaseScan](/img/migration-tools/basescan-balance.png)
<img src="/img/migration-tools/metamask-balance.png" alt="See balance on MetaMask" style={{ maxWidth: "400px", width: "100%" }} />
