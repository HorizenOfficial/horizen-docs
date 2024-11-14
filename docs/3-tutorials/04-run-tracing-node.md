# Running a Tracing Node
Horizen 2 provides some of the Ethereum Geth non-standard RPC debug methods.
To use the supported RPC methods, it is needed to run a tracing node, which is slightly different than running a normal node. 
The main difference is that a tracing node uses a specific runtime with the support needed to execute the RPC methods.

## Compiling a Tracing Runtime

For compiling a tracing runtime, you need to install Rust toolchain. Instructions can be found [here](https://www.rust-lang.org/tools/install).

To build the runtime from the source code, clone the Horizen 2 repository (that can be found [here](https://github.com/HorizenOfficial/horizen)) and run the following commands from the root of the project:

```bash
git checkout <latest tagged release>
cargo build -p horizen-runtime --release --features async-backing,evm-tracing
cp ./target/release/wbuild/horizen-runtime/horizen_runtime.wasm <_trace_runtime_dir_>
```
You will also need a normal node for running the tracing runtime:

```bash
cargo build --release 
```

## Running a Tracing Node

Run a tracing node with the following command:

```bash
./target/release/horizen-node --chain <horizen_chain_spec.json_> --ethapi=debug --wasm-runtime-overrides=<_trace_runtime_dir_>
```

