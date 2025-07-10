# Private Key Signing Tool

If you have direct access to your private key, use the [Private Key Signing Tool](https://github.com/HorizenOfficial/horizen-migration-signing-tool-private-key/releases/latest).

If you only have your seed phrase, you'll need to derive your private key using a tool such as [Ian Coleman's BIP39 tool](https://github.com/iancoleman/bip39/releases/tag/0.5.6). For security, **always use this tool offline** by downloading the `bip39-standalone.html` file from the official GitHub release. After downloading, open the file in a web browser with your internet connections disabled. Be sure to select the **Coin** to "ZEN - Horizen" in the dropdown.

> **Note**: For security, we recommend downloading the tool and running it offline. Download and extract the static files [here](https://github.com/HorizenOfficial/horizen-migration-signing-tool-private-key/releases/latest), then open `index.html` locally.

<img src="/img/migration-tools/private-key-1.png" alt="Private Key Signing Tool" style={{ maxWidth: "500px", width: "100%" }} />

1. Enter your **private key** and confirm the ZEN address is correct.

2. Enter the **destination EVM address**. The "Message to Sign" will auto-populate.

3. Click **Sign Message** to generate and copy the signed message.

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
