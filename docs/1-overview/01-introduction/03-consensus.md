# Consensus

## Aura consensus

Collator's block proposals are managed in Horizen by the AURA (Authority-round) consensus.<br/>
AURA works by having a list of authorities A who are expected to roughly agree on the current time.<br/>
Time is divided up into discrete slots of t seconds each. For each slot s, the author of that slot is A[s % |A|]<br/>
The author is allowed to issue one block but not more during that slot, and it will be built upon the longest valid chain that has been seen.<br/>
Blocks from future steps will be either deferred or rejected depending on how far in the future they are.

## Authorities selection

The selection of the authorities used by AURA is governed in Horizen by a Proof of Stake mechanism.

We define a <b>session (or round)</b> as composed by a number N of slots.<br/>
We also define a <b>candidate</b> a collator that has joined a list of candidates by putting an initial stake.

When a new session starts, the top X candidates by stake are selected, considering also the delegated stake.<br/>
This set of collators will compose the list of authorities from which AURA will select the block proposer during the next session (there is one session delay between the time the set is chosen and the time it starts to be used).<br/>
Please note that once a collator will reach the target to be included in this list, it will be selected to propose a block  following a round-robin schema, and  not proportionally on the stake owned.

## Collators rewards

The session switch will also mark the time when collators' rewards are calculated.<br/>
Rewards will be composed by the transaction fees collected in the block and the coinbase (new ZEN mintend) of each block authored (see [tokenomics](./04-tokenomics.md) section for more info on the coinbase rules). <br/>
There is a fixed collator commision of 15%. The remaining 85% of the rewards will be delivered to delegators, proportionally to the amount of delegated stake.<br/>
Payments are made once-per-block until all payments have been made. In each such block, one collator is chosen for a rewards payment and is paid along
with each of its delegators.

Additional rules and contraints on how to join/leave the set of candidates and stake/unstake funds are detailed in the [Stake and delegation](../../3-tutorials/02-stake-and-delegation.md) tutorial.




