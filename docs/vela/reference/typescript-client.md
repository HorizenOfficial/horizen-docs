---
title: TypeScript Client
description: "Installation and usage for the @horizen/vela-common-ts TypeScript client. Includes the v0.2.0 package and class rename."
sidebar_position: 3
---

# TypeScript Client

The TypeScript client (`@horizen/vela-common-ts`) lets you build browser and frontend integrations on top of Vela without writing contract ABI calls directly.

## Installation

```bash
npm install @horizen/vela-common-ts ethers
```

## Usage

```typescript
import { VelaClient } from "@horizen/vela-common-ts";

const client = new VelaClient(
  signer,
  false, // useAlternativeSign: true to sign with eth_sign RPC instead of signMessage() (for wallets without EIP-191 personal_sign)
  teeAuthenticatorAddress,
  processorEndpointAddress
);
```

:::note
The same client works against the local stack and a real enclave; there is no TEE-mode flag.
:::

## v0.2.0 Migration Note

The package and main class were both renamed in v0.2.0:

| Before (v0.1.x) | After (v0.2.0) |
|---|---|
| `horizen-cce-common-ts` | `@horizen/vela-common-ts` |
| `HorizenCCEClient` | `VelaClient` |

Update your `package.json` and any imports accordingly. The API surface is otherwise compatible with v0.1.x.
