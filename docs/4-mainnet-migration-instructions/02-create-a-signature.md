# Step 1: Create a Signature
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

- **[Sphere Wallet Users](/mainnet-migration-instructions/sphere-wallet-users)**
- **[Ledger Wallet Users](/mainnet-migration-instructions/ledger-wallet-users)**
- **[Other Wallet Users](/mainnet-migration-instructions/other-wallet-users)** <br/>For users who manage ZEN with other wallets not listed above. Note that users need access to their private keys in order to use this tool.
- **[Super Users - CLI Tool](/mainnet-migration-instructions/cli)** <br/>For users or organizations who manage multiple wallet addresses, have access to private keys, and need to generate multiple signatures. This tool can also be used to claim from multiple wallets.
