# Ledger Wallet Users
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

5. Proceed to the [Claim Page](/mainnet-migration-instructions/claim-page).
