# Collator Management
This tutorial will show how create and maintain a collator node in Horizen 2.

## How to Run a Collator
The following are the steps required for running a collator node:
- Run a Horizen 2 node (see [TBD] for details). Make sure to add the following command-line parameter: `--collator`.
- Create an account for the collator, e.g. by using Metamask. It will be used for joining the collator pool and for receiving the block rewards. Make sure that it has a balance with at least the minimum stake required plus some extra for transaction fees. 
- Import the account in Polkadot.js as described in [How to Import an Ethereum Account into Polkadot.js Apps](./05-add_account_polkadotjs.md) tutorial. Note: if you don't use Polkadot.js for interacting with your node, you can skip this step.
- Create the session keys on the collator node:
    - Open Polkadot.js Apps and connect it to the collator node.
    - Select _Developer>RPC Calls_. 
    - Select _author_ as endpoint and then _rotateKeys_. 
    - Press _Submit RPC call_.
    - Copy the string representing the public session key.
- Map the collator account to the session keys created in the previous step:
    - On Polkadot.js Apps, select _Developer>Extrinsics_.
    - In _using the selected account_ field, select the collator account.
    - Select _session_ and then _setKeys_.
    - Put the session key saved before in _keys_ field and put _0x_ in _proof_ field.
    - Press _Submit transaction_, authorize the transaction using the password associated with the account and wait until the transaction is executed.
