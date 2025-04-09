# Smart contracts architecture

Here a more technical deep dive of the smart contracts used for the migration.<br/>
Their solidity code is publicly available [in this repo](https://github.com/HorizenOfficial/horizen-migration/tree/dev/erc20-migration/contracts).<br/>

## ERC-20 official ZEN contract

- Official ERC-20 contract representing ZEN.
- Has a maximum capped supply of 21 Millions of ZEN (the same as the old Manchain)
- Accepts in the constructor:
    - The token name and symbol
    - The address of the EONBackupVault and ZENDBackupVault contracts

|      |  |
| -------- | ------- |
| Address on BASE mainnet: | TODO   |
| Solidity source code: | TODO    |


## EONBackupVault

- Contract used to store the EON balances and automatically distrubute them.
- Accepts in the constructor the white-listed admin address.
- Methods **setERC20** and **setCumulativeHashCheckpoint** have to be called before the loading: the first one sets the reference to the ERC-20, the second
  set the expected cumulative hash after the loading is completed,.
- The data loading is done in batch, by calling the method **batchInsert**
- After all the data has been loaded, multiple calls to the **distribute** method will mint the amounts to the payee


|      |  |
| -------- | ------- |
| Address on BASE mainnet: | TODO   |
| Solidity source code: | TODO    |

## ZendBackupVault

- Contract used to store the ZEND balances and allow their manual claiming.
- Accepts in the constructor the white-listed admin address.
- Methods **setERC20** and **setCumulativeHashCheckpoint** have to be called before the loading: the first one sets the reference to the ERC-20, the second
  set the expected cumulative hash after the loading is completed,.
- The data loading is done in batch, by calling the method **batchInsert**
- Manual claiming is possible through the methods **claimP2PKH** and **claimP2SH**
|      |  |
| -------- | ------- |
| Address on BASE mainnet: | TODO   |
| Solidity source code: | TODO    |

## Factory contract

- Responsible to deploy all the previous contracts

|      |  |
| -------- | ------- |
| Solidity source code: | TODO    |


