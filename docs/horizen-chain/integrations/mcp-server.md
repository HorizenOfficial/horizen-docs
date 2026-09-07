---
title: MCP Server
description: "Connect AI coding assistants and agents to Horizen via the Model Context Protocol (MCP)."
sidebar_position: 5
---

Connect your AI coding assistant to Horizen in one step. The Horizen MCP server gives Claude, Cursor, Windsurf, and other AI editors direct access to verified chain data, such as RPC URLs, contract addresses, bridge info, oracle feed IDs so your agent stops hallucinating and starts building.

No API key. No signup. Just `npx`.

## Quickstart

```bash
npx -y horizen-mcp
```

That's it. The server runs locally and exposes Horizen facts to your AI editor via the [Model Context Protocol](https://modelcontextprotocol.io/).

## Add to Your AI Editor

Add the following to your editor's MCP config file. The JSON block is the same for all editors — only the file path differs.

```json
{
  "mcpServers": {
    "horizen": {
      "command": "npx",
      "args": ["-y", "horizen-mcp"]
    }
  }
}
```

| Editor | Config file path |
|---|---|
| Claude Desktop (macOS) | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Claude Desktop (Windows) | `%APPDATA%\Claude\claude_desktop_config.json` |
| Claude Code | `claude mcp add horizen -- npx -y horizen-mcp` (or add to project `.mcp.json`) |
| Cursor | `~/.cursor/mcp.json` |
| Windsurf | `~/.codeium/windsurf/mcp_config.json` |
| Continue | `~/.continue/config.json` |
| Zed | `~/.config/zed/settings.json` (use key `context_servers` instead of `mcpServers`) |

After saving the config, restart your editor. You should see a **horizen** entry in the MCP panel or tool list.

> **Verify it's working:** Ask your AI assistant "What is Horizen's mainnet chain ID?" It should return `26514` with a source citation.

## What You Can Ask

Once connected, your AI assistant can answer questions like:

- *"What is Horizen's mainnet RPC URL?"*
- *"What is the contract address for the Horizen bridge?"*
- *"What Stork feed ID should I use for ETH/USD on Horizen?"*
- *"What contracts are deployed on Horizen testnet?"*
- *"How do I integrate Goldsky with Horizen?"*
- *"Search the Horizen docs for bridging ZEN."*

Every response includes a source attribution and verification date — the agent will never fabricate an address or URL.

## Available Tools

| Tool | What it does |
|---|---|
| `get_chain_info` | Chain ID, RPC/WebSocket endpoints, block explorer URL, and gas token |
| `get_contract_address` | Verified address for a named contract — returns explicit not-found if unknown |
| `list_contracts` | All known contracts and their deployment status across mainnet and testnet |
| `get_stork_feed_id` | Stork oracle feed ID for an asset pair, derived via keccak256 |
| `get_bridge_info` | Bridge URLs, supported assets, and known caveats |
| `get_integration_info` | Documentation paths for Stork, Goldsky, PureFi, and Den integrations |
| `search_docs` | Live search across [docs.horizen.io](https://docs.horizen.io) |

## Reference

| Resource | Link |
|---|---|
| npm package | [npmjs.com/package/horizen-mcp](https://www.npmjs.com/package/horizen-mcp) |
| Model Context Protocol | [modelcontextprotocol.io](https://modelcontextprotocol.io/) |
