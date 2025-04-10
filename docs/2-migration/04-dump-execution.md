# Dump execution

> :warning: **This step will be executed by Horizen admins and does not require action from ZEN holders, unless they want to perform a [migration check](./06-migration-check.md)** 

In the previous step, the network has reached  the  migration heights, and the final block hashes/heights of both chains are now revealed.<br/>
This section will describe how to generate the data with all the balances to be migrated.<br/>

We will need to interact with a node of each chain:

- Fully synced ZEND Mainchain node 

- Fully synced EON Chain node with dump support enabled:

    - To enable dump support,  the following fragment must be present in the config file  (*important*: to generate a valid state dump, the fragment must be added *BEFORE* starting to sync the chain):

    ```
    evmStateDump {
        enabled = true
    }
    ```
    
# How to obtain the dump data

<img  src="/img/migration2.png"/>

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
    This step does the following:
    - transform the addresses in Base58 decoded format (is easier to handle in the solidity code), without chain prefix
    - trasform the balances in "wei" format (1 ZEN = 1 with 18 zeros)
    - order the addresses alphabetically

    Parameters:
    - First parameter of the method is the path of the file generated at step 1
    - Second parameter is the local-path of the output json file.

    The output format will be a key-value json data structure like this:

    ```
    {
        "0xabf1FF91cECD9990B3f29363B62B87FD76f55F4A": 10001500000000000000000,
        "0x448ae34180D03AD7da48975d6Fd7B297bb871E26": 2082100000000000000,
        "0x144e0FE5e69893577107a15a7c76bABd59f0A279": 100000000000000000
    }
     ```

     The *keys* represent the ZEND address in an Base58check decoded format, without the first 2bytes chain prefix (so 20 bytes in total), prepended with 0x.<br/>
     The *values* represent the ZEND balance, in "wei format" (1 ZEN = 1 with 18 zeros).



   

5. Convert EON  dump in json format, with the script [setup_eon2_json.py](https://github.com/HorizenOfficial/horizen-migration/blob/dev/dump-scripts/python/setup_eon2_json.py):

    ```
    python3 setup_eon2_json.pyy <Eon dump file name> <Eon stakes file name> <output_file>
     ```

    This step does the following:
    - filters out the smart contracts addresses and the stakes belonging to smart contracts
    - filters out addresses with 0 balance and no stakes
    - filters out the 0x0000000000000000000000000000000000000000 account
    - trasform the balances in "wei" format (1 ZEN = 1 with 18 zeros)
    - order the addresses alphabetically

    Parameters:
    - First parameter of the method is the path of the file generated at step 2
    - Second parameter of the method is the path of the file generated at step 3
    - Third parameter is the local-path of the output json file.

    The output format will be a key-value json data structure like this:

    ```
    {
        "0xBa2290AEaAE3e1ea336431911C97a67Ebff46528": 1500000000000000000,
        "0xFEB3DE3D4A6F49bbF643c44E64dfd3e46D3E0F04": 821003000000000000,
        "0x2a085Ca4E931938Aa383C88026b0566cFce1A34b": 45500000000000000
    }
     ```

     The *keys* represent the EON address in the hex form (EIP-55 format), with “0x” prefix.<br/>
     The *values* represent the EON balance, in "wei format" (1 ZEN = 1 with 18 zeros).


The output files of steps 4 and 5 will be the ones used for the data loading and migration check steps.

