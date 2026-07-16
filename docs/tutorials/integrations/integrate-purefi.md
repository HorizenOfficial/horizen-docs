---
title: Add Compliance Gating with PureFi
description: "Step-by-step tutorial for integrating PureFi AML verification into your Horizen smart contracts."
---

# Add Compliance Gating with PureFi

PureFi lets you gate any smart contract action (such as a mint, swap, deposit, or access grant) behind an off-chain AML check. The check happens outside the EVM; the result is delivered as a signed payload your contract verifies on-chain before allowing execution to continue.

<div style={{display: 'flex', justifyContent: 'center', margin: '24px 0'}}>
  <img src="/tutorials/purefi-banner.png" alt="PureFi" style={{maxWidth: '100%', width: '720px', borderRadius: '8px'}} />
</div>

This tutorial walks through the full integration end-to-end:

1. Install the PureFi Solidity SDK
2. Write and deploy a verified receiver contract
3. Register your contract in the PureFi Dashboard
4. Build the off-chain verification flow (TypeScript)
5. Submit a compliance-gated transaction

## How PureFi Works on Horizen

PureFi is not an on-chain oracle. It is a hybrid compliance system: the AML check runs off-chain through PureFi's issuer, and the result is a cryptographically signed bytes payload called `_purefidata`. Your contract passes that payload to the PureFi Verifier, which validates the signature and payload on-chain. If it passes, execution continues. If it fails, the entire transaction reverts.

The full flow per user action:

1. Your frontend constructs a verification request (package type, rule ID, user wallet, your contract address)
2. The user's wallet signs the request via EIP-712
3. Your backend submits the signed request to the PureFi issuer
4. The issuer runs the AML check — on pass, it returns a `_purefidata` bytes string
5. Your frontend passes `_purefidata` to your contract method
6. Your contract calls `verifier.validatePayload(_purefidata)` — reverts on fail, continues on success

The Verifier on Horizen is a proxy contract. Your contract makes a synchronous call to it; the proxy `delegatecall`s to the implementation, validates signature and payload, and returns. There are no logs to watch — the result of the call is the answer.

## Prerequisites

