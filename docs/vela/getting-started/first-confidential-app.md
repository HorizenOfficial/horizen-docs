---
title: "Your First Confidential App"
description: "Step-by-step: deploy the Vela private transfer example app using Docker, deposit ETH into an encrypted TEE account, and verify your private balance. Requires local environment setup first."
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This guide walks you through deploying the Vela example application - a private transfer app and running your first confidential transaction. By the end you will have deposited ETH into an encrypted account inside the TEE and verified your private balance.

> **Prerequisites:** Complete [Local Environment Setup](./local-environment-setup.md) and have `docker compose up` running before proceeding.

## What You're Deploying

The example application (`vela-nova`) is a private account-based ledger running entirely inside the TEE. Balances, transfers, and transaction history are all encrypted. External observers see only attested state roots on-chain, not the underlying data.

It supports five operations:

| Operation | What it does |
|---|---|
| `deposit` | Move ETH or ERC-20 tokens from your public address into your encrypted TEE account |
| `privatetransfer` | Transfer funds between private accounts inside the TEE |
| `withdraw` | Move funds from your TEE account into the bridge contract for claiming |
| `claimpendingpayments` | Claim bridged funds and deliver them to your public address. This is required to complete a withdrawal — `withdraw` alone does not return funds to your wallet. |
| `deanonymize` | Authorized auditors only. Submits a request that calls `process_request(requestType=2)` in the WASM app, which returns an encrypted compliance report. The report is encrypted to the auditor's registered P-521 key and retrieved via the Authority Service API. |


## Step 1: Download the Artifacts

