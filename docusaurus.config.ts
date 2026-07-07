import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// Microsoft Clarity analytics. Defaults to the App Service Labs production
// project ID, but can be overridden or disabled with the CLARITY_PROJECT_ID
// environment variable (set it to an empty string to turn tracking off, for
// example in a fork). The project ID is not a secret; it ships in client-side
// JavaScript on every page.
const clarityProjectId =
  process.env.CLARITY_PROJECT_ID ??
  (process.env.NODE_ENV === 'production' ? 'xivu5543fd' : '');
const clarityHeadTags: Config['headTags'] = clarityProjectId
  ? [
      {
        tagName: 'script',
        attributes: {type: 'text/javascript'},
        innerHTML: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "${clarityProjectId}");`,
      },
    ]
  : [];

const config: Config = {
  title: 'App Service Labs',
  tagline: 'Learn Azure App Service by building with App Service',
  favicon: 'img/app-service-labs-icon.svg',

  // Set the production url of your site here
  url: 'https://azure-samples.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/app-service-labs/',
  deploymentBranch: 'gh-pages',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'azure-samples', // Usually your GitHub org/user name.
  projectName: 'app-service-labs', // Usually your repo name.

  onBrokenLinks: 'throw',
  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

  // Microsoft Clarity analytics script (only injected when CLARITY_PROJECT_ID is set)
  headTags: clarityHeadTags,

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/Azure-Samples/app-service-labs/tree/main/',
        },
        // 
        // IF WE WANT TO ENABLE THE BLOG PLUGIN, UNCOMMENT THIS SECTION
        // blog: {
        //   showReadingTime: true,
        //   feedOptions: {
        //     type: ['rss', 'atom'],
        //     xslt: true,
        //   },
        //   // Please change this to your repo.
        //   // Remove this to remove the "edit this page" links.
        //   editUrl:
        //     'https://github.com/Azure-Samples/app-service-labs/tree/main/',
        //   // Useful options to enforce blogging best practices
        //   onInlineTags: 'warn',
        //   onInlineAuthors: 'warn',
        //   onUntruncatedBlogPosts: 'warn',
        // },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,

    ],
  ],

  plugins: [
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        hashed: true,
        language: ["en"],
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
        docsRouteBasePath: ['/docs'],
        indexBlog: false,        // Blog is disabled (blog: false), so don't index it
        indexDocs: true,        // Set to true to index docs
        indexPages: true,       // Index standalone pages (for example, /contributing)
      },
    ],
    require.resolve("docusaurus-plugin-image-zoom"),
  ],

  themeConfig: {
    // Click any doc image to open it in a larger lightbox
    zoom: {
      selector: '.markdown img:not(.no-zoom)',
      background: {
        light: 'rgb(255, 255, 255)',
        dark: 'rgb(30, 30, 30)',
      },
    },
    // App Service Labs social card
    image: 'img/app-service-labs-social-card.png',
    navbar: {
      title: 'App Service Labs',
      logo: {
        alt: 'App Service Labs Logo',
        src: 'img/app-service-labs-icon.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Workshops',
        },
        {
          href: 'https://azure.github.io/AppService/',
          label: 'Blog',
          position: 'left',
        },
        {
          href: 'https://github.com/Azure-Samples/app-service-labs',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    docs: {
      sidebar: {
        hideable: true,
      }
    },
    footer: {
      style: 'dark',
      links: [
        // {
        //   title: 'Docs',
        //   items: [
        //     {
        //       label: 'Tutorial',
        //       to: '/docs/intro',
        //     },
        //   ],
        // },
        // {
        //   title: 'Community',
        //   items: [
        //     {
        //       label: 'Stack Overflow',
        //       href: 'https://stackoverflow.com/questions/tagged/docusaurus',
        //     },
        //     {
        //       label: 'Discord',
        //       href: 'https://discordapp.com/invite/docusaurus',
        //     },
        //     {
        //       label: 'X',
        //       href: 'https://x.com/docusaurus',
        //     },
        //   ],
        // },
        // {
        //   title: 'More',
        //   items: [
        //     {
        //       label: 'Blog',
        //       to: '/blog',
        //     },
        //     {
        //       label: 'GitHub',
        //       href: 'https://github.com/facebook/docusaurus',
        //     },
        //   ],
        // },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Microsoft. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
