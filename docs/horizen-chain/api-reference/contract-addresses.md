---
title: Network & Contract Addresses
description: "Official contract addresses for Horizen and Base: ZEN ERC-20, USDC.e, cbBTC, OP Stack bridge contracts, and integration partner contracts (Stork, Den) on mainnet and testnet."
sidebar_position: 2
---

All addresses below are sourced directly from official Horizen and integration partner documentation. Always verify addresses before interacting with any contract on mainnet.

## Token Contracts

### ZEN

| Network | Type | Address |
|---|---|---|
| Mainnet Base | ERC-20 | [`0xf43eB8De897Fbc7F2502483B2Bef7Bb9EA179229`](https://basescan.org/address/0xf43eB8De897Fbc7F2502483B2Bef7Bb9EA179229) |
| Mainnet Base | OFT Adapter (LayerZero) | [`0x57da2D504bf8b83Ef304759d9f2648522D7a9280`](https://basescan.org/address/0x57da2D504bf8b83Ef304759d9f2648522D7a9280) |
| Mainnet Horizen | OFT (LayerZero) | [`0x57da2D504bf8b83Ef304759d9f2648522D7a9280`](https://explorer.horizen.io/address/0x57da2D504bf8b83Ef304759d9f2648522D7a9280) |
| Testnet Base | ERC-20 (tZEN) | [`0x107fdE93838e3404934877935993782F977324BB`](https://sepolia.basescan.org/address/0x107fdE93838e3404934877935993782F977324BB) |
| Testnet Base | OFT Adapter (LayerZero) | [`0x2ead4B0beBD8e54F9B7cC1007DF4c44a27b9a339`](https://sepolia.basescan.org/address/0x2ead4B0beBD8e54F9B7cC1007DF4c44a27b9a339) |
| Testnet Horizen | OFT (LayerZero) | [`0xb06EC4ce262D8dbDc24Fac87479A49A7DC4cFb87`](https://explorer-testnet.horizen.io/address/0xb06EC4ce262D8dbDc24Fac87479A49A7DC4cFb87) |

### USDC / USDC.e

| Network | Type | Address |
|---|---|---|
| Mainnet Base | USDC ERC-20 | [`0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`](https://basescan.org/address/0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913) |
| Mainnet Base | Lock Contract (LayerZero) | [`0x27a16dc786820B16E5c9028b75B99F6f604b5d26`](https://basescan.org/address/0x27a16dc786820B16E5c9028b75B99F6f604b5d26) |
| Mainnet Horizen | USDC.e ERC-20 | [`0xDF7108f8B10F9b9eC1aba01CCa057268cbf86B6c`](https://explorer.horizen.io/address/0xDF7108f8B10F9b9eC1aba01CCa057268cbf86B6c) |
| Mainnet Horizen | OFT (LayerZero) | [`0x3a1293Bdb83bBbDd5Ebf4fAc96605aD2021BbC0f`](https://explorer.horizen.io/address/0x3a1293Bdb83bBbDd5Ebf4fAc96605aD2021BbC0f) |

### cbBTC

| Network | Type | Address |
|---|---|---|
| Mainnet Base | ERC-20 | [`0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf`](https://basescan.org/address/0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf) |
| Mainnet Base | OFT Adapter (LayerZero) | [`0x68fb5BB8330C0b9d907F50f278143873276ee056`](https://basescan.org/address/0x68fb5BB8330C0b9d907F50f278143873276ee056) |
| Mainnet Horizen | OFT (LayerZero) | [`0x68fb5BB8330C0b9d907F50f278143873276ee056`](https://explorer.horizen.io/address/0x68fb5BB8330C0b9d907F50f278143873276ee056) |
| Testnet Base | ERC-20 | [`0xcbb7c0006f23900c38eb856149f799620fcb8a4a`](https://sepolia.basescan.org/address/0xcbb7c0006f23900c38eb856149f799620fcb8a4a) |
| Testnet Base | OFT Adapter (LayerZero) | [`0x5dE29d14E72feb79967596F3Ae57A9BfBA192769`](https://sepolia.basescan.org/address/0x5dE29d14E72feb79967596F3Ae57A9BfBA192769) |
| Testnet Horizen | OFT (LayerZero) | [`0x06DA6bDD2aB23447af5162ab0975edDA7E8d3747`](https://explorer-testnet.horizen.io/address/0x06DA6bDD2aB23447af5162ab0975edDA7E8d3747) |

<br/>

## Migration Contracts (Base Mainnet)

These contracts handle the ZEN token migration from the legacy Horizen mainchain and EON chain. Relevant for integrations that verify ZEN token provenance or check unclaimed migration balances.

| Contract | Address |
|---|---|
| **ZenToken** - Official ZEN ERC-20 | [`0xf43eB8De897Fbc7F2502483B2Bef7Bb9EA179229`](https://basescan.org/address/0xf43eB8De897Fbc7F2502483B2Bef7Bb9EA179229) |
| **EONBackupVault** - EON balance distribution | [`0x1Cc689233837A0b96e1f176d49FC08462f70C47F`](https://basescan.org/address/0x1Cc689233837A0b96e1f176d49FC08462f70C47F) |
| **ZendBackupVault** - ZEND manual claiming | [`0x1Ee188bDf19eBF04B73Ab6FFcec2a864cd4774F2`](https://basescan.org/address/0x1Ee188bDf19eBF04B73Ab6FFcec2a864cd4774F2) |

Source code: [github.com/HorizenOfficial/horizen-migration](https://github.com/HorizenOfficial/horizen-migration/blob/main/erc20-migration/contracts)



## Oracle Contracts: Stork

Verified directly from [docs.stork.network/resources/contract-addresses/evm](https://docs.stork.network/resources/contract-addresses/evm).

| Network | Address |
|---|---|
| **Mainnet Horizen** | [`0xacC0a0cF13571d30B4b8637996F5D6D774d4fd62`](https://explorer.horizen.io/address/0xacC0a0cF13571d30B4b8637996F5D6D774d4fd62) |
| **Testnet Horizen** | [`0xacC0a0cF13571d30B4b8637996F5D6D774d4fd62`](https://explorer-testnet.horizen.io/address/0xacC0a0cF13571d30B4b8637996F5D6D774d4fd62) |

> Both mainnet and testnet share the same Stork contract address on Horizen.


## Multisig: Den / Safe

| Resource | URL |
|---|---|
| Den on Horizen | `https://safe.horizen.io/welcome` |
