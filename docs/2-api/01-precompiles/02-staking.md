# Staking

Horizen2 parachain uses Parachain Staking pallet, that allows users to stake their ZEN tokens to support the parachain. 
The staking pallet is responsible for managing the staking process, including staking, delegation, and rewards distribution.
For general information see tutorials for [Collator Management](../../3-tutorials/01-run-collator.md) and [Stake and Delegation](../../3-tutorials/02-stake-and-delegation.md).

## Precompile Details

- **Precompile Address**: `0x0000000000000000000000000000000000000800`
- **Solidity Interface**: [ParachainStaking.sol](https://github.com/HorizenOfficial/horizen/blob/main/precompiles/parachain-staking/ParachainStaking.sol)

## Exit Delays

Some of the extrinsics in the Parachain Staking pallet have an exit delay. This means that the staked funds are not immediately available for withdrawal.
The exit delays for different extrinsics are as follows:

| Extrinsic            | Exit Delay |
|----------------------|----------|
| Leave Candidates     | 20 round |
| Revoke Delegation    | 20 round |
| Candidate Bond Less  | 20 round |
| Delegation Bond Less | 20 round |


## Available Methods

The Parachain Staking pallet exposes the following methods:

### `isDelegator(address delegator)`
Read-only function that checks whether the specified address is currently a staking delegator.

Input:
- `address delegator`: The address to check.

Output:
- `bool`: `true` if the address is a delegator, `false` otherwise.

### `isCandidate(address delegator)`
Read-only function that checks whether the specified address is currently a collator candidate

Input:
- `address candidate`: address to check if they are currently a collator candidate

Output:
- `bool`: `true` if the address is a collator candidate, `false` otherwise.

### `isSelectedCandidate(address candidate)`
read-only function that checks whether the specified address is currently part of the active collator set.

Input:
- `address candidate`: address to check if they are currently an active collator

Output:
- `bool`: `true` if the address is active collator, `false` otherwise. 

### `points(uint256 round)`
read-only function that gets the total points awarded to all collators in a given round.

Input:
- `uint256 round`: uint256 round number to query points for

Output:
- `uint256`: total points awarded in the specified round

### `awardedPoints(uint32 round, address candidate)`
read-only function that returns the total points awarded in a given round to a given collator. If 0 is returned, it could be because no blocks were produced or the storage for that round has been removed.

Input:
- `uint32 round`: uint32 round number to query
- `address candidate`: address of the collator to query points for

Output:
- `uint32`: points awarded to the collator in the specified round

### `delegationAmount(address delegator, address candidate)`
read-only function that returns the amount delegated by a given delegator in support of a given candidate.

Input:
- `address delegator`: address of the delegator
- `address candidate`: address of the candidate

Output:
- `uint256`: amount delegated

### `isInTopDelegations(address delegator, address candidate)`
read-only function that returns a boolean indicating whether the given delegator is in the top delegations for the given candidate.

Input:
- `address delegator`: address of the delegator
- `address candidate`: address of the candidate

Output:
- `bool`: whether the delegator is in the top delegations

### `minDelegation()`
read-only function that gets the minimum delegation amount.

Input:
- None

Output:
- `uint256`: minimum delegation amount

### `candidateCount()`
read-only function that gets the current amount of collator candidates.

Input:
- None

Output:
- `uint256`: current number of collator candidates

### `round()`
read-only function that returns the current round number.

Input:
- None

Output:
- `uint256`: current round number

### `candidateDelegationCount(address candidate)`
read-only function that returns the number of delegations for the specified collator candidate address.

Input:
- `address candidate`: address of the collator candidate to query

Output:
- `uint256`: number of delegations for the candidate

### `candidateAutoCompoundingDelegationCount(address candidate)`
read-only function that returns the number of auto-compounding delegations for the specified candidate.

Input:
- `address candidate`: address of the candidate to query

Output:
- `uint256`: number of auto-compounding delegations

### `delegatorDelegationCount(address delegator)`
read-only function that returns the number of delegations for the specified delegator address.

Input:
- `address delegator`: address of the delegator to query

Output:
- `uint256`: number of delegations for the delegator

### `selectedCandidates()`
read-only function that gets the selected candidates for the current round.

Input:
- None

Output:
- `address[]`: array of selected candidate addresses

### `delegationRequestIsPending(address delegator, address candidate)`
returns a boolean to indicate whether there is a pending delegation request made by a given delegator for a given candidate.

Input:
- `address delegator`: address of the delegator
- `address candidate`: address of the candidate

Output:
- `bool`: whether there is a pending delegation request

### `candidateExitIsPending(address candidate)`
returns a boolean to indicate whether a pending exit exists for a specific candidate.

Input:
- `address candidate`: address of the candidate to check

Output:
- `bool`: whether there is a pending exit request

### `candidateRequestIsPending(address candidate)`
returns a boolean to indicate whether there is a pending bond less request made by a given candidate.

Input:
- `address candidate`: address of the candidate to check

Output:
- `bool`: whether there is a pending bond less request

### `delegationAutoCompound(address delegator, address candidate)`
returns the auto-compound percentage for a delegation given the delegator and candidate.

Input:
- `address delegator`: address of the delegator
- `address candidate`: address of the candidate

Output:
- `uint256`: auto-compound percentage

### `getDelegatorTotalStaked(address delegator)`
read-only function that returns the total staked amount of a given delegator, regardless of the candidate.

Input:
- `address delegator`: address of the delegator to query

Output:
- `uint256`: total staked amount

### `getCandidateTotalCounted(address candidate)`
read-only function that returns the total amount staked for a given candidate.

Input:
- `address candidate`: address of the candidate to query

Output:
- `uint256`: total amount staked for the candidate

### `joinCandidates(uint256 amount, uint256 candidateCount)`
allows the account to join the set of collator candidates with the specified bond amount and the current candidate count. 

Preconditions:
- amount should be equal or more than the minimum bond amount. The value for the minimum stake can be found using Polkadot.js Apps, under Developer>Chain State>Constants tab, selecting parachainStaking, minCandidateStk and pressing the "+" button.
- candidateCount can be obtained from the [candidateCount()](#candidatecount) function 

Input:
- `uint256 amount`: uint256 bond amount to stake as a candidate
- `uint256 candidateCount`: uint256 current number of candidates in the pool

Output:
- None

### `scheduleLeaveCandidates(uint256 candidateCount)`
schedules a request for a candidate to remove themselves from the candidate pool. Scheduling the request does not automatically execute it. There is an exit delay that must be waited before you can execute the request via the executeLeaveCandidates extrinsic.

Preconditions:
- candidateCount can be obtained from the [candidateCount()](#candidatecount) function

Input:
- `uint256 candidateCount`: uint256 current number of candidates in the pool

Output:
- None

### `executeLeaveCandidates(address candidate, uint256 candidateDelegationCount)`
executes the due request to leave the set of collator candidates.

Preconditions:
- candidateDelegationCount can be obtained from the [candidateDelegationCount()](#candidatedelegationcountaddress-candidate) function

Input:
- `address candidate`: address of the candidate leaving the pool
- `uint256 candidateDelegationCount`: uint256 number of delegations for the candidate

Output:
- None

### `cancelLeaveCandidates(uint256 candidateCount)`
allows a candidate to cancel a pending scheduled request to leave the candidate pool. Given the current number of candidates in the pool.

Preconditions:
- candidateCount can be obtained from the [candidateCount()](#candidatecount) function

Input:
- `uint256 candidateCount`: uint256 current number of candidates in the pool

Output:
- None

### `goOffline()`
temporarily leave the set of collator candidates without unbonding.

Input:
- None

Output:
- None

### `goOnline()`
rejoin the set of collator candidates after previously calling goOffline().

Input:
- None

Output:
- None

### `candidateBondMore(uint256 more)`
collator candidate increases bond by the specified amount.

Input:
- `uint256 more`: uint256 amount to increase the bond by

Output:
- None

### `scheduleCandidateBondLess(uint256 less)`
schedules a request to decrease a candidates bond by the specified amount. Scheduling the request does not automatically execute it. There is an exit delay that must be waited before you can execute the request via the execute_candidate_bond_request extrinsic.

Input:
- `uint256 less`: uint256 amount to decrease the bond by

Output:
- None

### `executeCandidateBondLess(address candidate)`
executes any due requests to decrease a specified candidate's bond amount.

Input:
- `address candidate`: address of the candidate to execute the bond decrease for

Output:
- None

### `cancelCandidateBondLess()`
allows a candidate to cancel a pending scheduled request to decrease a candidates bond.

Input:
- None

Output:
- None

### `delegateWithAutoCompound(address candidate, uint256 amount, uint8 autoCompound, uint256 candidateDelegationCount, uint256 candidateAutoCompoundingDelegationCount, uint256 delegatorDelegationCount)`
makes a delegation in support of a collator candidate and automatically sets the percent of rewards to auto-compound given an integer (no decimals) for autoCompound between 0-100.

Preconditions:
- amount should be equal or more than the [minDelegation()](#mindelegation) amount
- candidateDelegationCount can be obtained from the [candidateDelegationCount()](#candidatedelegationcountaddress-candidate) function
- candidateAutoCompoundingDelegationCount can be obtained from the [candidateAutoCompoundingDelegationCount()](#candidateautocompoundingdelegationcountaddress-candidate) function
- delegatorDelegationCount can be obtained from the [delegatorDelegationCount()](#delegatordelegationcountaddress-delegator) function

Input:
- `address candidate` - address of the candidate to delegate to
- `uint256 amount` - uint256 amount to delegate
- `uint8 autoCompound` - uint8 percentage of rewards to auto-compound (0-100)
- `uint256 candidateDelegationCount` - uint256 current number of delegations for the candidate
- `uint256 candidateAutoCompoundingDelegationCount` - uint256 current number of auto-compounding delegations for the candidate
- `uint256 delegatorDelegationCount` - uint256 current number of delegations from the delegator

Output:
- None

### `scheduleRevokeDelegation(address candidate)`
schedules a request to revoke a delegation given the address of a candidate. Scheduling the request does not automatically execute it. There is an exit delay that must be waited before you can execute the request via the executeDelegationRequest extrinsic.

Input:
- `address candidate`: address of the candidate to revoke delegation from

Output:
- None

### `delegatorBondMore(address candidate, uint256 more)`
delegator increases bond to a collator by the specified amount.

Input:
- `address candidate`: address of the candidate to increase delegation for
- `uint256 more`: uint256 amount to increase the delegation by

Output:
- None

### `scheduleDelegatorBondLess(address candidate, uint256 less)`
schedules a request for a delegator to bond less with respect to a specific candidate. Scheduling the request does not automatically execute it. There is an exit delay that must be waited before you can execute the request via the executeDelegationRequest extrinsic.

Input:
- `address candidate`: address of the candidate to decrease delegation for
- `uint256 less`: uint256 amount to decrease the delegation by

Output:
- None

### `executeDelegationRequest(address delegator, address candidate)`
executes any due delegation requests provided the address of a delegator and a candidate.

Input:
- `address delegator`: address of the delegator
- `address candidate`: address of the candidate

Output:
- None

### `cancelDelegationRequest(address candidate)`
cancels any pending delegation requests provided the address of a candidate.

Input:
- `address candidate`: address of the candidate to cancel the delegation request for

Output:
- None

### `setAutoCompound(address candidate, uint8 value, uint256 candidateAutoCompoundingDelegationCount, uint256 delegatorDelegationCount)`
sets an auto-compound value for an existing delegation given an integer (no decimals) for the value between 0-100.

Preconditions:
- candidateAutoCompoundingDelegationCount can be obtained from the [candidateAutoCompoundingDelegationCount()](#candidateautocompoundingdelegationcountaddress-candidate) function
- delegatorDelegationCount can be obtained from the [delegatorDelegationCount()](#delegatordelegationcountaddress-delegator) function

Input:
- `address candidate` - address of the candidate
- `uint8 value` - uint8 percentage to auto-compound (0-100)
- `uint256 candidateAutoCompoundingDelegationCount` - uint256 current number of auto-compounding delegations for the candidate
- `uint256 delegatorDelegationCount` - uint256 current number of delegations from the delegator

Output:
- None