- A PureFi subscription — set one up at [dashboard.purefi.io](https://dashboard.purefi.io/)
- Your rule ID and package type from your PureFi subscription config
- A deployed contract on Horizen Mainnet (or ready to deploy — Step 2 covers this)
- Foundry or Hardhat for contract deployment
- Node.js ≥ 18 and `ethers` v6 for the off-chain script

## Step 1: Install the PureFi Solidity SDK

**Foundry:**

```bash
forge install purefiprotocol/sdk-solidity-v5
```

Add to `remappings.txt`:

```
@purefi-sdk-solidity-v5/=lib/sdk-solidity-v5/src/
```

**npm (Hardhat or mixed projects):**

```bash
npm i @purefi/sdk-solidity-v5
```

## Step 2: Write and Deploy Your Verified Receiver Contract

The PureFi SDK provides a base abstract contract that handles chain ID validation and Verifier calls. Extend it for Horizen Mainnet with the hardcoded proxy address.

Create `src/YourCompliantContract.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IPureFiVerifier} from "@purefi-sdk-solidity-v5/interfaces/IPureFiVerifier.sol";
import {PureFiDataLibrary} from "@purefi-sdk-solidity-v5/libraries/PureFiDataLibrary.sol";

/// @dev Base contract — handles Verifier calls and chain ID enforcement
abstract contract PureFiSdkVerifiedReceiverBase {
    using PureFiDataLibrary for bytes;

    IPureFiVerifier public immutable verifier;
    uint256 public immutable expectedChainId;

    error WrongChain(uint256 expected, uint256 actual);

    constructor(address verifier_, uint256 expectedChainId_) {
        verifier = IPureFiVerifier(verifier_);
        expectedChainId = expectedChainId_;
    }

    function _validateAndUnpack(bytes calldata purefiData)
        internal
        returns (address from, address to, uint256 rule, uint8 packageType)
    {
        if (block.chainid != expectedChainId) revert WrongChain(expectedChainId, block.chainid);

        verifier.validatePayload(purefiData);

        bytes calldata package_ = purefiData.getPackage();
        from        = package_.getFrom();
        to          = package_.getTo();
        rule        = package_.getRule();
        packageType = package_.getPackageType();
    }
}

/// @dev Horizen Mainnet concrete implementation — hardcodes verifier proxy and chain ID
abstract contract PureFiReceiverHorizenMainnet is PureFiSdkVerifiedReceiverBase {
    address public constant PUREFI_VERIFIER  = 0x681Edd4906e2a0a277E2A6c394A4595f83e1329c;
    uint256 public constant HORIZEN_CHAIN_ID = 26514;

    constructor() PureFiSdkVerifiedReceiverBase(PUREFI_VERIFIER, HORIZEN_CHAIN_ID) {}
}

/// @dev Example: a mint function gated behind PureFi compliance verification
contract CompliantMinter is PureFiReceiverHorizenMainnet {
    mapping(address => bool) public hasMinted;

    event Minted(address indexed user, bytes32 indexed purefiHash);

    // purefiData is the bytes string returned by the PureFi issuer after a passed AML check
    function mint(bytes calldata purefiData) external {
        (address from, , , ) = _validateAndUnpack(purefiData);

        // After _validateAndUnpack returns, the compliance check has passed on-chain.
        // The Verifier would have reverted the tx if it hadn't.
        require(from == msg.sender, "PureFi: payload not for caller");
        require(!hasMinted[msg.sender], "Already minted");

        hasMinted[msg.sender] = true;
        emit Minted(msg.sender, keccak256(purefiData));

        // ... your actual mint logic here
    }
}
```

Deploy with Foundry:

```bash
forge create src/YourCompliantContract.sol:CompliantMinter \
  --rpc-url https://horizen.calderachain.xyz/http \
  --private-key $PRIVATE_KEY
```

Note the deployed contract address — you will need it in the next step.

## Step 3: Register Your Contract in the PureFi Dashboard

Before any `_purefidata` will be issued for your contract, you must bind it to your subscription.

1. Open [dashboard.purefi.io](https://dashboard.purefi.io/) and connect your subscription wallet
2. Navigate to your subscription and find the **Contracts** or **Bind Contract** section
3. Enter your deployed contract address and confirm

:::warning
If your contract is not registered in the Dashboard, the issuer will not return `_purefidata` for transactions targeting it. Registering is required before any end-to-end test will work.
:::

## Step 4: Build the Off-chain Verification Flow

In production, your frontend or backend handles the request construction, signing, and issuer call. Here is a complete Node.js/TypeScript script that runs all three steps and prints the `_purefidata` ready to submit on-chain.

:::note
The issuer endpoint URL and exact EIP-712 typed data structure are version-specific. Retrieve the correct values for your SDK version from [wiki.purefi.io/docs/category/solidity-sdk](https://wiki.purefi.io/docs/category/solidity-sdk) and replace the `PUREFI_ISSUER_URL` and `TYPES` constants below.
:::

Create `scripts/get-purefidata.ts`:

```typescript
import { ethers } from "ethers";

// ── Config ────────────────────────────────────────────────────────────────────
const RPC_URL          = "https://horizen.calderachain.xyz/http";
const PRIVATE_KEY      = process.env.PRIVATE_KEY!;       // signing wallet (the "from" address)
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS!;  // your deployed CompliantMinter

// Get the correct issuer URL for your environment from:
// https://wiki.purefi.io/docs/category/solidity-sdk
const PUREFI_ISSUER_URL = process.env.PUREFI_ISSUER_URL!;

// These come from your PureFi subscription configuration
const PACKAGE_TYPE = Number(process.env.PACKAGE_TYPE!);
const RULE_ID      = Number(process.env.RULE_ID!);

// ── EIP-712 domain & types ────────────────────────────────────────────────────
// Verify these match your SDK version in the PureFi wiki
const DOMAIN = {
  name:    "PureFi",
  version: "1",
  chainId: 26514,
};

const TYPES = {
  PureFiPayload: [
    { name: "packageType", type: "uint8"   },
    { name: "ruleId",      type: "uint256" },
    { name: "from",        type: "address" },
    { name: "to",          type: "address" },
  ],
};

// ── Step 1: Construct the payload ─────────────────────────────────────────────
function buildPayload(from: string, to: string) {
  return {
    packageType: PACKAGE_TYPE,
    ruleId:      RULE_ID,
    from,
    to,
  };
}

// ── Step 2: Sign with EIP-712 ─────────────────────────────────────────────────
async function signPayload(
  signer:  ethers.Wallet,
  payload: ReturnType<typeof buildPayload>
): Promise<string> {
  return signer.signTypedData(DOMAIN, TYPES, payload);
}

// ── Step 3: Fetch _purefidata from the issuer ─────────────────────────────────
async function fetchPurefiData(
  payload:   ReturnType<typeof buildPayload>,
  signature: string
): Promise<string> {
  const res = await fetch(PUREFI_ISSUER_URL, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ payload, signature }),
  });

  if (!res.ok) {
    // A non-2xx response means the AML check failed or the request was malformed.
    // Do NOT attempt to submit a transaction — there is no valid _purefidata.
    const body = await res.text();
    throw new Error(`PureFi issuer rejected (${res.status}): ${body}`);
  }

  const json = await res.json();
  return json.purefidata as string;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const signer   = new ethers.Wallet(PRIVATE_KEY, provider);
  const from     = await signer.getAddress();

  console.log(`From:     ${from}`);
  console.log(`Contract: ${CONTRACT_ADDRESS}`);

  // 1. Build
  const payload = buildPayload(from, CONTRACT_ADDRESS);
  console.log("Payload:", payload);

  // 2. Sign
  const signature = await signPayload(signer, payload);
  console.log("Signature:", signature.slice(0, 20) + "...");

  // 3. Get _purefidata
  console.log("Calling PureFi issuer...");
  const purefiData = await fetchPurefiData(payload, signature);
  console.log("_purefidata:", purefiData.slice(0, 30) + "...");
  console.log("\nFull _purefidata (pass this to your contract):");
  console.log(purefiData);
}

main().catch(console.error);
```

Run it:

```bash
PRIVATE_KEY=0x... \
CONTRACT_ADDRESS=0x... \
PUREFI_ISSUER_URL=https://issuer.purefi.io/... \
PACKAGE_TYPE=1 \
RULE_ID=777 \
npx ts-node scripts/get-purefidata.ts
```

On success, the script prints the `_purefidata` bytes string. Copy it — you submit it in the next step.

## Step 5: Submit the Compliance-Gated Transaction

With `_purefidata` in hand, call your contract. This single transaction performs both the on-chain compliance verification and your business logic atomically.

```typescript
import { ethers } from "ethers";

const RPC_URL          = "https://horizen.calderachain.xyz/http";
const PRIVATE_KEY      = process.env.PRIVATE_KEY!;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS!;
const PUREFI_DATA      = process.env.PUREFI_DATA!; // output from Step 4

const ABI = [
  "function mint(bytes calldata purefiData) external",
];

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const signer   = new ethers.Wallet(PRIVATE_KEY, provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

  console.log("Submitting compliance-gated transaction...");
  const tx = await contract.mint(PUREFI_DATA);
  console.log("Transaction submitted:", tx.hash);

  const receipt = await tx.wait();
  if (receipt.status === 1) {
    console.log("Success — compliance check passed and mint executed.");
  } else {
    console.log("Transaction reverted — validatePayload failed.");
  }
}

main().catch(console.error);
```

Run it:

```bash
PRIVATE_KEY=0x... \
CONTRACT_ADDRESS=0x... \
PUREFI_DATA=0x... \
npx ts-node scripts/submit.ts
```

If `validatePayload` succeeds, your `Minted` event will be emitted and the transaction will confirm. If it reverts, check the failure indicators below.

## Testing with Playground

Before wiring up your own frontend and backend, use PureFi's Playground to manually run through the full flow. Playground is accessible from your [PureFi Dashboard](https://dashboard.purefi.io/) and lets you generate `_purefidata` without writing any code — useful for verifying your contract is correctly registered and that the Verifier accepts calls to it.

### Payload Constructor

Fill in your package type, rule ID, the test wallet address as `from`, and your deployed contract as `to`. This generates the payload submitted to the issuer.

:::note Screenshot placeholder
*[Screenshot: Payload Constructor UI — package type, rule ID, from/to fields]*
:::

### Signature Process

Connect your browser wallet. The chain ID must be Horizen Mainnet (26514). Confirm the signing prompt to produce the EIP-712 signature.

:::note Screenshot placeholder
*[Screenshot: Signature step — wallet prompt and resulting EIP-712 data]*
:::

### Verification Process

Select the issuer environment and submit. A successful AML check returns the `_purefidata` bytes string in the response panel.

:::note Screenshot placeholder
*[Screenshot: Verification step — issuer response with _purefidata]*
:::

### Transaction Builder

Paste your contract address, ABI, select the `mint` method (or whichever method accepts `purefiData`), and paste `_purefidata` as the argument. Submit the transaction and confirm in your wallet.

:::note Screenshot placeholder
*[Screenshot: Transaction Builder — contract, method selector, and _purefidata field]*
:::

## Debugging: Success and Failure Indicators

**The integration is working when:**
- The issuer returns a non-empty `_purefidata` string
- `validatePayload(...)` does not revert
- Your business logic executes and emits its event
- Subscription usage in the Dashboard decrements after each verified call

**Something is wrong when:**
- The issuer returns an error or empty response — the AML check failed; do not submit a transaction
- `validatePayload(...)` reverts — check that you are using the Horizen Mainnet verifier proxy (`0x681Edd4906e2a0a277E2A6c394A4595f83e1329c`) and that `block.chainid` is `26514`
- Transaction reverts with `WrongChain` — your contract is being called on the wrong network
- The issuer refuses to issue `_purefidata` — confirm your contract address is registered in the Dashboard

## Horizen Mainnet Reference

| | Value |
|---|---|
| RPC | `https://horizen.calderachain.xyz/http` |
| Chain ID | `26514` |
| PureFi Verifier proxy | `0x681Edd4906e2a0a277E2A6c394A4595f83e1329c` |
| PureFi Verifier implementation | `0x61C468B554B6F0b0842242F7Df079bb392EE0555` |
| SDK version | `@purefi/sdk-solidity-v5@5.2.0` |

## Reference Links

| Resource | URL |
|---|---|
| PureFi Dashboard | `https://dashboard.purefi.io/` |
| Solidity SDK Docs | `https://wiki.purefi.io/docs/category/solidity-sdk` |
| SDK GitHub | `https://github.com/purefiprotocol/sdk-solidity-v5` |
| Compliance Gating reference page | `/horizen-chain/integrations/purefi` |
