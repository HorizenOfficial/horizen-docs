# Data loading

In this step all the balances obtained in the previous dump step have been loaded into the vault smart contracts.<br/>
This operation has been performed by firing a batch of transactions, by an authorized Horizen admin (its address was whitelisted in the vault contracts).<br/>

Detailed instructions are in the [README.md](https://github.com/HorizenOfficial/horizen-migration/blob/main/erc20-migration/README.md) file of the **horizen-migration** Git repository, together with the scripts to be executed (they use the Hardhat framework).

## Migration data cumulative hash

The concept of "cumulative hash" is used as a "fingerprint" of the dump data.<br/>
Assuming we have a list of dump tuples composed by [address,balance], ordered by address, we define it with the following pseudo-code rule:

    ```
    cumulative_hash = "0x0000000000000000000000000000000000000000000000000000000000000000"
    for each dump tuple:
        overall_hash = keccak-256-hash(overall_hash, tuple.address, tuple.value)
    ```

In the data loading process, it has been:
- first calculated off-chain
- fed into the smart contract
- Inside the solidity code:
    - recalculated during the batch data loading 
    - compared with the initial one, to check the correctness of the loading and to receive confirmation that the loading has been completed (claiming methods will be enabled only at this point)

Furthermore, in the [migration check step](../2-migration/06-migration-check.md), the same hash can be recomputed off-chain by any third-party, and compared with the one stored in the smart contract.


