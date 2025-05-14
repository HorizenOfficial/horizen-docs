# Migration starting points

> :warning: **For this step no action is required for ZEN holders** 

The activation of the EON 1.5 hard-fork will mark the start of the migration process.<br/>
As usual with EON, the hard-fork will be triggered at a specific consensus epoch, with millisecond precision.<br/>

We will also need the activation of the ZEND hardfork: it will be triggered at a specific height.<br/>
Although we can’t plan the exact time a predefined height will be reached, the estimated precision  is +-2 hours.<br/>

The two hard forks  will be coordinated to happen on the same day.

## Final block hash determination

The rules below are used to uniquely identify the final block hash of both  chains: this will mark the block at which the balances will be migrated, and <b>any transaction recorded after this will have no value</b>.

- For ZEND Mainchain, the blockhash at the hardfork height will be the final block hash.

- For EON, the block including the reference to the above mainchain block  will be considered the final block. <br/>
All mainchain blocks are referenced in EON only after 6 confirmations, so around 20 minutes  will be needed after the ZEND hardfork to see its block included in EON.

Additionally, <b>both of the previous will be considered final only after the final mainchain block has 100 confirmations, and all 100 confirmations have been included in the EON chain</b>.<br/>
We can then estimate that the final blockhash on both chains will be known around 20 minutes after the mainchain hardfork, but  fully confirmed **within 5 hours** after the mainchain hardfork.

## Useful commands to get the block hashes

    **For ZEND:**

    To obtain the hash of the block at a specific height:

    ```
    zen-cli getblockhash <height>
    ```

    In case of testnet, the command is:
    ```
    zen-cli -testnet getblockhash <height>
    ```

    **For EON:**

    To obtain the block that references a specific ZEND block by height:

    ```
    curl -sX POST 'http://127.0.0.1:9085/mainchain/blockReferenceInfoBy' -H 'Content-Type: application/json' -H 'accept: application/json' -d '{"height":1654690, "format": true}'

    ```

    The result will be in this format:
    - The field *mainchainHeaderSidechainBlockId* is the EON block hash referencing the mainchain block.
    - The field *hash* is the ZEND hash (double check it is equals to the ZEND getblockhash result)<br/><br/>


    ```
    {
    "result" : {
        "blockReferenceInfo" : {
        "mainchainHeaderSidechainBlockId" : "ae4cea03e6920679775e57236f27dc541ad900d9741bb2b71a46074748ff3062",
        "mainchainReferenceDataSidechainBlockId" : "ae4cea03e6920679775e57236f27dc541ad900d9741bb2b71a46074748ff3062",
        "hash" : "000218ca034fc86b54b2417a376656c90a5ee7e5412d015a588758f8dd521d3c",
        "parentHash" : "0003199e4fe1db486924ceaa8325a2a3884a894276632aa7a36dbf5b8e46332e",
        "height" : 1654690
        }
    }
    ```


