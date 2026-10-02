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

Demo URLs: original clone at https://camya-mx-clone.vercel.app/ and redesigned site at https://camya-mx.vercel.app/.

The ZIP reference is retained in `reference-new-design/`. Its stylesheet and images are copied unchanged. `scripts/redesign.py` renders all routes from the sanitized clone saved in `archive/clone-html.json`; install `requirements.txt` to rerun it. The browser tests verify original paragraphs, page headings, practice items, full biographies, both languages and every route at 390, 768 and 1440 pixels.

The homepage keeps the ZIP composition, with full-page navigation, a link to the complete team, full-profile links in the dialogs and the original job-title form field. The original homepage copy is accessible in “Más sobre CAMYA” / “More about CAMYA”. Full original legal notices remain at their existing URLs.
