# Genesis creation

Horizen  initial state is not empty, but reflects the data present in both previous Horizen's chains: ZEND Mainchain and EON.

The pre-calculated initial state, mandatory to start a new collator node,  is available for download at this URL: [TODO]

In order to verify its correctness, anybody can anyway follow the istructions in this tutorial and regenerate the same data.

## Prerequisites

1. ZEND Mainchain node with dump support up and running
    - Donwload latest ZEND release from here: https://github.com/HorizenOfficial/zen/releases
    - Follow the instructions here https://github.com/HorizenLabs/migration-tools/tree/main/snapshot to patch the ZEND node in order to have dump support enabled
    - Compile the node, start and have it fully synched with the old mainchain 
    

2. EON Chain node with dump support up and running
    - Download latest EON release node
    - Add the following fragment in the config file to enable state dump support (important: the fragment must be added *BEFORE* starting to synch the chain):

    ```
    evmStateDump {
        enabled = true
    }
    ```

    - Start the node and have it fully synched with the old mainchain 



## Instructions 



[TODO]