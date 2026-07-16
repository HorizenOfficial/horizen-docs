---
title: Deploy an NFT Collection
description: "Deploy an ERC-721 NFT collection on Horizen with metadata and minting."
---

# Deploy an NFT Collection on Horizen

Horizen runs a near-vanilla EVM, so every Ethereum opcode works, and the standard ERC-721 and ERC-1155 patterns apply without modification. The OP Stack adds a small L1 data fee on top of your execution gas, but nothing about the NFT contract or minting flow changes from what you'd write for Base or Ethereum mainnet.

This tutorial builds a production-grade ERC-721 collection with:
- On-chain supply cap
- Public mint with per-wallet limit
- Owner-controlled reveal (pre-reveal URI → post-reveal base URI)
- `ERC721Enumerable` for on-chain enumeration (useful for indexers and dApps that need to list tokens by owner)
- Withdrawal of mint proceeds


## Architecture Note

NFT metadata URIs typically point to IPFS or a centralized server. Horizen has no built-in IPFS node or pinning service — you're responsible for hosting your metadata. [Pinata](https://pinata.cloud), [NFT.Storage](https://nft.storage), and [Thirdweb Storage](https://thirdweb.com/dashboard/infrastructure/storage) all work fine; there's nothing Horizen-specific here.

What Horizen does give you: fast block times (OP Stack block every 2 seconds), low fees, and full EVM compatibility.


## Step 1: The Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title HorizenNFT
/// @notice A capped ERC-721 collection with public mint, per-wallet limits,
///         and a reveal mechanic.
contract HorizenNFT is ERC721Enumerable, ERC721URIStorage, Ownable, ReentrancyGuard {
    uint256 public immutable MAX_SUPPLY;
    uint256 public mintPrice;
    uint256 public maxPerWallet;

    bool public revealed;
    string private _baseTokenURI;    // post-reveal base URI
    string private _preRevealURI;    // single URI for all tokens pre-reveal

    uint256 private _nextTokenId;

    // Per-wallet mint count tracking
    mapping(address => uint256) public mintedByWallet;

    event Revealed(string baseURI);
    event Minted(address indexed to, uint256 indexed tokenId);
    event Withdrawn(address indexed to, uint256 amount);

    error SoldOut();
    error WalletLimitExceeded();
    error InsufficientPayment();
    error MintAmountZero();
    error WithdrawFailed();

    constructor(
        string memory name,
        string memory symbol,
        uint256 maxSupply,
        uint256 _mintPrice,
        uint256 _maxPerWallet,
        string memory preRevealURI,
        address initialOwner
    ) ERC721(name, symbol) Ownable(initialOwner) {
        MAX_SUPPLY = maxSupply;
        mintPrice = _mintPrice;
        maxPerWallet = _maxPerWallet;
        _preRevealURI = preRevealURI;
    }

    // ── Public Mint ─────────────────────────────────────────────────────────

    /// @notice Mint `amount` tokens. Reverts if supply, wallet cap, or payment
    ///         conditions are not met.
    function mint(uint256 amount) external payable nonReentrant {
        if (amount == 0) revert MintAmountZero();
        if (_nextTokenId + amount > MAX_SUPPLY) revert SoldOut();
        if (mintedByWallet[msg.sender] + amount > maxPerWallet) revert WalletLimitExceeded();
        if (msg.value < mintPrice * amount) revert InsufficientPayment();

        mintedByWallet[msg.sender] += amount;

        for (uint256 i = 0; i < amount; i++) {
            uint256 tokenId = _nextTokenId++;
            _safeMint(msg.sender, tokenId);
            emit Minted(msg.sender, tokenId);
        }
    }

    // ── Owner Functions ──────────────────────────────────────────────────────

    /// @notice Mint directly to an address (reserve/team allocation). No fee.
    function ownerMint(address to, uint256 amount) external onlyOwner {
        if (_nextTokenId + amount > MAX_SUPPLY) revert SoldOut();
        for (uint256 i = 0; i < amount; i++) {
            uint256 tokenId = _nextTokenId++;
            _safeMint(to, tokenId);
        }
    }

    /// @notice Reveal the collection. Sets the base URI for all tokens.
    ///         Irreversible — once revealed, the pre-reveal URI is abandoned.
    function reveal(string calldata baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
        revealed = true;
        emit Revealed(baseURI);
    }

    /// @notice Update the mint price.
    function setMintPrice(uint256 newPrice) external onlyOwner {
        mintPrice = newPrice;
    }

    /// @notice Update the per-wallet mint limit.
    function setMaxPerWallet(uint256 newMax) external onlyOwner {
        maxPerWallet = newMax;
    }

    /// @notice Withdraw all ETH from the contract to `to`.
    function withdraw(address payable to) external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        (bool ok, ) = to.call{value: balance}("");
        if (!ok) revert WithdrawFailed();
        emit Withdrawn(to, balance);
    }

    // ── Metadata ─────────────────────────────────────────────────────────────

    /// @dev Pre-reveal: all tokens return the same placeholder URI.
    ///      Post-reveal: baseURI + tokenId + ".json"
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        _requireOwned(tokenId);
        if (!revealed) {
            return _preRevealURI;
        }
        return string(abi.encodePacked(_baseTokenURI, _toString(tokenId), ".json"));
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    // ── Required Overrides ────────────────────────────────────────────────────
    // ERC721Enumerable and ERC721URIStorage both override _update and supportsInterface.
    // Solidity requires explicit resolution.

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    function totalMinted() external view returns (uint256) {
        return _nextTokenId;
    }

    function remainingSupply() external view returns (uint256) {
        return MAX_SUPPLY - _nextTokenId;
    }

    /// @dev Converts uint256 to string. Avoids importing full Strings library.
    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) { digits++; temp /= 10; }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}
