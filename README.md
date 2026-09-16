# Horizen Documentation

Source for [docs.horizen.io](https://docs.horizen.io) — developer documentation for Horizen, an EVM-identical L3 on Base using the OP Stack.

## Local Development

```bash
npm install
npm run start
```

> Search does not work in dev mode — run `npm run build && npm run serve` to test search locally.

## Environment Variables

There are two sets of variables depending on where they are consumed.

**Build-time** (Docusaurus, read via `process.env` at `npm run build`): Docusaurus does not load `.env` files natively, so set these as shell environment variables before building:

```sh
# Algolia search — optional; search falls back to local index without these
export ALGOLIA_APP_ID=your_app_id
export ALGOLIA_API_KEY=your_api_key
export ALGOLIA_INDEX_NAME=your_index_name

# Turnstile — build-time only (embedded in the page bundle)
# For local dev the value below is Cloudflare's always-pass test site key; no dashboard needed.
export TURNSTILE_SITE_KEY=1x00000000000000000000AA
```

Or inline for a one-off build:

```sh
TURNSTILE_SITE_KEY=your_key npm run build
```

In CI/CD (e.g. Cloudflare Pages), set these in the project's **Settings → Environment Variables** under the **Build** environment.

**Runtime** (Cloudflare Pages Functions, never bundled into the client): stored in `.dev.vars` locally and in the Pages project's **Settings → Environment Variables** for deployed environments.

| Variable | Type | Description |
|---|---|---|
| `BEEHIIV_API_KEY` | Secret | beehiiv API key |
| `PUBLICATION_ID` | Secret | beehiiv publication ID |
| `TURNSTILE_SECRET_KEY` | Secret | Cloudflare Turnstile secret for server-side verification |

> **Production setup:** all three runtime variables must be set in the Pages project's **Production** environment (and **Preview**, if you want `/api/subscribe` to work on preview deployments). Without them every subscription attempt returns an error.

### Testing Cloudflare Pages Functions locally

The newsletter endpoint (`/api/subscribe`) runs as a Cloudflare Pages Function. Docusaurus's dev server does not execute these functions — use Wrangler instead.

1. Copy the example vars file:

```bash
cp .dev.vars.example .dev.vars
```

`.dev.vars.example` ships with Cloudflare's always-pass test keys pre-filled for `TURNSTILE_SECRET_KEY`, so the form works locally without a real Cloudflare account. Fill in real `BEEHIIV_API_KEY` and `PUBLICATION_ID` values if you want actual subscriptions to go through, or leave them blank to test the flow up to the beehiiv call.

`.dev.vars` is gitignored and never committed.

2. Build the site and start Wrangler's local Pages dev server:

```bash
npm run build
npx wrangler pages dev ./build
```

The site and all API endpoints are then available at `http://localhost:8788`.

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
