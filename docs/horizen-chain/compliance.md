---
title: Compliance
description: "Compliance patterns on Horizen: contract-level rules, confidential enforcement via VELA, and third-party AML/KYC screening with PureFi."
sidebar_position: 7
---

On Horizen, compliance logic is code instead of a platform guardrail. Since Horizen is EVM-identical, you can implement compliance at whatever layer matches your requirement: encode rules directly in Solidity, enforce policies over private data using confidential computation, or integrate a purpose-built AML/KYC protocol. 

## Contract-Level Rules

The most direct approach is to encode rules into your contract. Access control lists, role-based modifiers, jurisdiction flags, and per-address limits are all standard Solidity patterns that require no external dependencies or off-chain components.

```solidity
mapping(address => bool) public allowlisted;

modifier onlyAllowlisted() {
    require(allowlisted[msg.sender], "address not allowlisted");
    _;
}
```

This pattern is appropriate when your compliance logic is fully deterministic, you own and control the rule set, and access decisions do not depend on external data (such as AML risk scores maintained by a third party).

## Confidential Enforcement

Some compliance requirements involve private data: verifying a user meets a financial threshold without disclosing the amount, enforcing policy on encrypted inputs, or producing auditable proof that a rule executed correctly without exposing the underlying state. For these cases, the compliance logic can run inside a TEE using VELA.

The compliance logic is your code. VELA provides a hardware-isolated execution environment and a cryptographic attestation proving the rules ran correctly on the specified input. No operator, cloud provider, or external party can access the data during execution. Authorized verifiers like auditors and regulators can confirm compliance through the attestation without seeing the underlying state.

→ [What is VELA?](/vela/introduction)

## Third-Party AML/KYC Screening

For AML screening against external risk databases, Horizen supports integration with PureFi. The model is off-chain screening with synchronous on-chain enforcement: PureFi's issuer runs the AML check off-chain and returns a signed payload; your contract calls the PureFi Verifier with that payload as a blocking call. It reverts if the check failed, so your business logic executes only if the address passed screening.

This pattern is for use cases where compliance requires validation against maintained AML datasets that your contract cannot hold or update on its own.

→ [PureFi Integration](/horizen-chain/integrations/purefi)

