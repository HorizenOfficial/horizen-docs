# Horizen Documentation

Source for [docs.horizen.io](https://docs.horizen.io) — developer documentation for Horizen, an EVM-identical L3 on Base using the OP Stack.

## Local Development

```bash
npm install
npm run start
```

> Search does not work in dev mode — run `npm run build && npm run serve` to test search locally.

## Environment Variables

Create a `.env` file at the root with:

```
ALGOLIA_APP_ID=
ALGOLIA_API_KEY=
ALGOLIA_INDEX_NAME=
```

## Contributing

1. Fork the repo and create a branch
2. Make your changes under `docs/`
3. Run `npm run start` to preview
4. Open a pull request against `main`

## Build

```bash
npm run build
```

Outputs to `/build`. The LLM discovery files (`/llms.txt`, `/llms-full.txt`, `/llms-ctx.txt`) are generated automatically at build time.
