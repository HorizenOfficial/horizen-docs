# Migration check

> :warning: **This step is optional, can be exectued by any third-party interested in checking the migration fairness** 

Assuming the data loading process has been succesfully completed by Horizen, anyone can check that the migrated data is correctly reflecting the old chains state by following the stesps described in this section.

## How it works:

We have already described in previous sections the concept of dumps, migration data and cumulative hash.

The verification process will require to take a new dump, reculcate the hash locally with the same algorithm and compare it with the one stored in the vault smart contracts. <bt/>


## Instructions:

### Prerequisites:

The following software is needed:

1. Fully synched ZEND Mainchain node (version 6) :

    - Download latest ZEND release from here: https://github.com/HorizenOfficial/zen/releases
    - Compile the node, start and have it fully synched with the old mainchain 
    

2.  Fully synched EON Chain node (version 1.5) with dump support enabled:

    - Download latest EON release node
    - Add the following fragment in the config file to enable state dump support (important: the fragment must be added *BEFORE* starting to synch the chain):

    ```
    evmStateDump {
        enabled = true
    }
    ```

    - Start the node and have it fully synched with the old mainchain 

### Instructions: 

1. Execute the dumps with the procedure already [described here](./04-dump-execution.md)** 

2. Download the git repo [https://github.com/HorizenOfficial/horizen-migration-check] and follow the README instructions to recalculate the hash from the dumps and compare it with the on-chain one.
