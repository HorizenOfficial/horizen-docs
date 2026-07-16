---
title: Bridge Assets from Base to Horizen
description: Bridge ZEN over Stargate (LayerZero OFT) and ETH over the native bridge, programmatically, with cast and Viem.
---

Horizen runs two bridges. They are different products with different mechanics, and picking the wrong one is the most common way to lose an afternoon.

| | [Stargate](https://stargate.finance/) (LayerZero OFT) | [Native bridge](https://hub.horizen.io) |
|---|---|---|
| Assets | ZEN, USDC, cbBTC | ETH |
| Mechanism | Burn on source, mint on destination | OP Stack lock and mint via Base |
| Routes | Horizen to 80+ chains | Horizen and Base only |
| Deposit time | Typically under 2 minutes | A few minutes after Base finality |
| Withdrawal | Same mechanism both directions | Challenge period applies (7 days) |
| Fees | 0.06% protocol fee plus source gas | Source gas only |


The detail that trips people up: ETH, the gas token on Horizen, moves only through the native bridge. It is not a Stargate asset here. Your users' first onboarding transaction is a native bridge deposit, and so is yours.

This tutorial does both routes programmatically on mainnet (Base to Horizen). There is no contract to write. You are calling contracts that are already deployed, which makes this a scripting exercise, not a Foundry project.

## Prerequisites

- Foundry installed (`cast` in your PATH)
- Node 18+ with `viem` and `@layerzerolabs/lz-v2-utilities` if you want the TypeScript route
- A wallet funded with Base ETH (for gas on both routes)
- ZEN on Base for the Stargate route — acquire via any DEX on Base (Uniswap, Aerodrome) using the ZEN ERC-20 address below
- RPC endpoints: Base at `https://mainnet.base.org`, Horizen Mainnet at `https://horizen.calderachain.xyz/http`

## Contract reference

Mainnet, Base to Horizen:

| Token | Chain | Contract |
|---|---|---|
| ZEN | Base | ERC-20 `0xf43eB8De897Fbc7F2502483B2Bef7Bb9EA179229` · OFT Adapter `0x57da2D504bf8b83Ef304759d9f2648522D7a9280` |
| ZEN | Horizen | OFT `0x57da2D504bf8b83Ef304759d9f2648522D7a9280` |
| USDC | Base | Lock contract `0x27a16dc786820b16e5c9028b75b99f6f604b5d26` |
| USDC | Horizen | OFT `0x3a1293Bdb83bBbDd5Ebf4fAc96605aD2021BbC0f` |
| cbBTC | Base | OFT Adapter `0x68fb5BB8330C0b9d907F50f278143873276ee056` |
| cbBTC | Horizen | OFT `0x68fb5BB8330C0b9d907F50f278143873276ee056` |
| ETH (native bridge) | Base | L1StandardBridge `0xf4a6cc4171fda694439f856d912777aa6ab05369` |

:::note
ZEN's Base OFT Adapter and Horizen OFT share the same address — that is how this deployment is wired.
:::

Testnet, Base Sepolia to Horizen Testnet:

| Token | Chain | Contract |
|---|---|---|
| tZEN | Base Sepolia | OFT Adapter `0x2ead4B0beBD8e54F9B7cC1007DF4c44a27b9a339` |
| tZEN | Horizen Testnet | OFT `0xb06EC4ce262D8dbDc24Fac87479A49A7DC4cFb87` |
| cbBTC | Base Sepolia | OFT Adapter `0x5dE29d14E72feb79967596F3Ae57A9BfBA192769` |
| cbBTC | Horizen Testnet | OFT `0x06DA6bDD2aB23447af5162ab0975edDA7E8d3747` |

:::caution Testnet tokens
tZEN on Base Sepolia has no public faucet. Request an allocation in the [Horizen Discord](https://discord.gg/horizen-334085157441110017) (`#developer` channel). For the native bridge on testnet, get the L1StandardBridge address from a real deposit transaction on [hub-testnet.horizen.io](https://hub-testnet.horizen.io).
:::

LayerZero endpoint IDs — LayerZero's own routing identifiers, unrelated to EVM chain IDs:

| Chain | EID |
|---|---|
| Base | 30184 |
| Base Sepolia | 40245 |
| Horizen Mainnet | 30399 |
| Horizen Testnet | 40435 |

## Route 1: Bridge ZEN over Stargate

<!-- TODO-IMG (bridge-oft-flow.png): source tx → adapter locks/burns → LayerZero message (DVN verify, executor deliver) → OFT mints on Horizen. Add to /public/tutorials/ then replace this comment with: ![OFT transfer flow](/tutorials/bridge-oft-flow.png) -->

If you want the UI path instead, [Stargate](https://stargate.finance/) handles this route without code. This tutorial covers the programmatic path for integrations and automation.

An OFT transfer is one contract call: `send()` on the source-chain OFT contract, preceded by a fee quote from `quoteSend()`. You pay the LayerZero message fee in native gas through `msg.value`. Everything routes through a single struct:

```solidity
struct SendParam {
    uint32  dstEid;       // destination endpoint ID, not the chain ID
    bytes32 to;           // recipient address, left-padded to 32 bytes
    uint256 amountLD;     // amount in the token's local decimals
    uint256 minAmountLD;  // equal to amountLD for burn/mint OFTs
    bytes   extraOptions; // executor options, 0x when enforced options exist
    bytes   composeMsg;   // 0x for a plain transfer
    bytes   oftCmd;       // 0x for a plain transfer
}
```

### Step 1: Approve the adapter

Going Base to Horizen, the adapter pulls ZEN from your wallet, so it needs allowance. Going the other way, the Horizen OFT is the token itself and burns directly, no approval needed. This asymmetry is inherent to the adapter pattern.

```bash
export ADAPTER=0x57da2D504bf8b83Ef304759d9f2648522D7a9280
export ZEN=0xf43eB8De897Fbc7F2502483B2Bef7Bb9EA179229
export RPC_BASE=https://mainnet.base.org

cast send $ZEN "approve(address,uint256)" $ADAPTER 1ether \
  --rpc-url $RPC_BASE --private-key $PK
```

### Step 2: Quote the fee

```bash
export DST_EID=30399
export RECIPIENT_B32=0x000000000000000000000000<your address without 0x>

cast call $ADAPTER \
  "quoteSend((uint32,bytes32,uint256,uint256,bytes,bytes,bytes),bool)((uint256,uint256))" \
  "($DST_EID,$RECIPIENT_B32,1000000000000000000,1000000000000000000,0x,0x,0x)" false \
  --rpc-url $RPC_BASE
```

This returns `(nativeFee, lzTokenFee)`. The native fee covers DVN verification and executor delivery on the destination chain. You pay it once, on the source chain. No gas is needed on Horizen.

### Step 3: Send

```bash
cast send $ADAPTER \
  "send((uint32,bytes32,uint256,uint256,bytes,bytes,bytes),(uint256,uint256),address)" \
  "($DST_EID,$RECIPIENT_B32,1000000000000000000,1000000000000000000,0x,0x,0x)" \
  "($NATIVE_FEE,0)" $YOUR_ADDRESS \
  --value $NATIVE_FEE \
  --rpc-url $RPC_BASE --private-key $PK
```

The last argument is the refund address for any fee overpayment.

### Step 4: Track and Verify

Paste the transaction hash into [LayerZero Scan](https://layerzeroscan.com). The message moves through Inflight, Confirming, and Delivered. Delivered means the executor has landed the mint on Horizen.

<!-- TODO: add worked example tx hash after test run: Worked example: [0x...](https://layerzeroscan.com/tx/0x...) -->

Confirm the balance yourself rather than trusting the UI:

```bash
cast call 0x57da2D504bf8b83Ef304759d9f2648522D7a9280 \
  "balanceOf(address)(uint256)" $YOUR_ADDRESS \
  --rpc-url https://horizen.calderachain.xyz/http
```

### The same flow in Viem

```typescript
import { createWalletClient, createPublicClient, http, parseEther, pad } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { base } from 'viem/chains'
import { Options } from '@layerzerolabs/lz-v2-utilities'
import { oftAbi } from './abi/oft' // IOFT quoteSend + send fragments from @layerzerolabs/oft-evm

const ADAPTER = '0x57da2D504bf8b83Ef304759d9f2648522D7a9280'
const DST_EID = 30399

const account = privateKeyToAccount(process.env.PK as `0x${string}`)
const publicClient = createPublicClient({ chain: base, transport: http() })
const walletClient = createWalletClient({ account, chain: base, transport: http() })

// If quoteSend reverts with empty options, the pathway has no enforced options.
// Build explicit executor options instead of guessing at gas on the destination:
const extraOptions = Options.newOptions()
  .addExecutorLzReceiveOption(200_000, 0)
  .toHex() as `0x${string}`

const sendParam = {
  dstEid: DST_EID,
  to: pad(account.address, { size: 32 }),
  amountLD: parseEther('1'),
  minAmountLD: parseEther('1'),
  extraOptions,
  composeMsg: '0x' as const,
  oftCmd: '0x' as const,
}

const [nativeFee, lzTokenFee] = await publicClient.readContract({
  address: ADAPTER,
  abi: oftAbi,
  functionName: 'quoteSend',
  args: [sendParam, false],
}) as [bigint, bigint]

const hash = await walletClient.writeContract({
  address: ADAPTER,
  abi: oftAbi,
  functionName: 'send',
  args: [sendParam, { nativeFee, lzTokenFee }, account.address],
  value: nativeFee,
})

console.log(`sent: https://layerzeroscan.com/tx/${hash}`)
```

:::tip
`dstEid` is a LayerZero endpoint ID, not an EVM chain ID. The two numbering schemes are unrelated. Passing a chain ID here is the single most common OFT integration bug, and the failure mode is a revert at quote time if you are lucky, or a misrouted message if you are not.
:::

## Route 2: Bridge ETH over the Native Bridge

<!-- TODO-IMG (bridge-native-flow.png): deposit path Base → bridge contract → ETH on Horizen; withdrawal path with 7-day challenge period called out. Add to /public/tutorials/ then replace this comment with: ![Native bridge flow](/tutorials/bridge-native-flow.png) -->

ETH moves through Horizen's native OP Stack bridge. Deposits are a single transaction on Base. Withdrawals follow the standard OP Stack two-step: initiate on Horizen, wait out the challenge period, finalize on Base.

If you want the UI path, [hub.horizen.io](https://hub.horizen.io) handles both deposits and the prove/finalize withdrawal flow.

### Deposit, Base to Horizen

```bash
export L1_STANDARD_BRIDGE=0xf4a6cc4171fda694439f856d912777aa6ab05369

cast send $L1_STANDARD_BRIDGE \
  "bridgeETH(uint32,bytes)" 200000 0x \
  --value 0.01ether \
  --rpc-url $RPC_BASE --private-key $PK
```

The first argument is the minimum gas limit for the deposit transaction on Horizen. 200k is comfortable headroom for a plain ETH transfer.

ETH lands after Base finality (typically a few minutes). Verify:

```bash
cast balance $YOUR_ADDRESS --rpc-url https://horizen.calderachain.xyz/http
```

### Withdrawal, Horizen to Base

Withdrawals are subject to a 7-day challenge period before they can be finalized on Base. The bridge hub at [hub.horizen.io](https://hub.horizen.io/) handles the prove and finalize steps for you, and for most workflows that is the right tool. Budget for the challenge period in anything user-facing you build on top of this: it is a property of the rollup's security model, not a UI limitation.

:::note Challenge period
7 days is the standard OP Stack default. Caldera can configure this differently per deployment. Verify the current value with the Horizen team or check the `FINALIZATION_PERIOD_SECONDS` setting on the L2OutputOracle contract before publishing a hard deadline to users.
:::

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `quoteSend` reverts | Empty `extraOptions` on a pathway without enforced options | Build explicit options with `addExecutorLzReceiveOption(200000, 0)` |
| `send` reverts on allowance | Adapter not approved, Base to Horizen direction only | Approve the adapter for the ERC-20 first |
| Stuck at Inflight on LayerZero Scan | DVN verification pending | Wait it out; past 10 minutes on testnet, check the pathway config on LayerZero Scan |
| Reverts or misroutes with a valid-looking `dstEid` | EVM chain ID used instead of the LayerZero EID | Use the EID table above; the schemes are unrelated |
| ETH transfer attempted through Stargate | ETH is not a Stargate asset on Horizen | Use the native bridge |

## Further reading

- [How Bridging Works](/horizen-chain/bridging/how-bridging-works): the reference page covering the UI path, fees, and slippage
- [LayerZero OFT standard](https://docs.layerzero.network/v2/developers/evm/oft/native-transfer)
- [LayerZero deployments: Horizen](https://docs.layerzero.network/v2/deployments/chains/horizen)
- [Native bridge hub](https://hub.horizen.io)
- [Horizen block explorer](https://explorer.horizen.io)