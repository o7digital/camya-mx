const {defineConfig, devices} = require('@playwright/test');
const base = require('./playwright.config');

module.exports = defineConfig({
  ...base,
  testMatch: ['english-mobile.spec.js', 'site.spec.js'],
  grep: /English home hero|mobile menu/,
  projects: [{name: 'iPhone Safari', use: {...devices['iPhone 13']}}],
});
