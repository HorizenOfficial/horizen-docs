import path from 'path';
import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const algoliaConfig = process.env.ALGOLIA_APP_ID && process.env.ALGOLIA_API_KEY && process.env.ALGOLIA_INDEX_NAME
  ? {
      appId: process.env.ALGOLIA_APP_ID,
      apiKey: process.env.ALGOLIA_API_KEY,
      indexName: process.env.ALGOLIA_INDEX_NAME,
      contextualSearch: true,
      searchPagePath: 'search' as const,
    }
  : undefined;

const config: Config = {
  title: "Horizen Documentation",
  tagline: "Build Private. Build Compliant. Build on Horizen.",
  favicon: "logos/png/Horizen2.0-logo_icon-on-yellow.png",

  customFields: {
    // Fallback is Cloudflare's always-pass test key; set TURNSTILE_SITE_KEY in Pages env for production.
    turnstileSiteKey: process.env.TURNSTILE_SITE_KEY ?? '1x00000000000000000000AA',
  },

  url: "https://docs.horizen.io",
  baseUrl: "/",

  staticDirectories: ['public'],

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  plugins: [
    path.resolve(__dirname, 'plugins/tailwind-plugin.js'),
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          {
            from: '/vela/getting-started/hello-world',
            to: '/vela/getting-started/first-confidential-app',
          },
          {
            from: '/vela/limitations/limitations',
            to: '/vela/roadmap',
          },
          // v2: Horizen Chain wind-down — point retired routes at Vela / Governance.
          {
            from: ['/horizen-chain', '/horizen-chain/overview/what-is-horizen'],
            to: '/vela/introduction',
          },
          {
            from: ['/tutorials', '/tutorials/horizen-chain/deploy-erc20'],
            to: '/vela/getting-started/first-confidential-app',
          },
          {
            from: '/horizen_hub',
            to: '/vela/introduction',
          },
          {
            from: '/transparency',
            to: '/governance/reference/transparency-report',
          },
        ],
      },
    ],
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        indexDocs: true,
        indexBlog: false,
        docsRouteBasePath: '/',
      },
    ],
    [
      'docusaurus-plugin-llms',
      {
        generateLLMsTxt: true,
        generateLLMsFullTxt: true,
        docsDir: [{ path: 'docs', routeBasePath: '/', label: 'Docs' }],
        title: 'Horizen Documentation',
        description: 'Developer documentation for Vela — a confidential blockchain coprocessor by Horizen Labs. Vela runs your application logic as WebAssembly (WASM, compiled from Go with TinyGo) inside a Trusted Execution Environment (AWS Nitro Enclave), where data is isolated from the host, the cloud provider, and the operator, and application state is encrypted at rest (AES-256). Smart contracts are both the entrypoint (submit an encrypted request, lock funds) and the exitpoint (a cryptographically attested result settles funds and can fire on-chain events). Every result is signed by the attested enclave and verified on-chain, so contracts and autonomous agents can verify, gate, and settle on the outcome without trusting any operator in between. Authorized auditors can request encrypted compliance reports from the TEE without exposing other users’ data; authorization is managed on-chain via the AuthorityRegistry contract. Vela is chain-agnostic and live (gated / early access) on Base mainnet and Base Sepolia; develop locally via Docker with a software-emulated TEE (no AWS account required). Governance: Horizen DAO with ZenIP proposal and voting process. Migration: ZEN migration guide.',
      },
    ],
    path.resolve(__dirname, 'plugins/llms-per-page/index.ts'),
  ],

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl: "https://github.com/HorizenOfficial/horizen-docs/tree/main",
          routeBasePath: "/",
          exclude: [
            "1-overview/**",
            "2-vela/**",
            "3-migration/**",
            "ecosystem/**",
            "4-mainnet-migration-instructions/**",
            "5-zenrise/**",
            "tutorials/vela/**",
          ],
          // showLastUpdateTime: true,
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
        // TODO: Add Google Analytics
        /* gtag: {
          trackingID: "TBD",
          anonymizeIP: true,
        }, */
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: "logos/png/Horizen2.0-logo_primary-dark.png",
    metadata: [
      {
        name: 'description',
        content: 'Build confidential apps with Vela — a blockchain coprocessor that runs your code inside a hardware-attested TEE and settles results on-chain. Live on Base.',
      },
      {
        name: 'keywords',
        content: 'Vela, Horizen, Horizen Labs, confidential execution, blockchain coprocessor, Trusted Execution Environment, TEE, AWS Nitro Enclave, attestation, confidential smart contracts, on-chain privacy, compliance, WASM, TinyGo, Base, ZEN token, ZEN migration, Horizen DAO, ZenIP governance',
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:description', content: 'Build confidential apps with Vela — a blockchain coprocessor that runs your code inside a hardware-attested TEE and settles results on-chain. Live on Base.' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@HorizenOfficial' },
    ],
    navbar: {
      logo: {
        alt: "Horizen",
        src: "logos/svg/Horizen2.0-logo_primary-dark.svg",
        srcDark: "logos/svg/Horizen2.0-logo_primary-white.svg",
        href: "/",
      },
      items: [
        {
          href: "/",
          label: "Home",
          position: "left",
        },
        {
          type: "docSidebar",
          sidebarId: "velaSidebar",
          position: "left",
          label: "VELA",
        },
        {
          type: "docSidebar",
          sidebarId: "migrationSidebar",
          position: "left",
          label: "Migration",
        },
        {
          type: "doc",
          docId: "governance/overview/about",
          position: "left",
          label: "Governance",
        },
        {
          href: "https://github.com/HorizenOfficial/horizen-docs",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Protocol",
          items: [
            {
              label: "Whitepaper",
              href: "https://downloads.horizen.io/file/web-assets/Horizen+Whitepaper+v1.0.0.pdf",
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Horizen. All rights reserved.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["solidity", "bash", "json"],
    },
    ...(algoliaConfig && { algolia: algoliaConfig }),
  } satisfies Preset.ThemeConfig,
};

export default config;