```


## Step 2: Foundry Setup

```bash
forge init horizen-nft && cd horizen-nft
forge install OpenZeppelin/openzeppelin-contracts --no-commit
echo '@openzeppelin/contracts/=lib/openzeppelin-contracts/contracts/' >> remappings.txt
```

Save the contract to `src/HorizenNFT.sol`.

### Tests

```solidity
// test/HorizenNFT.t.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {Test} from "forge-std/Test.sol";
import {HorizenNFT} from "../src/HorizenNFT.sol";

contract HorizenNFTTest is Test {
    HorizenNFT nft;
    address owner  = address(0xBEEF);
    address alice  = address(0xA11CE);
    address bob    = address(0xB0B);

    uint256 constant SUPPLY  = 1000;
    uint256 constant PRICE   = 0.01 ether;
    uint256 constant PER_WALLET = 5;

    function setUp() public {
        nft = new HorizenNFT(
            "Horizen NFT",
            "HNFT",
            SUPPLY,
            PRICE,
            PER_WALLET,
            "ipfs://QmPreReveal",
            owner
        );
        vm.deal(alice, 10 ether);
        vm.deal(bob,   10 ether);
    }

    function test_MintSuccess() public {
        vm.prank(alice);
        nft.mint{value: PRICE * 2}(2);
        assertEq(nft.balanceOf(alice), 2);
        assertEq(nft.totalMinted(), 2);
    }

    function test_PreRevealURI() public {
        vm.prank(alice);
        nft.mint{value: PRICE}(1);
        assertEq(nft.tokenURI(0), "ipfs://QmPreReveal");
    }

    function test_RevealUpdatesURI() public {
        vm.prank(alice);
        nft.mint{value: PRICE}(1);
        vm.prank(owner);
        nft.reveal("ipfs://QmBaseURI/");
        assertEq(nft.tokenURI(0), "ipfs://QmBaseURI/0.json");
    }

    function test_WalletLimitReverts() public {
        vm.prank(alice);
        nft.mint{value: PRICE * 5}(5);   // Max
        vm.prank(alice);
        vm.expectRevert(HorizenNFT.WalletLimitExceeded.selector);
        nft.mint{value: PRICE}(1);       // Over limit
    }

    function test_InsufficientPaymentReverts() public {
        vm.prank(alice);
        vm.expectRevert(HorizenNFT.InsufficientPayment.selector);
        nft.mint{value: PRICE - 1}(1);
    }

    function test_Withdraw() public {
        vm.prank(alice);
        nft.mint{value: PRICE * 3}(3);
        uint256 ownerBefore = owner.balance;
        vm.prank(owner);
        nft.withdraw(payable(owner));
        assertEq(owner.balance, ownerBefore + PRICE * 3);
        assertEq(address(nft).balance, 0);
    }

    function test_SoldOutReverts() public {
        // Fill remaining supply via ownerMint (faster than individual mints)
        vm.prank(owner);
        nft.ownerMint(bob, SUPPLY);
        vm.prank(alice);
        vm.expectRevert(HorizenNFT.SoldOut.selector);
        nft.mint{value: PRICE}(1);
    }
}
```

```bash
forge test -vvv
```

### Deploy script

```solidity
// script/Deploy.s.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {Script, console} from "forge-std/Script.sol";
import {HorizenNFT} from "../src/HorizenNFT.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address owner       = vm.envAddress("OWNER_ADDRESS");

        vm.startBroadcast(deployerKey);

        HorizenNFT nft = new HorizenNFT(
            "Horizen NFT",              // name
            "HNFT",                     // symbol
            10_000,                     // max supply
            0.01 ether,                 // mint price
            5,                          // max per wallet
            "ipfs://QmYourPreRevealCID",// pre-reveal URI — upload to IPFS first
            owner
        );

        console.log("HorizenNFT deployed at:", address(nft));

        vm.stopBroadcast();
    }
}
```

```bash
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url https://horizen-testnet.rpc.caldera.xyz/http \
  --broadcast
