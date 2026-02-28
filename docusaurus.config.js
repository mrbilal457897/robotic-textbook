import { themes as prismThemes } from 'prism-react-renderer';
const config = {
  title: 'Physical AI & Humanoid Robotics',
  tagline: 'Bridging the gap between digital minds and physical bodies',
  favicon: 'img/human.png',
  // GitHub Pages deployment configuration
  url: 'https://YOUR_GITHUB_USERNAME.github.io',
  baseUrl: '/physical-ai-textbook/',
  organizationName: 'YOUR_GITHUB_USERNAME',
  projectName: 'physical-ai-textbook',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  // Internationalization configuration
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ur', 'ar', 'zh', 'es'],
    localeConfigs: {
      en: {
        label: 'English',
        direction: 'ltr',
        htmlLang: 'en-US',
      },
      ur: {
        label: 'اردو',
        direction: 'rtl',
        htmlLang: 'ur',
      },
      ar: {
        label: 'العربية',
        direction: 'rtl',
        htmlLang: 'ar',
      },
      zh: {
        label: '中文',
        direction: 'ltr',
        htmlLang: 'zh-CN',
      },
      es: {
        label: 'Español',
        direction: 'ltr',
        htmlLang: 'es',
      },
    },
  },
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/YOUR_GITHUB_USERNAME/physical-ai-textbook/tree/main/',
          showLastUpdateTime: true,
          remarkPlugins: [],
          rehypePlugins: [],
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      },
    ],
  ],
  plugins: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        indexBlog: false,
        indexDocs: true,
        indexPages: true,
        docsRouteBasePath: '/docs',
        language: ['en', 'es', 'zh'],
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
      },
    ],
  ],
  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],
  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Physical AI & Humanoid Robotics',
      logo: {
        alt: 'Physical AI Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Modules',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/YOUR_GITHUB_USERNAME/physical-ai-textbook',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Learn',
          items: [
            {
              label: 'Modules',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/YOUR_GITHUB_USERNAME/physical-ai-textbook',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Cookie Settings',
              to: '/cookie-settings',
            },
            {
              label: 'Privacy Policy',
              to: '/privacy-policy',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Physical AI & Humanoid Robotics Interactive Textbook. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['python', 'bash', 'yaml', 'json', 'typescript'],
    },
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
  },
  stylesheets: [
    {
      href: '/css/chatbot.css',
      type: 'text/css',
    },
  ],
  /**
   * Anti-FOUC script for extended theme modes (sepia, high-contrast).
   * Runs synchronously before first paint to apply data-color-theme attribute.
   * Docusaurus handles light/dark FOUC natively; this covers the extra modes.
   */
  headTags: [
    {
      tagName: 'script',
      attributes: {},
      innerHTML: `
(function(){
  try {
    // Suppress CSS transitions during initial theme application
    document.documentElement.classList.add('no-theme-transition');
    var STORAGE_KEY = 'phyai-color-mode';
    var ATTR = 'data-color-theme';
    var mode = localStorage.getItem(STORAGE_KEY);
    if (mode === 'sepia') {
      document.documentElement.setAttribute(ATTR, 'sepia');
    } else if (mode === 'high-contrast') {
      document.documentElement.setAttribute(ATTR, 'high-contrast');
    }
    // light/dark/system FOUC is handled by Docusaurus's own mechanism
  } catch(e) {}
})();
            `.trim(),
    },
  ],
};
export default config;
