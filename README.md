# CAMYA — site bilingue Astro

Les 79 URL ES/EN sont des pages natives dans `src/pages/`, avec un layout commun et des composants pour les en-têtes, les menus, le hero, les reconnaissances, les accordéons, le footer et le formulaire Contacto. Le HTML de transition et les scripts WordPress, jQuery, WPBakery, Revolution Slider, Backbone et skrollr sont retirés.

Les styles du design approuvé sont conservés dans `public/styles/`, et les images/polices dans `public/assets/` et `public/home-assets/`. Certaines classes historiques sont volontairement conservées comme sélecteurs de présentation : aucun WordPress ni plugin n’est exécuté. Les images n’ont pas encore été optimisées en WebP.

Node 24 est requis.

```sh
npm ci
npm run build
npm run dev
npm test
npx playwright test --config=playwright.mobile.config.js
```

`npm run dev` lance Astro sur le port 8000. `npm run preview` sert le résultat du build. `dist/` est généré et ignoré par Git ; modifier les pages, les composants, les métadonnées de `src/data/pages.json`, les styles ou les scripts natifs de `src/scripts/`.

`npm run build` vérifie les 79 routes, les ressources locales et la conservation de la structure approuvée du contenu, des headers et des footers. `archive/astro-baseline.json` est une référence de migration du commit `6083841`, avec les nouvelles adresses des ressources ; mettre à jour cette référence uniquement lors d’un changement intentionnel du contenu ou des assets. Les archives originales servent aux tests de conservation des textes, sans participer au rendu Astro.

Les formulaires `/contacto/`, `/en/contact/` et les trois accueils utilisent un composant natif bilingue et envoient à Formspree (`mgavbgza`). Les tests interceptent les requêtes : ils vérifient les champs et les POST sans envoyer de courrier réel. Les interactions (menus, onglets, accordéons, parallax, en-tête fixe et partage) sont en JavaScript natif, compilé par Astro.

`dev2` conserve la sauvegarde avant migration (`ad506b1`). Le travail reste sur `dev`, avec prévisualisation Vercel ; `main` conserve la production validée. Les prévisualisations restent toujours en `noindex,nofollow`, même si `PUBLIC_ALLOW_INDEXING=true`. Les corrections SEO de `dev` ne changent pas la production tant qu’elles ne sont pas publiées depuis `main`.

```sh
vercel deploy --yes --scope olivier-steineur
```

Les contrôles de migration sont dans `verification/astro-migration/`. Le WordPress et le DNS du client restent indépendants de ce dépôt.

La préparation du domaine utilise `https://www.camya.mx` pour les URLs canoniques, le sitemap `/sitemap.xml`, les liens de langues et le partage. Les anciennes URLs WordPress de partage sont retirées ; les classes de présentation historiques restent uniquement des sélecteurs CSS. Aucun moteur WordPress, PHP, jQuery ni plugin ne tourne.

La version SEO préparée sur `dev` active l’indexation lors d’un futur build Vercel Production (`VERCEL_ENV=production`) : `index,follow` et `Allow: /`. `PUBLIC_ALLOW_INDEXING=false` permet de la désactiver explicitement en production. Aucun paramètre Vercel Production ni DNS n’est modifié par cette préparation. Les builds locaux restent non indexables par défaut ; `PUBLIC_ALLOW_INDEXING=true` permet un contrôle local explicite de la politique d’indexation.

Les titres et descriptions par page sont dans `src/data/seo.json`. Les trois alias (`/en/` et les deux paginations `/page/1/`) pointent vers leurs pages canoniques et sont exclus du sitemap. Les titres d’articles manquants utilisent la classe accessible existante `screen-reader-text`, sans changement du rendu visuel. `npm run build` vérifie aussi les métadonnées, les H1, le sitemap et les politiques d’indexation. Le ciblage local en dix groupes et la procédure Search Console sont documentés dans `verification/seo/README_FR.md`.

Les dix groupes ES/EN et leurs variantes sont dans `src/data/keyword-groups.json`. Les expressions principales alimentent la balise `meta keywords` et le composant `FooterKeywords.astro`, placé sous le copyright à la demande du client selon la référence Jean Louis David. Ce bloc est visible et s’adapte à la largeur de l’écran.
