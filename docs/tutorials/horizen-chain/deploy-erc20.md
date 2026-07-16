---
title: Deploy an ERC-20 Token on Horizen
description: "Full tutorial for deploying a production-grade ERC-20 token on Horizen with Foundry and Hardhat."
---

Horizen runs a near-vanilla EVM where all standard Ethereum opcodes are supported, with minor OP Stack extensions for L2 data fees.

This tutorial deploys a production-grade ERC-20 using [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/), with both **Foundry** and **Hardhat** paths. It also covers contract verification on the Horizen Explorer.



## Architecture Context

Before touching code, understand the fee model. Horizen is an OP Stack L3 settling on Base (L2), which settles on Ethereum (L1). Your transaction fee has two components:

- **L2 execution fee** — gas consumed by your transaction × the Horizen base fee
- **L1 data fee** — the cost of publishing your transaction's calldata as a batch to Base

The L1 data fee is automatically appended by the OP Stack. It's typically small but non-zero, and it fluctuates with Base's gas price. Your ETH on Horizen is native bridged ETH — the same asset as on Base.



## Network Reference

For full network details (RPC endpoints, chain IDs, explorer, faucet), see:

- [Mainnet Configuration](/horizen-chain/network/mainnet)
- [Testnet Configuration](/horizen-chain/network/testnet)



## Step 1: Write the Contract

Write a minimal but complete ERC-20 contract with an owner-controlled mint function and a fixed max supply:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Capped} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title HorizenToken
/// @notice A capped, burnable ERC-20 with owner-controlled minting.
contract HorizenToken is ERC20Capped, ERC20Burnable, Ownable {
    constructor(
        string memory name,
        string memory symbol,
        uint256 cap,
        address initialOwner
    )
        ERC20(name, symbol)
        ERC20Capped(cap)
        Ownable(initialOwner)
    {}

    /// @notice Mint tokens to an address. Caller must be the owner.
    /// @param to Recipient address
    /// @param amount Amount in the token's smallest unit (wei equivalent)
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /// @dev Required override — ERC20Capped hooks into _update, not _mint.
    function _update(
        address from,
        address to,
        uint256 value
    ) internal override(ERC20, ERC20Capped) {
        super._update(from, to, value);
    }
}
```

A few design decisions worth noting:

- `ERC20Capped` enforces a maximum supply at the `_update` level — it's impossible to exceed the cap regardless of how many times `mint` is called.
- The `_update` override is mandatory in OZ v5.x. The v4.x pattern using `_beforeTokenTransfer` no longer works.
- Deploying with `initialOwner` as a constructor argument (rather than hardcoding `msg.sender`) makes the contract significantly easier to test and safer to deploy via a script where `msg.sender` is a hot deployment key you may not want as permanent owner.



## Path A — Foundry

### Install Foundry

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### Initialize the project

```bash
forge init horizen-token && cd horizen-token
```

### Install OpenZeppelin Contracts

```bash
forge install OpenZeppelin/openzeppelin-contracts --no-commit
```

Add the remapping so Forge can resolve the import path:

```bash
echo '@openzeppelin/contracts/=lib/openzeppelin-contracts/contracts/' >> remappings.txt
```

### Place the contract

Save the Solidity above to `src/HorizenToken.sol`.

### Test it locally first

```solidity
// test/HorizenToken.t.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {Test} from "forge-std/Test.sol";
import {HorizenToken} from "../src/HorizenToken.sol";

contract HorizenTokenTest is Test {
    HorizenToken token;
    address owner = address(0xBEEF);
    address user  = address(0xCAFE);

    uint256 constant CAP = 1_000_000 ether; // 1M tokens

    function setUp() public {
        token = new HorizenToken("Horizen Token", "HZN", CAP, owner);
    }

    function test_MintUnderCap() public {
        vm.prank(owner);
        token.mint(user, 500_000 ether);
        assertEq(token.balanceOf(user), 500_000 ether);
        assertEq(token.totalSupply(), 500_000 ether);
    }

    function test_MintOverCapReverts() public {
        vm.prank(owner);
        vm.expectRevert();
        token.mint(user, CAP + 1);
    }

    function test_OnlyOwnerCanMint() public {
        vm.prank(user);
        vm.expectRevert();
        token.mint(user, 1 ether);
    }

    function test_Burn() public {
        vm.prank(owner);
        token.mint(user, 100 ether);
        vm.prank(user);
        token.burn(50 ether);
        assertEq(token.balanceOf(user), 50 ether);
    }
}
```

```bash
forge test -vvv
```

Don't deploy until tests pass. Gas costs ETH on testnet; time costs more.

### Build

```bash
forge build
```

### Deploy to Horizen Testnet

```bash
forge create src/HorizenToken.sol:HorizenToken \
  --rpc-url https://horizen-testnet.rpc.caldera.xyz/http \
  --private-key $PRIVATE_KEY \
  --constructor-args "Horizen Token" "HZN" 1000000000000000000000000 $OWNER_ADDRESS
