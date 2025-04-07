# Migration start

The activation of the EON 1.5 hard-fork will mark the starting of the migration process.<br/>
As usual with EON, the hard-fork will be triggered at a specific consensus epoch, with milliseconds precision.<br/>

We will need also the activation of ZEND hardfork: it will be trigger at a specific height.<br/>
Although we can’t plan the exact time a predefined height will be reached, the estimated precision  is +-2 hours.<br/>

The two harforks  will be coordinated to happen at the same time.

# Final block hash determination

Pourpouse of this step is to determine the final block-hashes of both the chains: this will be considered the block at which the balances will be migrated, and <b>any transaction recorded after this will have no value</b>.

For ZEND Mainchain, the blockhash at the hardfork height will be the final block hash.

For EON, the block including the reference to the aboves mainchain block  will be the final block.
There is a predefined delay of 6 blocks for the inclusion of manchain references in EON, so around 20 minutes  will be needed after the ZEND hardfork to see its block included in EON.

<b>Both of the previous will be considered final only after the final mainchain block will have 100 confirmations, and all 100 confirmations will be included in the EON chain</b>.
Given the previous, we can estimate that the final blockhash on both chains will be known around 20 minutes after the mainchain Hardfork, but definitively confirmed within 5 hours after the mainchain Hardfork.

# Useful commands to get the block hashes

For ZEND:

For EON:

