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

`dev2` conserve la sauvegarde avant migration (`ad506b1`). La migration reste sur `dev`, avec prévisualisation Vercel ; `main` conserve la production validée. Les prévisualisations et le site conservent `noindex,nofollow` jusqu’à la bascule du domaine.

```sh
vercel deploy --yes --scope olivier-steineur
```

Les contrôles de migration sont dans `verification/astro-migration/`. Le WordPress et le DNS du client restent indépendants de ce dépôt.

La préparation du domaine utilise `https://www.camya.mx` pour les URLs canoniques, le sitemap `/sitemap.xml`, les liens de langues et le partage. Les anciennes URLs WordPress de partage sont retirées ; les classes de présentation historiques restent uniquement des sélecteurs CSS. Aucun moteur WordPress, PHP, jQuery ni plugin ne tourne.

Pour la mise en ligne sur le domaine : connecter `camya.mx` et `www.camya.mx` à ce projet Vercel, vérifier les DNS et HTTPS, puis configurer `PUBLIC_ALLOW_INDEXING=true` uniquement pour l’environnement Production et redéployer. Les builds Preview restent non indexables même si cette variable vaut `true`. Sans cette variable, les pages restent `noindex,nofollow` et `/robots.txt` contient `Disallow: /`. L’ancien en-tête global `X-Robots-Tag` est supprimé pour que l’activation soit contrôlée par cette seule configuration. Le DNS et le WordPress actuels n’ont pas été modifiés.
