# Migration overview

Horizen migrated all the $ZEN balances from both the old Horizen mainchain and the EON EVM chain to an ERC-20 smart contract on Base (Ethereum L2 Rollup). <br/>
Both old chains will be discontinued, and all coin transfers are now managed on Base, via ERC-20 smart contract calls. <br/>
**Migration was succesfully completed on 23th July 2025**

## What has been migrated?

- For **EON**: all EOA (Externally owned accounts) balances have been automatically migrated  to the same address (EON and Base share the same address format, and users can use the same wallet keys). <br/>
The amounts staked by forgers or delegators have also been migrated and moved to the same address in the new chain.<br/>
Smart contracts, ZEN balances locked in smart contracts and stakes delegated by smart contracts have **not** be migrated. 

- For **ZEND Mainchain**: the migration covered all $ZEN funds locked in UTXOs of type PayToPubKeyHash (single address) or  PayToScriptHash Multisig (multisig address). Note: we estimated that 99% of current UTXOs are part of these groups.<br/>
A simple manual claim of the funds will be required because the address format on the two chains is different (Bitcoin-format in the old Horizen chain, Ethereum format in the new Horizen chain). An automatic migration like the one from EON has not been performed here, because the on-chain UTXO structure does not track the original key/address owning it, making it impossible a mapping between old and new addresses.

## Overview of the process

<img  src="/img/migration1.png"/>

1. A migration point has been fixed on both old chains. <br/>
   When reached, Horizen Labs performed dumps of all the relevant data on both chains.
2. A set of smart contracts have been deployed on BASE to handle the restore:
    - the official [ERC-20 smart contract](https://basescan.org/token/0xf43eb8de897fbc7f2502483b2bef7bb9ea179229)
    - an EONBackupVault, used to store the EON balances and automatically mint them to BASE.
    - A ZENDBackupVault, used to store the ZEND balances and expose methods for manual claiming.

      HorizenLabs was responsible for deploying the contracts and loading the dump data. 

3. A migration check procedure will allow third parties to challenge the fairness of the loaded data.
4. ZEND owners will be able to claim funds via on-chain calls to the ZENDBackupVault contract.

The next sections of this website will detail all these steps.