```

Constructor args breakdown:
- `"Horizen Token"` — token name
- `"HZN"` — symbol
- `1000000000000000000000000` — cap: 1,000,000 tokens × 1e18 (must be passed as a raw `uint256` wei value, not a decimal)
- `$OWNER_ADDRESS` — your intended owner; if you want `msg.sender`, pass `$(cast wallet address --private-key $PRIVATE_KEY)`

Forge prints the deployed address on success:

```
Deployer: 0x...
Deployed to: 0x...
Transaction hash: 0x...
```

### Deploy with a script (recommended for production)

Rather than passing private keys on the command line, use a Forge script with a hardware wallet or environment variable:

```solidity
// script/Deploy.s.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {Script, console} from "forge-std/Script.sol";
import {HorizenToken} from "../src/HorizenToken.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address owner       = vm.envAddress("OWNER_ADDRESS");

        vm.startBroadcast(deployerKey);

        HorizenToken token = new HorizenToken(
            "Horizen Token",
            "HZN",
            1_000_000 ether,
            owner
        );

        console.log("HorizenToken deployed at:", address(token));
        console.log("Owner:", token.owner());
        console.log("Cap:", token.cap());

        vm.stopBroadcast();
    }
}
```

```bash
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url https://horizen-testnet.rpc.caldera.xyz/http \
  --broadcast \
  --verify
```

The `--verify` flag submits source code to the explorer automatically after deployment. If verification fails (network timing), rerun with `--resume`.

<br/>

## Path B — Hardhat

### Initialize the project

```bash
mkdir horizen-token && cd horizen-token
npm init -y
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npm install @openzeppelin/contracts
npx hardhat init
```

Select "TypeScript project" when prompted.

### Configure Hardhat (`hardhat.config.ts`)

```typescript
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.22",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    horizen: {
      type: "http",
      url: "https://horizen-testnet.rpc.caldera.xyz/http",
      accounts: [process.env.PRIVATE_KEY ?? ""],
      chainId: 2651420,
    },
    "horizen-mainnet": {
      type: "http",
      url: "https://horizen.calderachain.xyz/http",
      accounts: [process.env.PRIVATE_KEY ?? ""],
      chainId: 26514,
    },
  },
};

export default config;
```

### Write the Ignition deploy module

```typescript
// ignition/modules/HorizenToken.ts
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseEther } from "ethers";

export default buildModule("HorizenToken", (m) => {
  const owner = m.getParameter("owner", "0xYourOwnerAddress");

  const token = m.contract("HorizenToken", [
    "Horizen Token",
    "HZN",
    parseEther("1000000"),  // 1M token cap
    owner,
  ]);

  return { token };
});
```

### Deploy

```bash
npx hardhat compile
npx hardhat ignition deploy ignition/modules/HorizenToken.ts \
  --network horizen \
  --parameters '{"owner": "0xYourOwnerAddress"}'
```

Ignition records deployment state in `ignition/deployments/` — rerunning the command is idempotent. The deployed address is in `ignition/deployments/chain-2651420/deployed_addresses.json`.

---

## Verifying on the Explorer

Verification links your contract's source code to the on-chain bytecode, enabling the explorer to decode transactions and display the ABI.

**With Foundry:**

```bash
forge verify-contract <DEPLOYED_ADDRESS> \
  src/HorizenToken.sol:HorizenToken \
  --rpc-url https://horizen-testnet.rpc.caldera.xyz/http \
  --constructor-args $(cast abi-encode "constructor(string,string,uint256,address)" "Horizen Token" "HZN" 1000000000000000000000000 $OWNER_ADDRESS)
```

**With Hardhat:**

```bash
npx hardhat verify --network horizen <DEPLOYED_ADDRESS> \
  "Horizen Token" "HZN" "1000000000000000000000000" $OWNER_ADDRESS
```

> Horizen's explorer is powered by Blockscout. If `hardhat-verify` doesn't auto-detect the verifier, add `etherscan: { apiKey: { horizen: "any-non-empty-string" }, customChains: [{ ... }] }` to your Hardhat config pointing at the explorer's verification API.

---

## Interacting with the Deployed Contract

Use `cast` (Foundry) for quick on-chain reads and writes:

```bash
# Read name
cast call $TOKEN "name()(string)" \
  --rpc-url https://horizen-testnet.rpc.caldera.xyz/http

# Read total supply
cast call $TOKEN "totalSupply()(uint256)" \
  --rpc-url https://horizen-testnet.rpc.caldera.xyz/http

# Mint 100 tokens to an address (as owner)
cast send $TOKEN "mint(address,uint256)" \
  $RECIPIENT 100000000000000000000 \
  --rpc-url https://horizen-testnet.rpc.caldera.xyz/http \
  --private-key $PRIVATE_KEY
```


