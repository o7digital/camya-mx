const base = require('@playwright/test');
const gtmScriptUrl = 'https://www.googletagmanager.com/gtm.js?id=GTM-NLGGSN85';

// Exercise the site's real initialization without loading live analytics in tests.
const test = base.test.extend({
  context: async ({context}, use) => {
    await context.route(gtmScriptUrl, route => route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: '',
    }));
    await use(context);
  },
});

module.exports = {test, expect: base.expect, gtmScriptUrl};
