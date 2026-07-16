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

  url: "https://docs.horizen.io",
  baseUrl: "/",

  staticDirectories: ['public'],

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  plugins: [
    path.resolve(__dirname, 'plugins/tailwind-plugin.js'),
    path.resolve(__dirname, 'plugins/llms-per-page/index.ts'),
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
        docsDir: 'docs',
        title: 'Horizen Documentation',
        description: 'Developer documentation for Horizen — an EVM-identical L3 on Base (Ethereum L2) using the OP Stack. Horizen adds compliant, verifiable privacy via VELA, a confidential execution coprocessor powered by Trusted Execution Environments (TEEs). Deploy standard Solidity contracts with Foundry or Hardhat (same tooling as Base/Ethereum), or build privacy-preserving apps with VELA. Mainnet chain ID: 26514, RPC https://horizen.calderachain.xyz/http. Testnet chain ID: 2651420, RPC https://horizen-testnet.rpc.caldera.xyz/http. ZEN is the native governance token (Base ERC-20: 0xf43eB8De897Fbc7F2502483B2Bef7Bb9EA179229). Tutorials cover: ERC-20 and NFT deployment, price-triggered escrow with Stork oracle, bridging assets via Stargate LayerZero OFT (ZEN OFT Adapter on Base 0x57da2D504bf8b83Ef304759d9f2648522D7a9280, Horizen EID 30399) and native OP Stack bridge (L1StandardBridge on Base 0xf4a6cc4171fda694439f856d912777aa6ab05369), Goldsky subgraph indexing, PureFi compliance gating, and Safe multisig setup. Governance: Horizen DAO with ZenIP proposal and voting process.',
      },
    ],
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
        content: 'Deploy smart contracts, bridge assets, and build privacy-preserving apps on Horizen — an EVM-identical L3 on Base powered by the OP Stack.',
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:description', content: 'Deploy smart contracts, bridge assets, and build privacy-preserving apps on Horizen — an EVM-identical L3 on Base powered by the OP Stack.' },
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
          sidebarId: "horizenChainSidebar",
          position: "left",
          label: "Horizen Chain",
        },
        {
          type: "docSidebar",
          sidebarId: "velaSidebar",
          position: "left",
          label: "VELA",
        },
        {
          type: "docSidebar",
          sidebarId: "tutorialsSidebar",
          position: "left",
          label: "Tutorials",
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
