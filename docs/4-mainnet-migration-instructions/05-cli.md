# CLI Tool

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
