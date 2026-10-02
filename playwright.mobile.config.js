const {defineConfig, devices} = require('@playwright/test');
const base = require('./playwright.config');

module.exports = defineConfig({
  ...base,
  testMatch: ['english-mobile.spec.js', 'site.spec.js', 'home-refresh.spec.js'],
  grep: /English home hero|mobile menu|refreshed ES\/EN home/,
  projects: [{name: 'iPhone Safari', use: {...devices['iPhone 13']}}],
});
