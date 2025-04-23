# Migration overview

Horizen will migrate all the $ZEN balances from both the old Horizen mainchain and the EON EVM chain to an ERC-20 smart contract on Base (Ethereum L2 Rollup). <br/>
After the migration, both old chains will be discontinued, and all coin transfers will be managed on Base, via ERC-20 smart contract calls.

## What will be migrated?

- For **EON**: all EOA (Externally owned accounts) balances will be automatically migrated  to the same address (EON and Base share the same address format, and users will be able to use the same wallet keys). <br/>
The amounts staked by forgers or delegators will also be migrated: you don't need to unstake them before the migration, they will be automatically unstaked and moved to the same address in the new chain.<br/>
Smart contracts, ZEN balances locked in smart contracts and stakes delegated by smart contracts will **not** be migrated: if you have any ZEN locked in a smart contract, be sure to move it before the migration day. 

- For **ZEND Mainchain**: the migration will cover all $ZEN funds locked in UTXOs of type PayToPubKeyHash (single address) or  PayToScriptHash Multisig (multisig address). Note: we have estimated that 99% of current UTXOs are part of these groups.<br/>
A simple manual claim of the funds will be required because the address format on the two chains is different (Bitcoin-format in the old Horizen chain, Ethereum format in the new Horizen chain). An automatic migration like the one from EON can't be performed here, because the on-chain UTXO structure does not track the original key/address owning it, making it impossible a mapping between old and new addresses.

## Overview of the process

<img  src="/img/migration1.png"/>

1. A migration point will be fixed on both old chains. <br/>
   When reached, Horizen Labs will perform dumps of all the relevant data on both chains.
2. A set of smart contracts will be deployed on BASE to handle the restore:
    - the official ERC-20 smart contract
    - an EONBackupVault, that will store the EON balances and automatically mint them to BASE.
    - A ZENDBackupVault, that will store the ZEND balances and expose methods for manual claiming.

      HorizenLabs will be responsible for deploying the contracts and loading the dump data. 

3. A migration check procedure will allow third parties to challenge the fairness of the loaded data.
4. ZEND owners will be able to claim funds via on-chain calls to the ZENDBackupVault contract.

The next sections of this website will detail all these steps.
