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

Le formulaire `/contacto/` envoie à Formspree. Les anciens formulaires des accueils restent déconnectés et affichent clairement qu’aucun message n’a été envoyé. Les interactions (menus, onglets, accordéons, parallax, en-tête fixe et partage) sont en JavaScript natif, compilé par Astro.

`dev2` conserve la sauvegarde avant migration (`ad506b1`). La migration reste sur `dev`, avec prévisualisation Vercel ; `main` conserve la production validée. Les prévisualisations et le site conservent `noindex,nofollow` jusqu’au chantier SEO sur le domaine définitif.

```sh
vercel deploy --yes --scope olivier-steineur
```

Les contrôles de migration sont dans `verification/astro-migration/`. Le WordPress et le DNS du client restent indépendants de ce dépôt.
