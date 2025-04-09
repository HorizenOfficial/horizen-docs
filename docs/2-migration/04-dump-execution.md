# Dump execution

> :warning: **This step will be executed by Horizen admins and does not require actions for ZEN holders, unless they want to perform a [migration check](./06-migration-check.md)** 

In the previous step network has reached  the  migration heights, and the final block hashes/heights of both chains are now revealed.<br/>
This section will describe how to generate the data with all the balances to be migrated.<br/>

We will need to interact with a node of each chain:

- Fully synched ZEND Mainchain node 

- Fully synched EON Chain node with dump support enabled:

    - To enable dump support,  the following fragment must be present in the config file  (*important*: to generate a valid state dump the fragment must be added *BEFORE* starting to synch the chain):

    ```
    evmStateDump {
        enabled = true
    }
    ```
    
# How to create the dump data

1. Execute a dump of ZEND balances at that specified height.
   ZEND is shipped with a dumper command line utility to do this:

    ```
    killall zend
    dumper -H MC_MIGRATION_HEIGHT > utxos.csv
    ```

    Please note the following:
    - killall is needed because ZEND must be stopped while performing the dump
    - If executing a dump of the testnet you must add the flag: -t
    - MC_MIGRATION_HEIGHT must be <b>not too old in the past</b> compared to the latest tip: maximum supported height is <b>tip-100</b>

2. Execute a dump of EON State:
  
   Execute the following call on the EON node:<br/>

   ```
    curl --request POST 'http://127.0.0.1:9085/ethv1' -H 'Content-Type: application/json' -H 'accept: application/json' -d '{ "jsonrpc":"2.0", "method":"zen_dump", "params":["0xbda76ab769c4e158f8e8add81bdf17c9d919fb54cd5e32f1c83cebdfc3dc363c","/zendata/eon.dump"], "id":1 }'  
    ```
    - First parameter of the method must be replaced by EON_MIGRATION_HASH
    - Second parameter is the local-path of the output dump.

3. Execute the dump of the EON stakes:

    Can be executed by calling the script [get_all_forger_stakes.py](https://github.com/HorizenOfficial/horizen-migration/blob/dev/dump-scripts/python/get_all_forger_stakes.py):

    (Replace parameter EON_MIGRATION_HEIGHT with the height of the block EON_MIGRATION_HASH)

    ```
    python3 get_all_forger_stakes.py <block height> <rpc url> <output_file>
     ```
    - First parameter of the method must be replaced by EON_MIGRATION_HEIGHT
    - Second parameter is the rpc url of the EON node (http://127.0.0.1:9085/ethv1)
    - Third parameter is the local-path of the output dump.
    

4. Convert ZEND csv dump in json format, with the script [zend_to_horizen.py](https://github.com/HorizenOfficial/horizen-migration/blob/dev/dump-scripts/python/zend_to_horizen.py):

    ```
    python3 zend_to_horizen.py <zend dump file name> <output_file>
     ```

    - First parameter of the method is the path of the file generated at step 1
    - Second parameter is the local-path of the output json file.

5. Convert EON  dump in json format, with the script [setup_eon2_json.py](https://github.com/HorizenOfficial/horizen-migration/blob/dev/dump-scripts/python/setup_eon2_json.py):

    ```
    python3 setup_eon2_json.pyy <Eon dump file name> <Eon stakes file name> <output_file>
     ```

    - First parameter of the method is the path of the file generated at step 2
    - Second parameter of the method is the path of the file generated at step 3
    - Third parameter is the local-path of the output json file.

The output files of steps 4 and 5 will be the ones used for the data loading and migration check steps.

