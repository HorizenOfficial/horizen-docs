# Architecture

Horizen is designed to be a Substrate-based parachain, working in conjunction with the zkVerify chain - the latter operating as the relay chain.<br/>
Substrate is a blockchain framework developed by Parity Technologies that allows developers to build custom blockchains quickly and efficiently. 

## Ecosystem Participants

<img class="bordered" src="/img/architecture1.png"/>

zkVerify validators secure both the Relay Chain and the Horizen parachain.  

Collators are similar to validators on any other blockchain, but they do not provide any crypto-economic security guarantees because Relay Chain provides those. Collators only need to produce blocks that extend their finalized chain.

Horizen Collators maintain the parachain by collecting parachain transactions from users and producing state transition proofs for Relay Chain validators. In other words, collators maintain parachains by aggregating parachain transactions into parachain block candidates and producing state transition proofs (Proof-of-Validity - PoV) for validators. Relay chain validators will reject invalid blocks, so a parachain only needs a single honest collator to submit blocks. 

## Main components and layers

- <b>Substrate</b>  is the base blockchain framework used to power the Horizen ecosystem. It is a full toolkit to create sovereign blockchains. 
- <b>FRAME</b> is the framework used in Substrate to create the  application logic layer, aka. runtime. It defines the concept of <b>pallet</b>, a modular component that covers a specific functionality.
- <b>Cumulus</b> is the FRAME-based framework to create runtimes for parachains.
- <b>Aura</b> is the consensus mechanism used to select the collator responsible to author blocks in the Horizen chain. More on that in the Consensus section.
- <b>Frontier</b> is the module that provides Ethereum-compatibility to Horizen. Under the hood it uses the Rust EVM, a flexible Ethereum Virtual Machine interpreter written in Rust.