- Add the collator to the candidate pool:
    - Retrieve the size of the candidate pool, as described in [How to Get the Size of the Candidate Pool](#how-to-get-the-size-of-the-candidate-pool) section.
    - On Polkadot.js Apps, select _Developer>Extrinsics_.
    - In _using the selected account_ field, select the collator account.
    - Select _parachainStaking_ and then _joinCandidates_.  
    - Set _bond_ field to at least the minimum stake required for becoming a collator. The value for the minimum stake can be found using Polkadot.js Apps, under _Developer>Chain State>Constants_ tab, selecting _parachainStaking_, _minCandidateStk_ and pressing the "+" button.
    - Set the _candidateCount_ field to the size of the candidate pool.
    - Submit the transaction. Follow the wizard and sign the transaction using the password you set for the account.

For checking that the collator has actually joined the candidate pool, see [How to Get Candidate Information](#how-to-get-candidate-information) section.

**Note**: there is a maximum number of collator candidates, if the number of candidates has already reached its maximum value the _joinCandidates_ will fail. The candidate maximum value can be found using Polkadot.js Apps, under _Developer>Chain State>Constants_ tab, selecting _parachainStaking_, _maxCandidates_ and pressing the "+" button.

If the collator is in the top candidates by stake set, it will create blocks starting from the next round. The rewards will be payed after a fixed number of rounds called _rewardPaymentDelay_, whose value can be found using Polkadot.js Apps, under _Developer>Chain State>Constants_ tab, selecting _parachainStaking_, _rewardPaymentDelay_ and pressing the "+" button.

## How to Leave the Collator Pool
Stopping being a collator is an operation that requires two steps. First it is necessary to schedule a request to leave the collator pool. Then it is necessary to wait a fixed number of rounds, called _leaveCandidateDelay_, after that the execution of the leave request can be invoked.
Scheduling a leave request automatically removes the collator from the active set, so it will be no longer eligible to produce blocks or earn rewards. The collator bond and the delegator stakes, instead, are returned only after the leave request is executed.

The steps for scheduling a leave request are:
- Retrieve the size of the candidate pool, as described in [How to Get the Size of the Candidate Pool](#how-to-get-the-size-of-the-candidate-pool) section.
- On Polkadot.js Apps, select _Developer>Extrinsics_.
- In _using the selected account_ field, select the collator account.
- Select _parachainStaking_ and then _scheduleLeaveCandidates_.
- Set the _candidateCount_ field to the size of the candidate pool.
- Submit the transaction. Follow the wizard and sign the transaction using the password you set for the account.

The steps for executing a leave request are:
- After having scheduled a leave request, wait until _leaveCandidateDelay_ rounds have passed. The value for _leaveCandidateDelay_ can be found using Polkadot.js Apps, under _Developer>Chain State>Constants_ tab, selecting _parachainStaking_, _leaveCandidateDelay_ and pressing the "+" button.
- Retrieve the number of delegations the collator has:
    - On Polkadot.js Apps, select _Developer>Chain State_.
    - Select _parachainStaking_ and then _candidateInfo_.
    - Set the candidate account in the _AccountId20_ field.
    - Press the "+" button and save the _delegationCount_ result. 
- Select _Developer>Extrinsics_.
- In _using the selected account_ field, select the account that will request the extrinsic. It is not needed to be the collator account, it can be any account.
- Select _parachainStaking_ and then _executeLeaveCandidate_.
- Set the candidate account in the _candidate_ field and the delegation number retrieved before in _candidateDelegationCount_ field.
- Submit the transaction. Follow the wizard and sign the transaction using the password you set for the account.
 
### How to Cancel a Scheduled Leave Request 
It is possible to cancel a scheduled leave request until it is not actually executed. 

The steps for cancelling a scheduled leave request are:
- Retrieve the size of the candidate pool, as described in [How to Get the Size of the Candidate Pool](#how-to-get-the-size-of-the-candidate-pool) section.
- On Polkadot.js Apps, select _Developer>Extrinsics_.
- In _using the selected account_ field, select the collator account.
- Select _parachainStaking_ and then _cancelLeaveCandidates_.
- Set the _candidateCount_ field to the size of the candidate pool.
- Submit the transaction. Follow the wizard and sign the transaction using the password you set for the account.

## How to Change the Bond Amount
A collator can increase or decrease the amount of its bond. While increasing the bond is a straightforward operation that has an immediate effect, decreasing the bond is a 2-step operation: first it is scheduled a bond-less operation, than, after a fixed delay called _candidateBondLessDelay_, the execution of the bond-less operation can be invoked. The bond-less request can also be canceled.

A bond-less operation is only allowed if the remaining bond amount after the decrease is still greater or equal the minimum stake required.

### How to Increase the Bond Amount

The steps for increasing the bond amount are:
- On Polkadot.js Apps, select _Developer>Extrinsics_.
- In _using the selected account_ field, select the collator account.
- Select _parachainStaking_ and then _candidateBondMore_.
- Set the _more_ field to the additional bond value.
- Submit the transaction. Follow the wizard and sign the transaction using the password you set for the account.

The collator balance will be immediately changed but the increased bond will have effect on collator selection only starting from the next round. 

### How to Schedule a Bond Less Request

The steps for scheduling a bond-less request are:
- On Polkadot.js Apps, select _Developer>Extrinsics_.
- In _using the selected account_ field, select the collator account.
- Select _parachainStaking_ and then _scheduleCandidateBondLess_.
- Set the _less_ field to the amount to be unbonded.
- Submit the transaction. Follow the wizard and sign the transaction using the password you set for the account.

### How to Execute a Scheduled Bond Less Request

The steps for executing a bond-less request are:
- After having scheduled a bond-less request, wait until _candidateBondLessDelay_ rounds have passed. The value for _candidateBondLessDelay_ can be found using Polkadot.js Apps, under _Developer>Chain State>Constants_ tab, selecting _parachainStaking_, _candidateBondLessDelay_ and pressing the "+" button.
- In _using the selected account_ field, select the account that will request the extrinsic. It is not needed to be the collator account, it can be any account.
- Select _parachainStaking_ and then _executeCandidateBondLess_.
- Set the candidate account in the _candidate_ field.
- Submit the transaction. Follow the wizard and sign the transaction using the password you set for the account.

The collator balance will be immediately changed but the decreased bond will have effect on collator selection only starting from the next round.

## How to Cancel a Scheduled Bond Less Request 
It is possible to cancel a scheduled bond-less request until it is not actually executed.
The steps are:
- On Polkadot.js Apps, select _Developer>Extrinsics_.
- In _using the selected account_ field, select the collator account.
- Select _parachainStaking_ and then _cancelCandidateBondLess_.
- Submit the transaction. Follow the wizard and sign the transaction using the password you set for the account.


## How to Get Candidate Information

It may be useful to retrieve some information about the collator pool and about a specific collator.

For retrieving information about a collator candidate:
- On Polkadot.js Apps, select _Developer>Chain State_.
- Select _parachainStaking_ and then _candidateInfo_.
- Set the candidate account in the _AccountId20_ field.
- Press the "+" button.

This is an example of retrieved information:

```
{
  bond: 200,000,000,000
  delegationCount: 0
  totalCounted: 200,000,000,000
  lowestTopDelegationAmount: 0
  highestBottomDelegationAmount: 0
  lowestBottomDelegationAmount: 0
  topCapacity: Empty
  bottomCapacity: Empty
  request: null
  status: Active
}
```

For retrieving the list of collator candidates, including the ones that are not selected in the active pool:
- On Polkadot.js Apps, select _Developer>Chain State_.
- Select _parachainStaking_ and then _candidatePool_.
- Press the "+" button.

For retrieving the list of the selected collators for the current round:
- On Polkadot.js Apps, select _Developer>Chain State_.
- Select _parachainStaking_ and then _selectedCandidates_.
- Press the "+" button.


## How to Get the Size of the Candidate Pool
There is no RPC call that allows retrieving the size of the candidate pool. One way to obtain this information is by running a JavaScript code snippet from the Polkadot.js Apps:
- On Polkadot.js Apps, select _Developer>Javascript_. 
- Select any example and remove the code already present. 
- Copy the following code:
```
const candidatePool = await api.query.parachainStaking.candidatePool();
console.log(`Candidate pool size is: ${candidatePool.length}`);

```

and paste it inside the code editor box.
- Press the run button.
- It is possible to save this snippet code just pressing the Save icon and choosing a name.
