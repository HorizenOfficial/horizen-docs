# Tools for Claiming Process
This guide explains how to sign a message and complete the ZEN token claim process using official Horizen tools.

## Overview of Tools
**Step 1: Sign a Message**

Use one of the following tools to generate a signed message:
- [Sphere Wallet](#sphere-wallet)
- [Ledger Signing Tool](#ledger-signing-tool)
- [Private Key Signing Tool](#private-key-signing-tool)

**Step 2: Submit the Claim**

Use either:
- [Claim Page](#claim-page)
- [CLI](#cli)

## Sign Message
Before claiming, you must generate a valid signature using the message format:
<!-- Update prefix -->
```
"ZENCLAIM" + destinationAddress
```
For example:

```
ZENCLAIM0x1B9aCc8d2c9e20aC2e78904e6f123f2D22Dd2A8w
```


> Note: For testing purposes on testnet, the message prefix will be `ZT1CLAIM`, so for example `ZT1CLAIM0x1B9aCc8d2c9e20aC2e78904e6f123f2D22Dd2A8w`


This section outlines how to do this using the three available tools.

### Sphere Wallet
If you have your seed phrase, you can use [Sphere](https://github.com/HorizenOfficial/Sphere_by_Horizen/releases/tag/desktop-v1.22.0) to sign a message.

1. Open Sphere and import your seed phrase (if not already imported).
2. Verify that your wallet addresses and balances are correct.
3. To generate a signature, click on this icon in your Sphere wallet and enter this message: `"ZENCLAIM" + destinationAddress`; Example: `ZENCLAIM0x1B9aCc8d2c9e20aC2e78904e6f123f2D22Dd2A8w`. <!-- Update prefix -->

    ![Sign a message with Sphere](/img/migration-tools/sphere-1.png) <!-- Update image -->

4. Click **Create Signature**. This will be used in the claim process.


### Ledger Signing Tool
If your funds are stored on a Ledger hardware wallet, use the [Ledger Signing Tool](https://github.com/HorizenOfficial/ledger-signing-tool).

> **Note**: For security, we recommend downloading the tool and running it offline. Download the static files [here](https://github.com/HorizenOfficial/ledger-signing-tool/releases/tag/v0.1.0), then open index.html locally. <!-- Update download link -->


**Prerequisites**
- Install both the Bitcoin and Horizen apps on your Ledger device.
- Ensure the Horizen app version is v2.4.1 or higher.

**Signing Instructions**
1. Connect your Ledger device and open the **Horizen** app.
2. Open the Ledger Signing Tool and click **Connect**. Make sure your Ledger device is unlocked, and the Horizen app is open. The Ledger screen will show "Application is ready".

    ![Connect Ledger](/img/migration-tools/ledger-1.png)

3. Enter the **destination address**. This is the EVM address that will received the migrated ZEN tokens. The "Message to Sign" will auto-populate.

   ![Enter destination address](/img/migration-tools/ledger-2.png)

4. Enter the derivation path for the ZEN address being claimed from. 

    To find this value, open the Ledger Live app and go to the account, click **Edit Account &rarr; Advanced**, and note the `freshAddressPath`.

    ![Find accounts](/img/migration-tools/ledger-3.png)

    ![Edit account](/img/migration-tools/ledger-4.png)

    ![Find derivation path](/img/migration-tools/ledger-5.png)


5. Verify the ZEN address by checking the balance on the [Horizen explorer](https://explorer.horizen.io/).

    ![Copy ZEN address](/img/migration-tools/ledger-6.png)

6. Click **Sign Message** and confirm the message on your Ledger device. Copy the generated signature.

### Private Key Signing Tool
If you have direct access to your private key, use the [Private Key Signing Tool](https://github.com/HorizenOfficial/signing-tool-private-key).

> **Note**: For security, we recommend downloading the tool and running it offline. Download the static files [here](https://github.com/HorizenOfficial/signing-tool-private-key/releases/tag/v0.0.1-ZT1CLAIM), then open index.html locally. <!-- Update download link -->

![Private Key Signing Tool](/img/migration-tools/private-key-1.png)

1. Enter your **private key** and confirm the ZEN address is correct.

2. Enter the **destination EVM address**. The "Message to Sign" will auto-populate.

3. Click **Sign Message** to generate and copy the signed message.

## Claim Process
Once you have a valid signature, use the claim interface to submit your request.

### Claim Page
You can claim ZEN directly through the official web interface:

👉 [Launch the Claim Page](https://pentesting.horizen.io/playground)<!-- Update to production link before publishing -->

1. **Connect Wallet**

    Click Connect Wallet and choose your provider (e.g., MetaMask). Make sure you’re connected to Base Mainnet.     
  
    ![Connect MetaMask](/img/migration-tools/metamask.png)

2. **Enter ZEN Address**

    Input your Horizen Transparent Address (e.g., from Sphere).
    The interface will display your available ZEN balance.
    Click **Next**.
    ![Enter ZEN address](/img/migration-tools/claim-1.png)

3. **Paste Signature and Destination Address**
    - Paste the **signed message** (see the options above) into the signature field
    - Enter the **destination address** address where you want to claim the $ZEN tokens. Note that this should NOT be an exchange deposit address. You can enter the same connected wallet address here.
    ![Enter signature and destination address](/img/migration-tools/claim-2.png)

4. **Submit Claim**
    
    Click **Claim** to initiate the transfer of $ZEN from the Horizen chain to the Base Mainnet. 


### CLI

[Coming Soon]
