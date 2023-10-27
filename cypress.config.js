const { defineConfig } = require('cypress')

module.exports = defineConfig({
  includeShadowDom: true,
  viewportHeight: 1000,
  projectId: '6iu6px',
  retries: {
    runMode: 2,
    openMode: 0,
  },
  blockHosts: [
    'www.googletagmanager.com',
    'sb.scorecardresearch.com',
    'dd.nytimes.com',
    'a.nytimes.com',
    'c.amazon-adsystem.com',
    'rumcdn.geoedge.be',
    'securepubads.g.doubleclick.net',
  ],
  experimentalStudio: true,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'https://www.nytimes.com/games/wordle',
    excludeSpecPattern: ['**/utils/*', 'pages.js'],
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
})
