# Stake and Delegation
This tutorial will show how token owners can use their tokens to delegate stakes to collators (staking).
For additional information about collators and delegators see [Consensus section](../1-overview/01-introduction/03-consensus.md).

## Overview
As already discussed in [Consensus section](../1-overview/01-introduction/03-consensus.md), collators are responsible for collecting parachain transactions and for creating parachain blocks.
Only the candidates with the higher stakes are selected from a collator candidate pool to actually create parachain blocks and so to be able to receive block rewards.
This candidate selection is renewed every round, where a round consists of a set number of blocks.

Token holders can add to candidates' stake using their tokens, a process called delegation (or staking), so increasing the chances of a candidate to be selected as a collator. 
When a token holder joins for the first time the delegator set of a collator, it is required to stake at least an amount equal to the  minimum delegation stake. It can later increase or decrease its stakes but it cannot reduce the stakes below the minimum delegation stake. 

When delegating, tokens are deducted instantly from the user account and added to the total amount staked by the user. The delegation won't have an effect on collator selection, however, until the beginning of the next round.
Exiting a position (unstaking), instead, is divided into a two-step operation: scheduling and execution. First, token holders must schedule a request to exit their position and wait for a given delay or unbonding period. After the unbonding period has expired, users can execute their scheduled action. Tokens are then re-added to the user account.

Once a candidate joins the active set of collators, they are eligible to produce blocks and to receive block rewards. Block rewards are composed by the transaction fees and the coinbase.
Collators share the rewards with their delegators, considering their proportional contribution toward their stake in the network. Block rewards are distributed between a collator and its delegators with this rule:
- the 15% of the rewards goes to the collator
- the remaining 85% goes to delegators, the reward for each delegator will be proportional to the delegated stakes. Collator bonds are considered as delegated stakes and so collators will receive part of delegators rewards in proportion of their stakes.

Rewards for collators and their delegators are distributed after the reward payout delay and they are paid out on a block-by-block basis starting at the second block of the round. For every block, one collator will be chosen to receive their entire reward payout from the prior round, along with their delegators, until all of the rewards have been paid for that round.


### General Tips on Selecting Collators

- In general it is better to choose a collator with a lower total amount bonded, because in that case your delegation amount will represent a larger portion of the collator’s total stake and you will earn proportionally higher rewards. However, there is a higher risk of the collator being kicked out of the active set and not earning rewards at all.
- Spreading delegations between multiple collators is more efficient in terms of rewards, but only recommended if you have enough to stay above the minimum stake of each collator.
- You can consider collator performance by reviewing the number of blocks each collator has produced recently.


## Stake Management

### How to Delegate Stakes
In order to delegate stakes to a collator, some information should first be retrieved:
- The list of collators for choosing the collator to delegate to.
- The number of delegations belonging to the chosen collator.
- The number of delegations of the delegator itself. If the number of delegations is already known, this step can be skipped.


#### Retrieve the List of Candidates
- Open Polkadot.js Apps.
- Select _Developer>Chain State_.
- Select _parachainStaking_ and _candidatePool_.
- Press the "+" button.

This query will show all the collator candidates, including the ones not in the active pool. For retrieving the collators in the active pool, execute the same steps but substitute _candidatePool_ with _selectedCandidates_.

#### Get the Candidate Delegation Count
- Open Polkadot.js Apps.
- Select _Developer>Chain State_.
- Select _parachainStaking_ and then _candidateInfo_.
- Set the chosen collator account in the _AccountId20_ field.
- Press the "+" button and save the _delegationCount_ result.

#### Get the Number of Existing Delegations of the Delegator
There is no RPC call that allows retrieving the number of the existing delegations of a delegator. One way to obtain this information is by running a JavaScript code snippet from the Polkadot.js Apps:
- On Polkadot.js Apps, select _Developer>Javascript_.
- Select any example and remove the code already present.
- Copy the following code after having replaced _DELEGATOR_ADDRESS_ placeholder with the actual delegator address:
```
// Replace DELEGATOR_ADDRESS with the actual delegator address.
const delegatorAccount = 'DELEGATOR_ADDRESS'; 
const delegatorInfo = 
  await api.query.parachainStaking.delegatorState(delegatorAccount);

if (delegatorInfo.toHuman()) {
  console.log(`Delegation size is: ${delegatorInfo.toHuman()['delegations'].length}`);
} else {
  console.log(0);
}

```

and paste it inside the code editor box.
- Press the run button.

It is possible to save this snippet code just pressing the Save icon and choosing a name.
                                                                                                       

