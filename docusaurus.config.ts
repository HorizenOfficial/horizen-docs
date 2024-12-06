import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "Horizen Documentation",
  tagline: "An Advanced and Efficient EVM for Zero-Knowledge Applications",
  favicon: "img/favicon-32x32.png",

  // Set the production url of your site here
  url: "https://your-docusaurus-site.example.com",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl: 'https://github.com/HorizenLabs/horizen-2-docs/tree/main',
          routeBasePath: '/'
        },
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
    // Replace with your project's social card
    image: "img/docusaurus-social-card.jpg",
    navbar: {
      logo: {
        alt: "Horizen",
        src: "img/horizenlogo.png",
        srcDark: "img/horizenlogo_darkmode.png"
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "overviewSidebar",
          position: "left",
          label: "Overview",
        },
        {
          type: "docSidebar",
          sidebarId: "apiSidebar",
          position: "left",
          label: "Api",
        },    
        {
          type: "docSidebar",
          sidebarId: "tutorialsSidebar",
          position: "left",
          label: "Tutorials",
        },  
        {
          type: 'doc',
          docId: 'horizen_hub',
          to: 'docs/horizen_hub.md',
          position: 'left',
          label: 'Horizen Hub',
        },
        {
          href: "https://github.com/HorizenLabs/horizen-2-docs",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} Horizen`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["solidity"],
    },
    // TODO: Define Algolia credentials
    /*algolia: {
      appId: process.env.ALGOLIA_APP_ID,
      apiKey: process.env.ALGOLIA_API_KEY,
      indexName: process.env.ALGOLIA_INDEX_NAME,
    },*/
  } satisfies Preset.ThemeConfig,
};

export default config;
