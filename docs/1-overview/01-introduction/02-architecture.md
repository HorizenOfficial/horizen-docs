# Architecture

Horizen is designed to be a Substrate-based parachain, working in conjunction with the zkVerify chain - the latter operating as the relay chain.<br/>
Substrate is a blockchain framework developed by Parity Technologies that allows developers to build custom blockchains quickly and efficiently. 

## Ecosystem Participants

<img class="bordered" src="/img/architecture1.png"/>

zkVerify relay chain validators secure both the relay Chain and the Horizen parachain.  

Horizen Collators are similar to forgers on any other blockchain, but they do not provide any crypto-economic security guarantees because Relay Chain provides those. Collators only need to produce blocks that extend their finalized chain.

Horizen Collators maintain the parachain by collecting parachain transactions from users and producing state transition proofs for Relay Chain validators. In other words, collators maintain parachains by aggregating parachain transactions into parachain block candidates and producing state transition proofs (Proof-of-Validity - PoV) for validators. Relay chain validators will reject invalid blocks. <br/>
Collators are selected to become block authors with a [proof of stake consensus](./03-consensus.md).

## Main components and layers

- <b>[Substrate](https://substrate.io/)</b> is the basic blockchain framework used to power the Horizen ecosystem. It is a full toolkit to create sovereign blockchains. <br/>
  It was originally created to power the Polkadot ecosystem, and is part of the Polkadot-SDK. We use the Polkadot-SDK too, altought both zkVerify and Horizen form their own separate ecosystem.
- <b>[FRAME](https://paritytech.github.io/polkadot-sdk/master/polkadot_sdk_docs/polkadot_sdk/frame_runtime/index.html#frame)</b> is the framework used in Substrate to create the  application logic layer, aka. runtime. It defines the concept of <b>pallet</b>, a modular component that covers a specific functionality. Any chain built with Substrate is composed by a number of pallets working together.
- <b>[Cumulus](https://paritytech.github.io/polkadot-sdk/master/polkadot_sdk_docs/polkadot_sdk/cumulus/index.html)</b> is the FRAME-based framework to create runtimes for parachains.
- <b>[Aura](https://docs.substrate.io/reference/glossary/#authority-round-aura)</b> is the consensus mechanism used to select the collator responsible to author blocks in the Horizen chain. More on that in the [Consensus section](03-consensus.md).
- <b>[Frontier](https://github.com/OpenZeppelin/frontier)</b> is the module that provides Ethereum-compatibility to Horizen. Under the hood it uses the [Rust EVM](https://github.com/rust-ethereum/evm), a flexible Ethereum Virtual Machine interpreter written in Rust.