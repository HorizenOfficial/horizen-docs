---
title: Prerequisites & Installation
description: "What you need to start building on Vela. Docker and Git get you running the Vela Nova example. TinyGo is required if you want to write your own WASM application."
sidebar_position: 1
---

# Prerequisites & Installation

What you need depends on what you want to build. Start here to find the right setup for your goals.

## What Do You Want to Do?

| Goal | Tools Required |
|---|---|
| Run the Vela Nova example with a pre-built app | Docker, Git |
| Write your own WASM application | Docker, Git, TinyGo, Go |
| Build the `novaw` wallet CLI from source | Docker, Git, Go |
| Use the TypeScript client in a browser or frontend | Docker, Git, Node.js |


## Tool Reference

### Docker (required for all)

Vela's local stack runs entirely in Docker. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) or Docker Engine with Compose v2 for your platform.

### Git (required for all)

Required to clone the starter kit and related repositories.

```bash
git clone https://github.com/HorizenOfficial/vela-starterkit.git
cd vela-starterkit
```

### TinyGo v0.39.0 (required for WASM development)

TinyGo is required to compile your application to WebAssembly. Standard `go build` will not work — the binary must be built with `tinygo build -target=wasi`.

```bash
# macOS
brew install tinygo

# Linux — download the .deb package from https://github.com/tinygo-org/tinygo/releases/tag/v0.39.0
```

You can skip this if you only want to run the pre-built `payment_app.wasm` from the Vela Nova guide.

### Go v1.21+ (required for building from source)

Go is needed to build the `novaw` wallet CLI from source and to run the full test suite. It is also a dependency of TinyGo.

If you only want to run the pre-built `novaw` binary (available as a release artifact), you can skip Go.

### Node.js v18+ (optional)

Only needed if you plan to use the `@horizen/vela-common-ts` TypeScript client for browser or frontend integrations.


## Starting the Local Stack

Once you have the tools installed, bring up the local environment:

```bash
cd vela-starterkit
docker compose up
```

The starter kit handles container orchestration, environment configuration, and sample application deployment. The stack is fully ready when `executor`, `manager`, and `authorityservice` are all healthy — typically 30 to 60 seconds after startup.
