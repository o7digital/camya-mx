const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests', timeout: 60000, workers: 2,
  use: { baseURL: process.env.TEST_URL || 'http://127.0.0.1:8000' },
  webServer: process.env.TEST_URL ? undefined : { command: 'npm run preview', url: 'http://127.0.0.1:8000', reuseExistingServer: true },
});
