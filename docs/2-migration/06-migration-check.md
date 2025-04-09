# Migration check

> :warning: **This step is optional, can be exectued by any third-party interested in checking the migration fairness** 

Assuming the data loading process has been succesfully completed by Horizen, anyone can check that the migrated data is correctly reflecting the old chains state by following the stesps described in this section.

## How it works:

In the previous sections a dump of all the balances to be migrated has been obtained from fully-synched chain nodes.<br/>
Then the balances have been loaded into two smart contracts. During the load, a cumulative hash has been calculated with the data, using the following forumla:<br/>

    ```
    overall_hash = "0x00000000"
    for each tuple:
        overall_hash = hash(overall_hash, key, value)
    ```

In this section, a new dump will be obtainen, then a scrpt will be executed to reculcate the hash locally with the same algorithm used in the solidity code.
Finally, the calculated hash will be compared with the one stored in the smart contract. <bt/>


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

The ZEND Mainchain height that marks the migration will be an input parameter of the process: we will call it MC_MIGRATION_HEIGHT.

1. Execute the dumps with procedure [described here](./04-dump-execution.md)** 

2. Download the git repo [https://github.com/HorizenOfficial/horizen-migration-check] and follow the README instructions to check the on-chain hash corresponds to the one calculated locally.
