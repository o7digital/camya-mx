# CAMYA

Public static reproduction of http://www.camya.mx/, followed by the supplied CAMYA redesign.

```sh
npm ci
npm run build
npm run dev
npm test
```

No WordPress server, administration, database, client DNS or domain is modified. Public assets are local. Forms prepare mail in the user's mail application and never claim a successful submission.

The public route inventory and original content are in `archive/pages.json`. Crawl results are in `archive/crawl-report.json`. Visual comparisons at 390, 768 and 1440 pixels are in `verification/clone/`.

The initial clone is preserved in its own commit and tag `camya-original-clone`. The Vercel demonstration serves `dist/`, with noindex/nofollow in the HTML and HTTP headers.
