# Smart contracts

Here a more technical deep dive of the smart contracts used for the migration.<br/>
Their solidity code is publicly available [in this repository](https://github.com/HorizenOfficial/horizen-migration/tree/dev/erc20-migration/contracts).<br/>

## ZenToken (ERC-20 official ZEN contract)

- Official ERC-20 contract representing ZEN.
- Has a maximum capped supply of 21 Millions of ZEN (the same as the old Manchain)
- Accepts in the constructor:
    - The token name and symbol
    - The address of the EONBackupVault and ZendBackupVault contracts
- Minting authority is granted only to the vault smart contracts

|      |  |
| -------- | ------- |
| Address on BASE mainnet: | TODO   |
| Solidity source code: | TODO    |


## EONBackupVault

- Contract used to store the EON balances and automatically distrubute them.
- Accepts in the constructor the whitelisted admin address: is the only one able to call contract's write methods.
- Methods **setERC20** and **setCumulativeHashCheckpoint** have to be called before the loading: the first one sets the reference to the ERC-20, the second
  sets the expected cumulative hash after the loading will be completed,.
- The data loading is done in batch, by calling the method **batchInsert**. Logic to recalculate the cumulative hash is present in the method.
- After all the data has been loaded, multiple calls to the **distribute** method will mint the amounts to the payee


|      |  |
| -------- | ------- |
| Address on BASE mainnet: | TODO   |
| Solidity source code: | TODO    |

## ZendBackupVault

- Contract used to store the ZEND balances and allow their manual claiming.
- Accepts in the constructor the whitelisted admin address and the message string constants to be used (concatenated with the token symbol) for the claiming signature's message prefix. (For mainnet this  will correspond to "ZENCLAIM")
- Methods **setERC20** and **setCumulativeHashCheckpoint** must be called before the loading: the first one sets the reference to the ERC-20, and the second
  sets the expected cumulative hash after the loading is completed,.
- The data loading is done in batches, by calling the method **batchInsert**. During the loading, the contract will mint the corresponding ZEN values to itself.
- Manual claiming is possible through the methods **claimP2PKH** and **claimP2SH**.<br/>
  They will be enabled only once the expected cumulative hash will be reached.<br/>
  After each successful claim, the corresponding ZEN amount will be transferred
  to the payee (this means that the total balance of the contracts will correspond to the unclaimed total value at any given time)

|      |  |
| -------- | ------- |
| Address on BASE mainnet: | TODO   |
| Solidity source code: | TODO    |


## ZenMigrationFactory contract

- Responsible to deploy all the previous contracts and set the correct references between them.
- Method **deployMigrationContracts** will perform the task. Accepted parameters will be the token name and symbol, and the claim message string constant.

|      |  |
| -------- | ------- |
| Solidity source code: | TODO    |

<br/>
<br/>
**The diagram below represents the sequence of the main contract's calls:**

<img  src="/img/migration3.png"/>
