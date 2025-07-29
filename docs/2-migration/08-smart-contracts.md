# Smart contracts

Here a more technical deep dive of the smart contracts used for the migration.<br/>
Their solidity code is publicly available [in this repository](https://github.com/HorizenOfficial/horizen-migration/blob/main/erc20-migration/contracts).<br/>

## ZenToken (ERC-20 official ZEN contract)

- Official ERC-20 contract representing ZEN.
- Has a maximum capped supply of 21 Millions of ZEN (the same as the old Manchain)
- Accepts in the constructor:
    - The token name and symbol
    - The address of the EONBackupVault and ZendBackupVault contracts
    - The address who will receive the remaining portion of Zen after the migration (Horizen foundation and HorizenDAO)
- Minting authority is granted only to the vault smart contracts
- Exposes a "callback" method **notifyMintingDone**: is called by the vault smart contracts when the minting has been completed. When both of them have completed
  the process, the contract will mint the remaining supply with the rules determined by the [ZenIP 42409](https://snapshot.box/#/s:horizenfoundationtechnical.eth/proposal/0x3a0ce870c5a894f4468f72d9fde843e9f25e8268890a44ebcc1cb0d5dbbe89cf) .

|      |  |
| -------- | ------- |
| Address on BASE mainnet: | [0xf43eB8De897Fbc7F2502483B2Bef7Bb9EA179229](https://basescan.org/address/0xf43eB8De897Fbc7F2502483B2Bef7Bb9EA179229)   |
| Solidity source code: | [ZenToken.sol](https://github.com/HorizenOfficial/horizen-migration/blob/main/erc20-migration/contracts/ZenToken.sol)    |


## EONBackupVault

- Contract used to store the EON balances and automatically distribute them.
- Accepts in the constructor the whitelisted admin address: is the only one able to call contract's write methods.
- Methods **setERC20** and **setCumulativeHashCheckpoint** have to be called before the loading: the first one sets the reference to the ERC-20, the second
  sets the expected cumulative hash after the loading will be completed.
- The data loading is done in batches, by calling the method **batchInsert**. Logic to recalculate the cumulative hash is present in the method.
- After all the data has been loaded, multiple calls to the **distribute** method will mint the amounts to the payee


|      |  |
| -------- | ------- |
| Address on BASE mainnet: | [0x1Cc689233837A0b96e1f176d49FC08462f70C47F](https://basescan.org/address/0x1Cc689233837A0b96e1f176d49FC08462f70C47F)    |
| Solidity source code: | [EONBackupVault.sol](https://github.com/HorizenOfficial/horizen-migration/blob/main/erc20-migration/contracts/EONBackupVault.sol) |

## ZendBackupVault

- Contract used to store the ZEND balances and allow their manual claiming.
- Accepts in the constructor the whitelisted admin address and the message string constants to be used (concatenated with the token symbol) for the claiming signature's message prefix. (For mainnet this  will correspond to "ZENCLAIM")
- Methods **setERC20** and **setCumulativeHashCheckpoint** must be called before the loading: the first one sets the reference to the ERC-20, and the second
  sets the expected cumulative hash after the loading is completed.
- The data loading is done in batches, by calling the method **batchInsert**. During the loading, the contract will mint the corresponding ZEN values to itself.
- Manual claiming is possible through the methods **claimP2PKH** and **claimP2SH**.<br/>
  They will be enabled only once the expected cumulative hash will be reached.<br/>
  After each successful claim, the corresponding ZEN amount will be transferred
  to the payee (this means that the total balance of the contract will correspond to the unclaimed total value at any given time)

|      |  |
| -------- | ------- |
| Address on BASE mainnet: | [0x1Ee188bDf19eBF04B73Ab6FFcec2a864cd4774F2](https://basescan.org/address/0x1Ee188bDf19eBF04B73Ab6FFcec2a864cd4774F2)     |
| Solidity source code: | [ZendBackupVault.sol](https://github.com/HorizenOfficial/horizen-migration/blob/main/erc20-migration/contracts/ZendBackupVault.sol)    |

## LinearTokenVesting contract

- A contract that locks an amount of ERC-20 tokens and release them to a predefined beneficiary. The vesting is linear, and the number of intervals and time between each interval will be configurable. <br/>
  An admin address set in the constructor has the rights to modify the beneficiary or the vesting parameters (will be subject to offchain DAO voting).

|      |  |
| -------- | ------- |
| Solidity source code: | [LinearTokenVesting.sol](https://github.com/HorizenOfficial/horizen-migration/blob/main/erc20-migration/contracts/LinearTokenVesting.sol)    |

## ZenMigrationFactory contract

- Responsible to deploy all the previous contracts and set the correct references between them.
- Method **deployMigrationContracts** will perform the task. Accepted parameters will be the token name and symbol, the claim message string constant and the beneficiaries of the remaining supply after the migration (Horizen foundation and HorizenDAO)

|      |  |
| -------- | ------- |
| Solidity source code: | [ZenMigrationFactory.sol](https://github.com/HorizenOfficial/horizen-migration/blob/main/erc20-migration/contracts/ZenMigrationFactory.sol)    |

<br/>
<br/>
**The diagram below represents the sequence of the main contract's calls:**

<img  src="/img/migration3.png"/>
