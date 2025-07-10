# Mainnet Claim Instructions
## Introduction

This guide will explain how to claim ZEN from the Horizen ZEND mainchain to Base L2 chain. Importantly there is no time window in place for claiming tokens. Note, if you have ZEN on the Horizen EON sidechain, your wallet will automatically receive an equivalent airdrop of ZEN tokens on Base L2 when the migration occurs.

Horizen is providing a web application for the purpose of claiming: https://www.horizen.io/zenclaim . Claiming will be different depending on the wallet you are using to hold ZEN. This guide will walk you through the process and is fairly straightforward:
- Sign a message with your wallet which holds ZEN (Sphere, Ledger, etc).
- Go to the claim page.
- Connect your Base wallet.
- Enter the signed message.
- Claim ZEN.

We have provided a [video tutorial](https://www.youtube.com/watch?v=0PjRQjFE5jI) of this process (using the Sphere wallet) which you could also use as a guide. 

The Horizen team will also be readily available on migration day to help users throughout this process via our [Discord](https://horizen.io/invite/discord) channel. **Please take a moment to review this tutorial first; many common questions are answered here.**


## Prerequisites
Before going through the claim process you will need to have some ETH on Base L2 to process the claim. Please ensure you have at least **0.001 ETH per claim** to cover the necessary transaction costs. If you have multiple claims, the total amount in your wallet must be sufficient to cover all of them.

### Getting ETH on Base (Required to Claim ZEN)

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
Claiming is a two step process. First you will sign a message with your old Horizen wallet, then you will submit a claim with your new wallet on Base.

### Step 1: Create a Signature  
Before claiming, you must generate a valid signature. You must do this to confirm ownership of your wallet.

Please go to the following section to learn how to generate a signature:
- [Message Signing Instructions](#message-signing-instructions)

Once you've created your signature, save it for the next step in the claiming process.

### Step 2: Submit the Claim
Most users with just a few addresses can easily claim their ZEN through the claim page.
Additionally, Horizen has provided a [CLI Tool](#cli-tool) for users or organizations who manage multiple addresses. 
- [Claim Page](#claim-page)
- [CLI Tool](#cli-tool)


## Message Signing Instructions
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

Save your message format as it will be used when generating a signature. Use one of the following tools to generate a signed message. 

- [Sphere Wallet](#sphere-wallet): <br/>For users who manage ZEN with Sphere Wallet.
- [Ledger Signing Tool](#ledger-signing-tool): <br/>For users who manage ZEN with Ledger Wallet.
- [Private Key Signing Tool](#private-key-signing-tool): <br/>For users who manage ZEN with other wallets not listed above. Note that users need access to their private keys in order to use this tool.
- [CLI Tool](#cli-tool): <br/>For users or organizations who manage multiple wallet addresses, have access to private keys, and need to generate multiple signatures. This tool can also be used to claim from multiple wallets.

### Sphere Wallet

If you have your seed phrase, you can use [Sphere](https://github.com/HorizenOfficial/Sphere_by_Horizen_Private/releases/latest) to sign a message.

1. Open Sphere and import your seed phrase (if not already imported).
2. Verify that your wallet addresses and balances are correct.
3. To generate a signature, click on this icon in your Sphere address and enter the message in the “Message to be signed” box as shown below.

   ![Sign a message with Sphere](/img/migration-tools/sphere-1.png)

4. Click **Create Signature**. This will generate a signature for you, save this as it will be used in the claim process.

   > **Note:** _if you have several addresses with balances to claim in your wallet, you need to repeat the procedure for every address._

### Ledger Signing Tool

If your funds are stored on a Ledger hardware wallet, use the [Ledger Signing Tool](https://github.com/HorizenOfficial/horizen-migration-ledger-signing-tool/releases/latest).

> **Note**: For security, we recommend downloading the tool and running it offline. Download and extract the static files [here](https://github.com/HorizenOfficial/horizen-migration-ledger-signing-tool/releases/latest), then open `index.html` locally. **Google Chrome is the recommended browser for this tool.**

**Prerequisites**

- Install both the Bitcoin and Horizen apps on your Ledger device.
- Ensure the Horizen app version is v2.4.1 or higher.

**Signing Instructions**

1. **Connect Your Ledger Device**
   <br/>Connect your Ledger device and open the **Horizen** app. Ensure the device is unlocked and displays "Application is ready" on the screen.

2. **Launch the Ledger Signing Tool**
   <br/>Open the Ledger Signing Tool and click **Connect**. Make sure your Ledger device is unlocked, and the Horizen app is open. The Ledger screen will show "Application is ready".

   ![Connect Ledger](/img/migration-tools/ledger-1.png)

3. **Enter the Destination Address**
   <br/>Enter the **destination address**. This is the EVM address that will receive the migrated ZEN tokens. The "Message to Sign" will auto-populate.

   ![Enter destination address](/img/migration-tools/ledger-2.png)

4. **Locate and Adjust the Derivation Path**
   <br/>Enter the derivation path for the **ZEN address being claimed from**.

   To find this:
   - Open the Ledger Live app
   - Go to the Horizen account to claim from
   - Click **Edit Account &rarr; Advanced**
   - Note the `freshAddressPath`

   ![Find accounts](/img/migration-tools/ledger-3.png)

   ![Edit account](/img/migration-tools/ledger-4.png)

   ![Find derivation path](/img/migration-tools/ledger-5.png)

---

      #### About Derivation Paths

      Ledger uses the following format for HD wallet derivation:
      ```
      m / purpose' / coin_type' / account' / change / address_index
      ```

      For **Horizen**, the derivation path is:
      ```
      m / 44' / 121' / account' / change / address_index
      ```

      - `change` is:
         - `0` → receiving address
         - `1` → change address
      - `address_index` is the index of the address under that account

---

#### Understanding `freshAddressPath`

Ledger shows the **next unused address** as the `freshAddressPath`.

To find the **last used** address:

- Subtract `1` from the `address_index`.

> **Example**  
>  If the `freshAddressPath` is `m/44'/121'/0'/0/5`  
>  Then the last used receiving address is `m/44'/121'/0'/0/4`

---

#### Important: Check All Possible Addresses

To ensure **no funds are left behind**:

1.  **Scan backwards** from the `freshAddressPath`, checking each:

    - `address_index` (e.g., 4, 3, 2, 1, 0)
    - for both `change = 0` and `change = 1`

2.  This means you should check all paths like:
    ```
    m/44'/121'/0'/0/4
    m/44'/121'/0'/1/4
    m/44'/121'/0'/0/3
    m/44'/121'/0'/1/3
    ...
    ```
   This ensures you catch both receiving and change addresses that may have ZEN balances.

3. **Verify the ZEN Address**

   Paste each derived ZEN address into the [Horizen Explorer](https://explorer.horizen.io/) to check the balances.

   ![Copy ZEN address](/img/migration-tools/ledger-6.png)

4. **Sign the Message**

   Click **Sign Message** and confirm the message on your Ledger device. Copy the generated signature and save it for the next step in the process.

### Private Key Signing Tool

If you have direct access to your private key, use the [Private Key Signing Tool](https://github.com/HorizenOfficial/horizen-migration-signing-tool-private-key/releases/latest).

If you only have your seed phrase, you'll need to derive your private key using a tool such as [Ian Coleman's BIP39 tool](https://github.com/iancoleman/bip39/releases/tag/0.5.6). For security, **always use this tool offline** by downloading the `bip39-standalone.html` file from the official GitHub release. After downloading, open the file in a web browser with your internet connections disabled. Be sure to select the **Coin** to "ZEN - Horizen" in the dropdown.

> **Note**: For security, we recommend downloading the tool and running it offline. Download and extract the static files [here](https://github.com/HorizenOfficial/horizen-migration-signing-tool-private-key/releases/latest), then open `index.html` locally.

<img src="/img/migration-tools/private-key-1.png" alt="Private Key Signing Tool" style={{ maxWidth: "500px", width: "100%" }} />

1. Enter your **private key** and confirm the ZEN address is correct.

2. Enter the **destination EVM address**. The "Message to Sign" will auto-populate.

3. Click **Sign Message** to generate and copy the signed message.

### CLI Tool

The CLI tool provides functionality for signing and verifying messages. It also supports claiming tokens from ZEN addresses, both standard transparent and multisignature addresses (see [below](#cli-tool-1)). The CLI can be used directly from the command line or imported as a module into a Node.js project.

#### Available Commands

- **`signmessage`**
  Sign a message with a ZEN private key.

- **`verifymessage`**
  Verify a signed message against a ZEN address.

For detailed usage examples and other supported commands, refer to the [GitHub README](https://github.com/HorizenOfficial/horizen-migration-cli/tree/1.0.0-ZENCLAIM).

## Claim Page

You can claim ZEN directly through the official web interface:

- Mainnet Claim Page: https://horizen.io/zenclaim

1. **Connect Wallet**

   Click Connect Wallet and choose your provider (e.g., MetaMask). Make sure you're connected to Base Mainnet.
   <img src="/img/migration-tools/metamask.png" alt="Connect MetaMask" style={{ maxWidth: "400px", width: "100%" }} />

2. **Import Token**
  Make sure to import eitherZEN (on mainnet) so that the tokens appear in Metamask. Under the tokens tab select the "Import Tokens" button and enter the following for the appropriate environment.

   ```
   Base Mainnet
   Contract: 0xf43eB8De897Fbc7F2502483B2Bef7Bb9EA179229
   Symbol: ZEN
   ```

   <img src="/img/migration-tools/import-token.png" alt="Import ZEN token" style={{ maxWidth: "400px", width: "100%" }} />

3. **Enter ZEN Address**

   Input your Horizen Transparent Address (e.g., from Sphere).
   The interface will display your available ZEN balance.
   Click **Next**.
   ![Enter ZEN address](/img/migration-tools/claim-1.png)

4. **Paste Signature and Destination Address**

   - The signed message should have already been created, if you haven’t done this yet please go to the following section to generate a signature: [Message Signing Instructions](#message-signing-instructions).
   - Paste the **signed message** into the signature field. 
   - **Enter the same destination address used in the message singing step.**

     ![Enter signature and destination address](/img/migration-tools/claim-2.png)

5. **Submit Claim**

   Click **Claim ZEN** to initiate the transfer of $ZEN from the Horizen chain to Base Mainnet.

## Security and Audits
**Important:** Make sure to only use the official claim page from Horizen's website: https://www.horizen.io/zenclaim. Be on the lookout for scams or nefarious actors sending you to other websites which may look like Horizen’s. Be sure to always check the URL when claiming.

The smart contracts have been audited by two independent furs and the website has also been fully audited. Audit reports are available below:

- **Smart Contract Code Audit:**
<br/>Link to summary, full download link in upper right corner: 
<br/>https://cantina.xyz/portfolio/1586d855-a063-4449-918b-39c2a038b9bb

- **Smart Contract Code Review:**
<br/>https://www.halborn.com/audits/the-horizen-foundation/horizen-migration---code-review-0aa462


- **Claim Tools Audit:**
<br/>Link to summary, full download link in upper right corner: <br/>https://cantina.xyz/portfolio/f3d1defb-1686-41ea-b602-0a03e6b824b2

## Troubleshooting & FAQ
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
