# ZKInterface ZKP Verification

**ZKInterface** is a precompile inside the Horizen chain that allows zero-knowledge proof verification using different proof types.

The method could be invoked in the EVM invoking the following method:

```
function verifyProof(ProofType proofType, bytes calldata vk, bytes calldata proof, bytes calldata pubs) pure external returns (bool, uint8);
```

Where *proofType* assumes one of the following values:
- GROTH16
- ULTRAPLONK
- RISC0
- FFLONK

Since in Solidity the enum values are also numeric 8-bit (*uint8*) values, the method also follows the following interface:
```
function verifyProof(uint8 proofType, bytes calldata vk, bytes calldata proof, bytes calldata pubs) pure external returns (bool, uint8);
```

In this case, the *proofType* assumes one of the following values:
- 0 (for Groth16 proof type)
- 1 (for Ultraplonk proof type)
- 2 (for Risc0 proof type)
- 3 for (for Fflonk proof type)

## Return type

The method returns a tuple `(bool, uint8)`, composed by the following values:
- Boolean value: *true* if the verification was successful, *false* otherwise.
- Numeric value: result code or error code according to the following table:

| **Code** | **Result**                                             |
|----------|--------------------------------------------------------|
| 0        | Verification successful                                |
| 1        | Inputs are correct data, but the proof is not verified |
| 2        | `pubs` (public signals) arguments is invalid           |
| 3        | `vk` (verification key) argument is invalid            |
| 4        | `proof` argument is invalid                            |


## Encoding parameters

All the parameters should be provided as a *bytes* object, that represent the encoding of the corresponding object in Rust according to the SCALE enconding. For more information, check [official SCALE codec documentation](https://docs.polkadot.com/polkadot-protocol/basics/data-encoding/#scale-codec-libraries) and [parity_scale_codec Rust pallet documentation](https://docs.rs/parity-scale-codec/latest/parity_scale_codec/s)

An exception is provided for the Groth16 proof type, since it's the only one (between the supported ones) which *publicInput* value has the `Vec<Vec<u8>>` type (array of an array). In this case, the encoding is the following:

- Inner arrays are encoded according to the `sp_core::Decode` standard

- Outer array is obtained chaining the inner arrays' encoded values.

You can find some examples of valid encoded inputs for each algorithm [inside the `test` subfolder](https://github.com/HorizenOfficial/horizen/tree/dev/precompiles/zkinterface/test) in the `precompile` source code folder.

## Proof verifications

The precompiles executes the proof verification in a synchronous way with a *pure* (stateless read-only) method on the Solidity interface. This verification is executed in the following way:

- The input arguments are decoded from the *bytes* format to the Rust object
- The decoded inputs are passed to the `zkverify` verifier for the given proof type, invoking the corresponding method imported as a Rust library
- According to the result of the `zkverify` code invocation, the corresponding Result Code is returned
- The Result Code is then converted into the correct Solidity output (see **Return type** section of this document)

For more information about the verification code, consult the zkVerify sources:
| **Proof type** | **Docs** | **Github**
|----------|---------------------|----------------------------------|
| Groth16  | [Link](https://docs.zkverify.io/tutorials/submit-proofs/groth16_proof_submission/) | [Link](https://github.com/zkVerify/zkVerify/tree/main/verifiers/groth16) |
| Ultraplonk | [Link](https://docs.zkverify.io/overview/verification_pallets/ultraplonk/) | [Link](https://github.com/zkVerify/zkVerify/blob/main/verifiers/ultraplonk) |
| Risc0| [Link](https://docs.zkverify.io/overview/verification_pallets/risc0/) | [Link](https://github.com/zkVerify/zkVerify/tree/main/verifiers/risc0) |
| Fflonk | [Link](https://docs.zkverify.io/overview/verification_pallets/fflonk/) | [Link](https://github.com/zkVerify/zkVerify/tree/main/verifiers/fflonk) |

## Source Code
[The `precompile` source code folder](https://github.com/HorizenOfficial/horizen/tree/dev/precompiles/zkinterface) contains the following files:

- `lib.rs`: access point for the precompile, it receives the arguments and pass to the `handlers.rs`  verification method, that convert the response into the Solidity's interface requested one.
- `handlers.rs`: contains the implementation for all the verification proof types
- `utils.rs`: contains the utility as the `ResultCode` enum and the error conversion methods.
- `tests.rs`: contains the positive and negative unit tests
- `test` folder: contains some examples of hex-encoded inputs for the different proof types, used for unit tests
- `ZKInterface.sol`: Solidity interface for the verification precompile.