Go to the [`vela-nova` v0.2.0 release page](https://github.com/HorizenOfficial/vela-nova/releases/tag/v0.2.0) and download three files:

- `payment_app.wasm` — the compiled WASM module you'll deploy into the TEE
- `novaw-linux` — the CLI wallet for interacting with the app
- `wallet.conf.template` — the wallet configuration template

Place all three files in a `wallet/` folder.

Alternatively, if you prefer to clone the repository, `wallet.conf.template` is included in the repo root:

```bash
git clone https://github.com/HorizenOfficial/vela-nova.git
cp vela-nova/wallet.conf.template wallet/wallet.conf.template
```

Then download `payment_app.wasm` and `novaw-linux` from the release page and place them in the same `wallet/` folder.

Make `novaw-linux` executable:

```bash
chmod +x novaw-linux
```

> **Mac users:** `novaw-linux` is a Linux x86-64 binary and cannot run directly on Mac (neither Intel nor Apple Silicon). All wallet commands must be run inside a Docker container — see the Mac tabs in each step below. Running the binary directly will give `exec format error`.


## Step 2: Configure the Wallet

Copy the wallet config template:

```bash
cp wallet.conf.template wallet.conf
```

Open `wallet.conf` and set the following values to connect to your local environment. The URLs differ depending on your OS:

<Tabs>
<TabItem value="docker" label="Docker (Mac / Windows)">

When `novaw-linux` runs inside Docker, `localhost` resolves to the container itself, not your Mac. Use `host.docker.internal` to reach services on your host machine:

```ini
rpcUrl=http://host.docker.internal:8545
ProcessorAddress=0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
TeeAuthenticatorAddress=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
AuthorityServiceURL=http://host.docker.internal:8081
SubgraphURL=http://host.docker.internal:8000/subgraphs/name/hcce
```

</TabItem>
<TabItem value="linux" label="Linux (native)">

```ini
rpcUrl=http://localhost:8545
ProcessorAddress=0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
TeeAuthenticatorAddress=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
AuthorityServiceURL=http://localhost:8081
SubgraphURL=http://localhost:8000/subgraphs/name/hcce
```

</TabItem>
</Tabs>

These are the deterministic contract addresses deployed by the local `deployer` service. They will be the same on every fresh environment.


## Step 3: Set Your Keys

You need two keys: a secp256k1 key for signing on-chain transactions, and a P-521 key for private communication with the TEE.

### secp256k1 key

Use one of the Anvil default account private keys. These accounts are pre-funded with 1000 ETH on the local chain.

> **Important for `deployapp`:** The account must have `DEPLOYER_ROLE` on `ProcessorEndpoint`. In the local dev environment, only **Anvil Account #0** has this role pre-granted. Use Account #0's key when running `deployapp` — any other key will fail with a role error. You can use other Anvil accounts for `registeruser`, `deposit`, and other operations.

Anvil Account #0 (required for `deployapp`):
```
ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

Add it to `wallet.conf`:
```ini
keySecp256k1=ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

### P-521 key

Generate a fresh key pair:

<Tabs>
<TabItem value="docker" label="Docker (Mac / Windows)">

```bash
cd <your-wallet-folder>

docker run --rm --platform linux/amd64 \
  -v $(pwd):/wallet -w /wallet \
  ubuntu:22.04 /wallet/novaw-linux generatekeys
```

</TabItem>
<TabItem value="linux" label="Linux (native)">

```bash
cd <your-wallet-folder>
./novaw-linux generatekeys
```

</TabItem>
</Tabs>

Copy the printed `P521` value into `wallet.conf`:

```ini
keyP521=<generated-p521-key>
```

The P-521 key is used for ECDH-encrypted communication between your client and the TEE. The TEE uses your registered public key to encrypt all events it sends back to you — only your private key can decrypt them.


## Step 4: Deploy the WASM Application

<Tabs>
<TabItem value="docker" label="Docker (Mac / Windows)">

```bash
cd <your-wallet-folder>

docker run --rm --platform linux/amd64 \
  -v $(pwd):/wallet -w /wallet \
  ubuntu:22.04 /wallet/novaw-linux deployapp \
  --wasm /wallet/payment_app.wasm --max-value-fee "100 wei"
```

</TabItem>
<TabItem value="linux" label="Linux (native)">

```bash
cd <your-wallet-folder>
./novaw-linux deployapp \
  --wasm ./payment_app.wasm --max-value-fee "100 wei"
```

</TabItem>
</Tabs>

On success you will see:
```
Deploy app completed successfully. ApplicationID: <number>
```

The `ApplicationID` is written automatically into `wallet.conf` — you do not need to copy it manually.

What happens under the hood:

1. The wallet uploads `payment_app.wasm` to the Authority Service (`POST /deploy/upload`)
2. An on-chain deploy request is submitted to `ProcessorEndpoint`
3. The Processor Manager picks up the request and forwards the WASM artifact to the Executor inside the TEE
4. The TEE verifies the WASM fingerprint (SHA-256) against the on-chain descriptor before loading the module
5. The application is assigned an `ApplicationID` and saved automatically to `wallet.conf`


## Step 5: Register Your User

Before you can interact with the app, register your P-521 public key on-chain. This tells the TEE which key to use when encrypting events back to you:

<Tabs>
<TabItem value="docker" label="Docker (Mac / Windows)">

```bash
docker run --rm --platform linux/amd64 -v $(pwd):/wallet -w /wallet \
  ubuntu:22.04 /wallet/novaw-linux registeruser
```

</TabItem>
<TabItem value="linux" label="Linux (native)">

```bash
./novaw-linux registeruser
```

</TabItem>
</Tabs>


## Step 6: Run Your First Private Transaction

Check your public balance (starts at zero):

<Tabs>
<TabItem value="docker" label="Docker (Mac / Windows)">

```bash
docker run --rm --platform linux/amd64 -v $(pwd):/wallet -w /wallet \
  ubuntu:22.04 /wallet/novaw-linux getpublicbalance
```

</TabItem>
<TabItem value="linux" label="Linux (native)">

```bash
./novaw-linux getpublicbalance
```

</TabItem>
</Tabs>

Deposit 1 ETH into your private account inside the TEE:

<Tabs>
<TabItem value="docker" label="Docker (Mac / Windows)">

```bash
docker run --rm --platform linux/amd64 -v $(pwd):/wallet -w /wallet \
  ubuntu:22.04 /wallet/novaw-linux deposit -a "1 ETH"
```

</TabItem>
<TabItem value="linux" label="Linux (native)">

```bash
./novaw-linux deposit -a "1 ETH"
```

</TabItem>
</Tabs>

The deposit is submitted as an on-chain transaction. The Processor Manager detects it, routes it to the Executor, which credits your encrypted account inside the TEE and emits an encrypted event confirming the operation. Only your P-521 key can decrypt it.

Verify your private balance:

<Tabs>
<TabItem value="docker" label="Docker (Mac / Windows)">

```bash
docker run --rm --platform linux/amd64 -v $(pwd):/wallet -w /wallet \
  ubuntu:22.04 /wallet/novaw-linux getprivatebalance
```

</TabItem>
<TabItem value="linux" label="Linux (native)">

```bash
./novaw-linux getprivatebalance
```

</TabItem>
</Tabs>

If you see `1 ETH` reflected in your private balance, the full stack is working correctly.

:::tip Balance looks stale?
`getprivatebalance` reconstructs your balance by scanning backward through encrypted on-chain events. It checks the last 200 by default. If you have many transactions and the number looks off, add `PrivateBalanceScanDepth=500` to `wallet.conf` to scan further back.
:::


## Troubleshooting

**`wasm module is empty (code 11)`**

The `manager` and `authorityservice` containers are not sharing a named volume, so the manager cannot find the uploaded WASM artifact. Apply the shared volume fix described in [Local Environment Setup](./local-environment-setup.md), then force-recreate both containers:

```bash
cd <repo-root>/dockerfiles
docker compose up -d --force-recreate manager authorityservice
```

Then retry the `deployapp` command.


**`Insufficient funds for gas * price + value`**

The secp256k1 key in `wallet.conf` is not an Anvil pre-funded account. Switch to Anvil Account #0's key (see Step 3). Freshly generated keys have 0 ETH and every on-chain transaction will fail.


## ERC-20 Tokens

The payment app supports any ERC-20 token that was allowlisted when the app was deployed. ETH is always available. Adding ERC-20 support is a three-step setup.

> **Note:** The local Anvil environment does not include any pre-deployed ERC-20 tokens. To test ERC-20 support locally, deploy a mock token contract first and use its address below. The steps and token address shown here are illustrative for a real network deployment.

**1. Register the token in `wallet.conf`:**

```ini
token.USDC.address=<your-token-contract-address>
token.USDC.decimals=6
```

**2. Deploy with the `--allowed-tokens` flag:**

```bash
./novaw-linux deployapp \
  --wasm ./payment_app.wasm \
  --allowed-tokens USDC,DAI \
  --max-value-fee "100 wei"
```

**3. Approve, then deposit:**

Before depositing an ERC-20 token for the first time, approve the `ProcessorEndpoint` contract to spend your tokens. The CLI will print a reminder if you skip this.

```bash
# After approving on-chain, deposit as normal with --token
./novaw-linux deposit --amount 100 --token USDC
```

Private transfers and withdrawals work the same way as ETH, just pass `--token`:

```bash
./novaw-linux privatetransfer --to 0xRecipient --amount 50 --token USDC
./novaw-linux withdraw --to 0xRecipient --amount 50 --token USDC
./novaw-linux claimpendingpayments --token USDC
```

All `--token` flags accept either a symbol registered in `wallet.conf` or a raw ERC-20 contract address.


## Invoice IDs

Private transfers support an optional `--invoice-id` flag (max 100 characters):

```bash
./novaw-linux privatetransfer \
  --to 0xRecipient --amount "0.5 ETH" \
  --invoice-id "INV-2026-001"
```

When you include an invoice ID, the WASM app publishes a hash of it on-chain alongside the transfer. The hash is computed from the invoice ID, sender address, token, amount, and recipient. It is public and verifiable by anyone, but it reveals nothing about the transfer details themselves. Any third party can use it as a proof of payment without needing access to your private account data.


## Full Command Reference

```bash
# Mac — replace <cmd> with any command below
docker run --rm --platform linux/amd64 -v $(pwd):/wallet -w /wallet \
  ubuntu:22.04 /wallet/novaw-linux <cmd>

# Linux — run directly
./novaw-linux <cmd>
```

| Command | Description |
|---|---|
| `generatekeys` | Generate a P-521 key pair |
| `deployapp` | Deploy a WASM application into the TEE |
| `registeruser` | Register your P-521 public key on-chain |
| `getaddress` | Print your EVM address |
| `listpubkeys` | List registered public keys for an address |
| `getpublicbalance` | Query your on-chain (public) token balance |
| `deposit -a "1 ETH"` | Deposit ETH or ERC-20 tokens into your private TEE account |
| `getprivatebalance` | Query your encrypted TEE balance |
| `privatetransfer` | Transfer funds between private accounts inside the TEE |
| `withdraw` | Move funds from your TEE account into the bridge for claiming |
| `getpendingpayments` | Show funds awaiting claim in the bridge contract |
| `claimpendingpayments` | Claim pending bridged funds and deliver to your public address |
| `requestreport` | Submit a compliance report request (authorized auditors only) |
| `downloadreport` | Download an encrypted compliance report |
| `decryptreport` | Decrypt a downloaded compliance report |
| `help` | Full command reference |
