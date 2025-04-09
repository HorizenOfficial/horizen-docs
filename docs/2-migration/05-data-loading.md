# Data loading

> :warning: **This step will be executed by Horizen admins and does not require actions for ZEN holders** 

Scope of this step is to load the balances obtained in the previous dump step into the vault smart contracts used for the migration.<br/>
This operation is performed by firing a batch of transactions, only by an authorized Horizen admin (it's address is white-listed in the vault contracts)<br/>

Detailed instructions are in the [README.md](https://github.com/HorizenOfficial/horizen-migration/blob/st/HZN-2253/erc20-migration/README.md) file of the **horizen-migration** GIT repo, together with scripts to be executed (they use the Hardhat framework).

## Migration data cumulative hash

The concept of "cumulative hash" is used as a "fingerprint" of the dump data.<br/>
We define it with the following pseudo-code:

    ```
    cumulative_hash = "0x00000000"
    for each dump tuple:
        overall_hash = keccak-256-hash(overall_hash, address, value)
    ```

In the data loading process, it is:
- first calculated off-chain
- fed into the smart contract
- Inside the solidity code:
    - recalculated during the batch data loading 
    - compared with the initial one, to check the correctness of the loading and to receive a confirmation that the loading is completed

Furthermore, in the migration check step, the same hash can be recomputed offchain and compared later with the one fed into the smart contract.


