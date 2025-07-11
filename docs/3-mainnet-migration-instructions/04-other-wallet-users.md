# Other Wallet Users

If you have direct access to your private key, use the [Private Key Signing Tool](https://github.com/HorizenOfficial/horizen-migration-signing-tool-private-key/releases/latest).

If you only have your seed phrase, you'll need to derive your private key using a tool such as [Ian Coleman's BIP39 tool](https://github.com/iancoleman/bip39/releases/tag/0.5.6). For security, **always use this tool offline** by downloading the `bip39-standalone.html` file from the official GitHub release. After downloading, open the file in a web browser with your internet connections disabled. Be sure to select the **Coin** to "ZEN - Horizen" in the dropdown.

> **Note**: For security, we recommend downloading the tool and running it offline. Download and extract the static files [here](https://github.com/HorizenOfficial/horizen-migration-signing-tool-private-key/releases/latest), then open `index.html` locally.

<img src="/img/migration-tools/private-key-1.png" alt="Private Key Signing Tool" style={{ maxWidth: "500px", width: "100%" }} />

1. Enter your **private key** and confirm the ZEN address is correct.

2. Enter the **destination EVM address**. The "Message to Sign" will auto-populate.

3. Click **Sign Message** to generate and copy the signed message.

4. Proceed to the [Claim Page](/mainnet-migration-instructions/claim-page).
