---
title: Prerequisites & Installation
description: "System requirements and tooling needed for VELA development."
sidebar_position: 1
---

# Prerequisites & Installation

Before working with VELA locally, make sure your development environment meets the following requirements.

## Requirements

- **Docker** — VELA's local environment runs entirely in Docker containers. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) or Docker Engine for your platform.
- **Git** — Required to clone the starter kit and related repositories.
- **Node.js** (optional) — Needed if you plan to use the `vela-common-ts` TypeScript library for client-side interactions.
- **Go** (optional) — Needed if you plan to use the `vela-common-go` library.

## Installation

Clone the starter kit repository:

```bash
git clone https://github.com/HorizenOfficial/vela-starterkit.git
cd vela-starterkit
```

Follow the instructions in the repository README to bring up the local environment. The starter kit handles container orchestration, environment configuration, and sample application deployment.

