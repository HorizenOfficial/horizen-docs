# Migration starting points

The activation of the EON 1.5 hard-fork marked the start of the migration process.<br/>
As usual with EON, the hard-fork has been triggered at a specific consensus epoch, with millisecond precision.<br/>

Also ZEND activated an hardfork at a specific height.<br/>


## Final block hash determination

The rules below uniquely identify the final block hash of both  chains: this marks the block at which the balances have been migrated, and <b>any transaction recorded after this will have no value</b>.

- For ZEND Mainchain, the blockhash at the hardfork height has been marked as the final block hash.

- For EON, the block including the reference to the above mainchain block  has been considered the final block. <br/>

Before starting the migration process, both of them have been confirmed by *more than 100 following blocks* on mainchain, making *infeasebale* a block revert before the migration point.

Here are the final confirmed hashes:

|     |  |
| -------- | ------- |
| **ZEND Mainchain final block hash:**  | 000000000059963d5021a9c29167878916e476a249ca988dd828bac4a8a3351a  |
| **ZEND Mainchain final block height:**  | 1807300   |
| **EON final block hash:** | d3e837c2939917f8a676f9a4b626c1024718636740732db05fc6de811a8e32aa |
| **EON final block height:** | 3573401 |


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


