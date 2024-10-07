# Tokenomics

## Overview

The tokenomics follow what described and approved in the [ZenIP 42407](https://horizen.discourse.group/t/zenip-42407-proposed-tokenomics-for-horizen-2-0/718).<br/>
ZEN is the default currency of the chain.<br/>
A maximum total supply of 21 millions of ZEN is enforced by consensus.<br/>

## Coinbase

40% of the remaining supply of the old Horizen  mainchain  at the moment of the initial bootstrap of the parachain is reserved to the coinbase.<br/>
Every new block authored contains a coinbase (new ZEN minted). The coinbase increases the collator reward coming from the transaction fees, and is redistributed to the collator's delegators with the same rules (fixed collator commission of 15%  and remaining 85% to delegators).<br/>
The coinbase algorithm is designed to mimic the same emission rate of the old mainchain, but with a smooth curve instead of fixed halving steps. This means that at the beginning of the parachain the coinbase will be tuned to be similar to the 40% of  mainchain emission rate after the 3rd halviing (approximately 40% of 3.125 ZEN  => <b>1.25 ZEN  every 2.5 minutes</b>),  then slowly reducing on every new block with an approximate rate of  <b>-50% every 4 years</b>.

<img  src="/img/halvingcurve.png"/>

In the above image a representation of new Horizen halving curve (in green) compared to  the old Horizen mainchain one (in grey).

## Preminiting

60%  of the remaining supply of the old Horizen  mainchain  at the moment of the initial bootstrap of the parachain has been preminted to specific addresses, with the follwing destination:

| Recipient | Sub-recipient     |Percentage|
| --------  | ------- | ------- |
| <b>Horizen foundation</b>   |  | <b>32.5%</b> |
|   | Ecosystem developement     | 15.0% |
|   | $ZEN growth and stability  | 10.0% |
|   | Infrastructure             | 7.5%  |
| <b>DAO Treasury</b>   |  | <b>27.5%</b> |
|   | ZEN sustainability initiative| 17.5% |
|   | Community grants  | 5.0% |
|   | Growth market     | 5.0%  |

For all of the above: 25% of the allocation is immediately onlocked, the remaining 75% vested linearly, with unlocks approximately every 30 days for 4 years.

## Transaction fee handling

Any transaction fee is burnt.<br/>
Both transaction tip and base (weight) fees are redistributed to the collator authoring the block containing the transaction.<br/>
Collected rewards are redistributed to collator's delegators with a fixed collator commission of 15% and remaining 85% to delegators.