#### Delegate the Stake
- Import the  delegator account in Polkadot.js as described in [How to Import an Ethereum Account into Polkadot.js Apps](./05-add_account_polkadotjs.md) tutorial. Make sure that the delegator account has a balance with at least the minimum stake required plus some extra for transaction fees. 
- On Polkadot.js Apps, select _Developer>Extrinsics_.
- In _using the selected account_ field, select the delegator account.
- Select _parachainStaking_ and then _delegate_.
- Set the _candidate_ field to the address of the chosen collator.
- Set _amount_ field to at least the minimum stake required for becoming a delegator. The value for the minimum stake can be found using Polkadot.js Apps, under _Developer>Chain State>Constants_ tab, selecting _parachainStaking_, _minDelegation_ and pressing the "+" button.
- Set the _candidateDelegationCount_ field to the value retrieved in [Get the Candidate Delegation Count](#get-the-candidate-delegation-count).
- Set the _delegationCount_ field to the value retrieved in [Get the Number of Existing Delegations of the Delegator](#get-the-number-of-existing-delegations-of-the-delegator).
- Submit the transaction. Follow the wizard and sign the transaction using the password you set for the account.

For verifying that the delegation was executed correctly, check the delegator state:
- Select _Developer>Chain State_.
- Select _parachainStaking_ and then _delegatorState_.
- Select the delegator account in the _AccountId20_ field.
- Press the "+" button.

### How to Stop a Delegation
Revoking a delegation requires two steps. First it is necessary to schedule a request to revoke the delegation. Then, it is necessary to wait for a fixed number of rounds, called _leaveDelegatorsDelay_, after that the execution of the revoke request can be invoked.

#### Schedule a Delegation Revoke Request
The steps for scheduling a delegation revoke request are:
- On Polkadot.js Apps, select _Developer>Extrinsics_.
- In _using the selected account_ field, select the delegator account.
- Select _parachainStaking_ and then _scheduleRevokeDelegation_.
- Set the candidate account in the _collator_ field.
- Submit the transaction. Follow the wizard and sign the transaction using the password you set for the account.

#### Execute a Delegation Revoke Request
The steps for executing a revoke request are:
- After having scheduled a revoke request, wait until _leaveDelegatorsDelay_ rounds have passed. The value for _leaveDelegatorsDelay_ can be found using Polkadot.js Apps, under _Developer>Chain State>Constants_ tab, selecting _parachainStaking_, _leaveDelegatorsDelay_ and pressing the "+" button.
- Select _Developer>Extrinsics_.
- In _using the selected account_ field, select the account that will request the extrinsic. It is not needed to be the delegator account, it can be any account.
- Select _parachainStaking_ and then _executeDelegationRequest_.
- Set the candidate account in the _candidate_ field and the delegator account in _delegator_ field.
- Submit the transaction. Follow the wizard and sign the transaction using the password you set for the account.

#### Cancel a Scheduled Delegation Revoke Request 
It is possible to cancel a scheduled revoke request until it is not actually executed.

The steps for cancelling a scheduled revoke request are:
- On Polkadot.js Apps, select _Developer>Extrinsics_.
- In _using the selected account_ field, select the delegator account.
- Select _parachainStaking_ and then _cancelDelegationRequest_.
- Set the candidate account in the _candidate_ field.
- Submit the transaction. Follow the wizard and sign the transaction using the password you set for the account.

### How to Change a Delegation Amount
A delegator can increase or decrease the amount of its stakes. While increasing the stakes is a straightforward operation that has an immediate effect, decreasing the stakes is a 2-step operation: first it is scheduled a bond-less operation, than, after a fixed delay called _delegationBondLessDelay_, the execution of the bond-less operation can be invoked. The bond-less request can also be canceled.

A bond-less operation is only allowed if the remaining bond amount after the decrease is still greater or equal the minimum stake required.

#### Increase the Delegation Amount

The steps for increasing the delegation amount are:
- On Polkadot.js Apps, select _Developer>Extrinsics_.
- In _using the selected account_ field, select the delegator account.
- Select _parachainStaking_ and then _delegatorBondMore_.
- Set the candidate account in the _candidate_ field.
- Set the _more_ field to the additional bond value.
- Submit the transaction. Follow the wizard and sign the transaction using the password you set for the account.


#### Schedule a Bond Less Request

The steps for scheduling a bond-less request are:
- On Polkadot.js Apps, select _Developer>Extrinsics_.
- In _using the selected account_ field, select the delegator account.
- Select _parachainStaking_ and then _scheduleDelegatorBondLess_.
- Set the candidate account in the _candidate_ field.
- Set the _less_ field to the amount to be unbonded.
- Submit the transaction. Follow the wizard and sign the transaction using the password you set for the account.

#### Execute a Scheduled Bond Less Request

The steps for executing a bond-less request are the same as to execute a delegation revoke request. See [Execute a Delegation Revoke Request](#execute-a-delegation-revoke-request) for details.

#### Cancel a Scheduled Bond Less Request 
The steps for cancel a bond-less request are the same as to cancel a delegation revoke request. See [Cancel a Scheduled Delegation Revoke Request](#cancel-a-scheduled-delegation-revoke-request) for details.





