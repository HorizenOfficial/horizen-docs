# Migration overview

Horizen will migrate all the $ZEN balances from the old Horizen mainchain and from the EON chain to an ERC-20 smart contract on Base (Ethereum L2 Rollup). <br/>
After the migration, both the old Horizen chains will be discontinued, and all the on-chain coin transfers will have to be managed on Base, via ERC-20 smart contract calls.

EON balances (only EOA) will be migrated automatically to the same address (EON and the new Horizen chain will have the same address format).

For ZEND balances, a simple manual claim of the funds will be required because the address format on the two chains is different (Bitcoin-format in the old Horizen chain, Ethereum format in the new Horizen chain). The on-chain UTXO structure does not track the original key/address owning it, making impossible an automatic mapping between old and new addresses.

The following pages in this section will detail all the procedure, including the operations that can be executed by external parties to check its fairness.