```


## Step 3: Prepare Your Metadata

Your metadata must be ready before you deploy or reveal. The standard structure for each token (`0.json`, `1.json`, etc.):

```json
{
  "name": "Horizen NFT #0",
  "description": "A token in the Horizen NFT collection.",
  "image": "ipfs://QmYourImageCID/0.png",
  "attributes": [
    { "trait_type": "Background", "value": "Blue" },
    { "trait_type": "Rarity", "value": "Common" }
  ]
}
```

Upload the entire `metadata/` folder to IPFS. The returned folder CID becomes your base URI:

```
ipfs://QmFolderCID/
```

After upload, call `reveal`:

```bash
cast send $NFT_ADDRESS "reveal(string)" "ipfs://QmFolderCID/" \
  --rpc-url https://horizen-testnet.rpc.caldera.xyz/http \
  --private-key $PRIVATE_KEY
```

Verify:

```bash
cast call $NFT_ADDRESS "tokenURI(uint256)(string)" 0 \
  --rpc-url https://horizen-testnet.rpc.caldera.xyz/http
# Expected: ipfs://QmFolderCID/0.json
```


## Hardhat Path (Condensed)

```bash
mkdir horizen-nft && cd horizen-nft
npm init -y
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npm install @openzeppelin/contracts
npx hardhat init
```

`hardhat.config.ts`:

```typescript
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.22",
  networks: {
    horizen: {
      type: "http",
      url: "https://horizen-testnet.rpc.caldera.xyz/http",
      accounts: [process.env.PRIVATE_KEY ?? ""],
      chainId: 2651420,
    },
  },
};
export default config;
```

Ignition module:

```typescript
// ignition/modules/HorizenNFT.ts
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseEther } from "ethers";

export default buildModule("HorizenNFT", (m) => {
  const nft = m.contract("HorizenNFT", [
    "Horizen NFT",
    "HNFT",
    10_000,
    parseEther("0.01"),
    5,
    "ipfs://QmYourPreRevealCID",
    m.getParameter("owner"),
  ]);
  return { nft };
});
```

```bash
npx hardhat compile
npx hardhat ignition deploy ignition/modules/HorizenNFT.ts \
  --network horizen \
  --parameters '{"owner": "0xYourOwnerAddress"}'
```
