# Debug Endpoint

Debug RPC endpoint provides access to some of non-standard debug RPC methods belonging to Geth's debug endpoint.<br/>
These methods are available only on a tracing node, i.e. a node running with specific tracing features enabled.<br/>

## Supported Debug JSON-RPC Methods

**debug_traceTransaction**  
The `debug_traceTransaction` will replay the transaction in the exact same manner as it was executed on the network and it will return its execution traces.
The type of tracing depends on the type of the tracer selected (see [Tracer Types](#tracer-types)).  
Refer to [Geth's documentation](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug#debugtracetransaction) for more information.

- **Input Parameters**  
    - `transaction_hash` - the hash of the transaction to be traced  
    - `tracer_config` - (optional) a JSON object for configuring the tracer that contains the following field:  
        - `tracer` - sets the type of tracer  
  
    If no `tracer_config` is provided, the **opcode** logger will be the default tracer (see [Tracer Types](#tracer-types)). 

- **Returns**  
The `result` object depends on the tracer type. See [Tracer Types](#tracer-types) below.

**debug_traceBlockByNumber**  
Returns the tracing result by executing all transactions in the block specified by number. It supports only **callTracer** tracer type.
Refer to [Geth's documentation](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug#debugtracetransaction) for more information.

- **Input Parameters**  
    - `block_number` - the block number of the block to be traced  
    - `tracer_config` - a JSON object for configuring the tracer that contains the following field:  
           -  `tracer` - sets the type of tracer, it must be equal to **callTracer**.  

- **Returns**  
The `result` object is an array containing the call frame information as described in [Tracer Types - callTracer](#calltracer).

**debug_traceBlockByHash**  
Returns the tracing result by executing all transactions in the block specified by number. It supports only **callTracer** tracer type.
Refer to [Geth's documentation](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug#debugtracetransaction) for more information.

- **Input Parameters**  
    - `block_hash` - the block hash of the block to be traced
    - `tracer_config` - a JSON object for configuring the tracer that contains the following field:  
            - `tracer` - sets the type of tracer, it must be equal to **callTracer**.

- **Returns**  
The `result` object is an array containing the call frame information as described in [Tracer Types - callTracer](#calltracer).


### Tracer Types  

#### opcode:  
The opcode logger is a tracer which executes a transaction and emits the opcode and execution context at every step.
It can be configured with the following additional fields:

    - `opcode_config` - (optional) a JSON object for configuring the opcode logger:
        - `disableStorage` — (optional, default: false) setting this to true disables storage capture
        - `disableMemory` — (optional, default: false) setting this to true disables memory capture
        - `disableStack` — (optional, default: false) setting this to true disables stack capture

**Note**: in Geth, `disableMemory` setting is the opposite and is named `enableMemory`.

The `result` object contains the following fields:  

- `gas` - the total gas consumed by the transaction execution in the EVM, plus the intrinsic gas. It doesn't include the gas used for the PoV.  
- `returnValue` - the output produced by the execution of the transaction
- `structLogs` - an array of objects containing a detailed log of each opcode executed during the transaction (see below).
- `failed` - a boolean indicating whether the transaction execution failed or succeeded

The following information is emitted at each step and included in structLogs:  
- `pc`	program counter
- `op`	opcode to be executed
- `gas`	remaining gas
- `gasCost`	gas consumed for executing op. It reports only the fixed gas.
- `memory`	EVM memory. Disabled via `disableMemory`
- `stack`	EVM stack. Disabled via `disableStack`
- `storage`	storage slots of current contract read from and written to. Disabled via `disableStorage`
- `depth`	current call depth

#### callTracer:  
The callTracer tracks all the call frames executed during a transaction, including depth 0. The result will be a nested list of call frames, resembling how EVM works. 
The following information is emitted at each frame:

- `type`		CALL or CREATE
- `from`		address
- `to`			address
- `value`		amount of value transfer
- `gas`			gas provided for call
- `gasUsed`		gas used during call
- `input`		call data
- `output`		return data
- `error`		error, if any
- `revertReason`	string	Solidity revert reason, if any
- `calls`		list of sub-calls


