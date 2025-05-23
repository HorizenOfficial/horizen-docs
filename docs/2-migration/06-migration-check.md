# Migration check

> :warning: **This step is optional, can be executed by any third party interested in checking fairness of the migration** 

Assuming the data loading process has been successfully completed by Horizen, anyone can check that the migrated data correctly reflects the old chains state by following the steps described in this section.

## How it works:

We have already described in previous sections the concept of dumps, migration data, and cumulative hash.

The verification process will require to take a new dump, recalculating the hash locally with the same algorithm, and compare it with the one stored in the vault smart contracts. <br/>


### Instructions: 

1. Execute the dumps and create the restore artifacts with the procedure already [described here](./04-dump-execution.md) (you will need a fully-synched mainchain node and a fully-synched EON node)

2. Download the Github repository [horizen-migration-check](https://github.com/HorizenOfficial/horizen-migration-check) and follow the README instructions to recalculate the hash from the restore artifacts and compare it with the on-chain one.
