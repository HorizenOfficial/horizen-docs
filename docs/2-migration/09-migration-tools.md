# Tools for Claiming Process
This guide explains how to sign a message and complete the ZEN token claim process using official Horizen tools.

## Overview of Tools
**Step 1: Sign a Message**

Use one of the following tools to generate a signed message:
- [Sphere Wallet](#sphere-wallet)
- [Ledger Signing Tool](#ledger-signing-tool)
- [Private Key Signing Tool](#private-key-signing-tool)
- [CLI Tool](#cli-tool)

**Step 2: Submit the Claim**

Use either to submit the claim:
- [Claim Page](#claim-page)
- [CLI Tool](#cli-tool-1)

## Sign Message
Before claiming, you must generate a valid signature using the message format:
```
"ZT3CLAIM" + destinationAddress
```
For example:

```
ZT3CLAIM0x1B9aCc8d2c9e20aC2e78904e6f123f2D22Dd2A8w
```


This section outlines how to do this using the three available tools.

### Sphere Wallet
If you have your seed phrase, you can use [Sphere Testnet](https://github.com/HorizenOfficial/Sphere_by_Horizen_Testnet/releases/tag/desktop-v1.13.0-testnet) to sign a message.

1. Open Sphere and import your seed phrase (if not already imported).
2. Verify that your wallet addresses and balances are correct.
3. To generate a signature, click on this icon in your Sphere wallet and enter this message: `"ZT3CLAIM" + destinationAddress`; Example: `ZT3CLAIM0x1B9aCc8d2c9e20aC2e78904e6f123f2D22Dd2A8w`. <!-- Update prefix -->

    ![Sign a message with Sphere](/img/migration-tools/sphere-1.png) <!-- Update image -->

4. Click **Create Signature**. This will be used in the claim process.


### Ledger Signing Tool
If your funds are stored on a Ledger hardware wallet, use the [Ledger Signing Tool](https://github.com/HorizenOfficial/horizen-migration-ledger-signing-tool).

> **Note**: For security, we recommend downloading the tool and running it offline. Download and extract the static files [here](https://github.com/HorizenOfficial/horizen-migration-ledger-signing-tool/releases/tag/v1.0.0-ZT3CLAIM), then open `index.html` locally. <!-- Update download link -->


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
If you have direct access to your private key, use the [Private Key Signing Tool](https://github.com/HorizenOfficial/horizen-migration-signing-tool-private-key).

If you only have your seed phrase, you'll need to derive your private key using a tool such as [Ian Coleman's BIP39 tool](https://github.com/iancoleman/bip39/releases/tag/0.5.6). For security, **always use this tool offline** by downloading the `bip39-standalone.html` file from the official GitHub release. After downloading, open the file in a web browser with your internet connections disabled. Be sure to select the **Coin** to "ZEN - Horizen" in the dropdown.

> **Note**: For security, we recommend downloading the tool and running it offline. Download the static files [here](https://github.com/HorizenOfficial/horizen-migration-signing-tool-private-key/releases/tag/v1.0.0-ZT3CLAIM), then open `index.html` locally. <!-- Update download link -->

![Private Key Signing Tool](/img/migration-tools/private-key-1.png)

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

For detailed usage examples and other supported commands, refer to the [GitHub README](https://github.com/HorizenOfficial/horizen-migration-cli/tree/1.0.0-ZT3CLAIM).

## Claim Process
Once you have a valid signature, use the claim interface to submit your request.

### Claim Page
You can claim ZEN directly through the official web interface:

👉 [Launch the Claim Page](https://horizen.io/zt3claim)<!-- Update to production link before publishing -->

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


### CLI Tool

The CLI tool provides functionality for claiming tokens from ZEN addresses, both standard transparent and multisignature addresses. It also supports signing and verifying messages (see [above](#cli-tool)). The CLI can be used directly from the command line or imported as a module into a Node.js project.

#### Available Commands

- **`claimzenaddress`**  
  Claim tokens from a transparent ZEN address.

- **`claimzenmultisigaddress`**  
  Claim tokens from a multisignature ZEN address.


For detailed usage examples and other supported commands, refer to the [GitHub README](https://github.com/HorizenOfficial/horizen-migration-cli/tree/1.0.0-ZT3CLAIM).

