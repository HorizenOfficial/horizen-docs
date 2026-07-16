---
title: "Your First Confidential App"
description: "Step-by-step: deploy the VELA private transfer example app using Docker, deposit ETH into an encrypted TEE account, and verify your private balance. Requires local environment setup first."
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This guide walks you through deploying the VELA example application — 
a private transfer app — and running your first confidential transaction. 
By the end you will have deposited ETH into an encrypted account inside 
the TEE and verified your private balance.

> **Prerequisites:** Complete [Local Environment Setup](./local-environment-setup.md) 
> and have `docker compose up` running before proceeding.

## What You're Deploying

The example application (`vela-nova`) is a private account-based ledger 
running entirely inside the TEE. Balances, transfers, and transaction 
history are all encrypted — external observers see only attested state 
roots on-chain, not the underlying data.

It supports four operations: `deposit`, `privatetransfer`, `withdraw`, 
and `deanonymize` (for authorized auditors).


## Step 1: Download the Artifacts

Go to the [`vela-nova` v0.1.0 release page](https://github.com/HorizenOfficial/vela-nova/releases/tag/v0.1.0) 
and download two files:

- `payment_app.wasm` — the compiled WASM module you'll deploy into the TEE
- `novaw-linux` — the CLI wallet for interacting with the app

Place both files in a `wallet/` folder.

Make `novaw-linux` executable:

```bash
chmod +x novaw-linux
```

> **Mac users:** `novaw-linux` is a Linux x86-64 binary and cannot run directly on Mac 
> (neither Intel nor Apple Silicon). All wallet commands must be run inside a Docker 
> container — see the Mac tabs in each step below. Running the binary directly will give 
> `exec format error`.


## Step 2: Configure the Wallet

Copy the wallet config template:

```bash
cp wallet.conf.template wallet.conf
```

Open `wallet.conf` and set the following values to connect to your local environment.

The URLs differ depending on your OS:

<Tabs>
<TabItem value="mac" label="Mac">

When `novaw-linux` runs inside Docker, `localhost` resolves to the container itself — 
not your Mac. Use `host.docker.internal` to reach services on your host machine:

```ini
rpcUrl=http://host.docker.internal:8545
ProcessorAddress=0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
TeeAuthenticatorAddress=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
AuthorityServiceURL=http://host.docker.internal:8081
SubgraphURL=http://host.docker.internal:8000/subgraphs/name/hcce
```

</TabItem>
<TabItem value="linux" label="Linux">

```ini
rpcUrl=http://localhost:8545
ProcessorAddress=0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
TeeAuthenticatorAddress=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
AuthorityServiceURL=http://localhost:8081
SubgraphURL=http://localhost:8000/subgraphs/name/hcce
```

</TabItem>
</Tabs>

These are the deterministic contract addresses deployed by the 
local `deployer` service. They will be the same on every fresh environment.


## Step 3: Set Your Keys

You need two keys: a secp256k1 key for signing on-chain transactions, 
and a P-521 key for private communication with the TEE.

### secp256k1 key

Use one of the Anvil default account private keys. These accounts are pre-funded 
with 1000 ETH on the local chain.

> **Important for `deployapp`:** The account must have `DEPLOYER_ROLE` on `ProcessorEndpoint`. 
> In the local dev environment, only **Anvil Account #0** has this role pre-granted. 
> Use Account #0's key when running `deployapp` — any other key will fail with a role error. 
> You can use other Anvil accounts for `registeruser`, `deposit`, and other operations.

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
<TabItem value="mac" label="Mac">

```bash
cd <your-wallet-folder>

docker run --rm --platform linux/amd64 \
  -v $(pwd):/wallet -w /wallet \
  ubuntu:22.04 /wallet/novaw-linux generatekeys
```

</TabItem>
<TabItem value="linux" label="Linux">

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

The P-521 key is used for ECDH-encrypted communication between your 
client and the TEE. The TEE uses your registered public key to encrypt 
all events it sends back to you — only your private key can decrypt them.



## Step 4: Deploy the WASM Application

<Tabs>
<TabItem value="mac" label="Mac">

```bash
cd <your-wallet-folder>

docker run --rm --platform linux/amd64 \
  -v $(pwd):/wallet -w /wallet \
  ubuntu:22.04 /wallet/novaw-linux deployapp \
  --wasm /wallet/payment_app.wasm --max-value-fee "100 wei"
```

</TabItem>
<TabItem value="linux" label="Linux">

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

Copy the printed `ApplicationID` into `wallet.conf`:
```ini
ApplicationID=<number>
```

What happens under the hood:

1. The wallet uploads `payment_app.wasm` to the Authority Service (`POST /deploy/upload`)
2. An on-chain deploy request is submitted to `ProcessorEndpoint`
3. The Processor Manager picks up the request and forwards the WASM artifact to the Executor inside the TEE
4. The TEE verifies the WASM fingerprint (SHA-256) against the on-chain descriptor before loading the module
5. The application is assigned an `ApplicationID`



## Step 5: Register Your User

Before you can interact with the app, register your P-521 public key 
on-chain. This tells the TEE which key to use when encrypting events 
back to you:

<Tabs>
<TabItem value="mac" label="Mac">

```bash
docker run --rm --platform linux/amd64 -v $(pwd):/wallet -w /wallet \
  ubuntu:22.04 /wallet/novaw-linux registeruser
```

</TabItem>
<TabItem value="linux" label="Linux">

```bash
./novaw-linux registeruser
```

</TabItem>
</Tabs>



## Step 6: Run Your First Private Transaction

Check your public balance (starts at zero):

<Tabs>
<TabItem value="mac" label="Mac">

```bash
docker run --rm --platform linux/amd64 -v $(pwd):/wallet -w /wallet \
  ubuntu:22.04 /wallet/novaw-linux getpublicbalance
```

</TabItem>
<TabItem value="linux" label="Linux">

```bash
./novaw-linux getpublicbalance
```

</TabItem>
</Tabs>

Deposit 1 ETH into your private account inside the TEE:

<Tabs>
<TabItem value="mac" label="Mac">

```bash
docker run --rm --platform linux/amd64 -v $(pwd):/wallet -w /wallet \
  ubuntu:22.04 /wallet/novaw-linux deposit -a "1 ETH"
```

</TabItem>
<TabItem value="linux" label="Linux">

```bash
./novaw-linux deposit -a "1 ETH"
```

</TabItem>
</Tabs>

The deposit is submitted as an on-chain transaction. The Processor 
Manager detects it, routes it to the Executor, which credits your 
encrypted account inside the TEE and emits an encrypted event 
confirming the operation. Only your P-521 key can decrypt it.

Verify your private balance:

<Tabs>
<TabItem value="mac" label="Mac">

```bash
docker run --rm --platform linux/amd64 -v $(pwd):/wallet -w /wallet \
  ubuntu:22.04 /wallet/novaw-linux getprivatebalance
```

</TabItem>
<TabItem value="linux" label="Linux">

```bash
./novaw-linux getprivatebalance
```

</TabItem>
</Tabs>

If you see `1 ETH` reflected in your private balance, 
the full stack is working correctly.



## Troubleshooting

**`wasm module is empty (code 11)`**

The `manager` and `authorityservice` containers are not sharing a named volume, so the 
manager cannot find the uploaded WASM artifact. Apply the shared volume fix described in 
[Local Environment Setup](./local-environment-setup.md), then force-recreate both containers:

```bash
cd <repo-root>/dockerfiles
docker compose up -d --force-recreate manager authorityservice
```

Then retry the `deployapp` command.


**`Insufficient funds for gas * price + value`**

The secp256k1 key in `wallet.conf` is not an Anvil pre-funded account. Switch to 
Anvil Account #0's key (see Step 3). Freshly generated keys have 0 ETH and every 
on-chain transaction will fail.



## Full Command Reference

```bash
# Mac — replace <cmd> with any command below
docker run --rm --platform linux/amd64 -v $(pwd):/wallet -w /wallet \
  ubuntu:22.04 /wallet/novaw-linux <cmd>

# Linux — run directly
./novaw-linux <cmd>

# Commands
generatekeys          # Generate a P-521 key pair
deployapp             # Deploy a WASM application
registeruser          # Register your P-521 key on-chain
getpublicbalance      # Query on-chain balance
deposit -a "1 ETH"    # Deposit into private account
getprivatebalance     # Query encrypted TEE balance
privatetransfer       # Transfer between private accounts
help                  # Full command reference
```
