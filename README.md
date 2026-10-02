# CAMYA — site bilingue

Le clone et sa correction mobile ont été validés. L'accueil espagnol et anglais est adapté selon les corrections client : header framboise/bleu, image montagne fournie, titre et sous-titre centrés sur une seule ligne sur ordinateur, titre espagnol agrandi de 20 %, boutons du hero retirés, reconnaissances avec les fichiers fournis dans l'ordre Chambers, WWL, Legal 500.

Les 79 URL, les biographies, les contenus et le formulaire du clone sont conservés. Les anciens textes du hero restent sous les reconnaissances. « Sectores » renvoie aux domaines existants dans les áreas de práctica ; aucune page ni texte de secteur n'est ajouté. L'accueil anglais reste lisible sur mobile, sans chevauchement du logo.

```sh
npm ci
npm run build
npm run dev
npm test
npx playwright test --config=playwright.mobile.config.js
```

Les ressources sont locales et le WordPress/DNS du client reste intact. Les formulaires ont l'apparence originale, mais leur backend d'envoi n'est pas connecté. Toute tentative d'envoi l'indique sans annoncer de succès.

`scripts/refresh-home.py` applique le brief à l'archive du clone validé, avec BeautifulSoup dans `requirements.txt`. Il modifie uniquement les sources de `/`, `/en/` et `/en/home/` dans `src/legacy/`. Exécuter ensuite `npm run build`. Un nouveau passage du collecteur `scripts/crawl.py` remplace l'export : réappliquer le brief ensuite si nécessaire.

Les captures et contrôles de l'accueil sont dans `verification/home-refresh/`. Les comparaisons du clone avant adaptation restent dans `verification/clone-complete/`.

`dev` reste la branche de travail. À la demande du client, la version centrée est fusionnée dans `main`, créée à partir du clone sauvegardé sur `backup` (`3d4412f`). La production Vercel utilise https://camya-mx.vercel.app/. Les previews utilisent `vercel deploy --yes --scope olivier-steineur` ; les versions validées sur `main` utilisent `vercel deploy --prod --yes --scope olivier-steineur`.

## Migration Astro — étape 1

La sauvegarde avant migration est sur `dev2` (`ad506b1`). Le travail de migration reste sur `dev`, avec déploiements de prévisualisation ; `main` conserve la version validée.

Astro 7.3.5 génère les 79 URL à partir du composant de transition `src/pages/[...path].astro`. Les documents approuvés sont dans `src/legacy/` et les ressources dans `public/`. `dist/` est désormais un résultat de build ignoré par Git : ne plus le modifier directement. Node >= 22.12.0 est nécessaire.

`npm run build` reconstruit le site, valide les URL et vérifie que le HTML de chaque page et toutes les ressources sont conservés. `npm run dev` démarre Astro ; `npm run preview` sert le build Astro. Les tests navigateur vérifient le résultat statique.

Cette étape installe le build Astro ; les pages utilisent encore le HTML et les scripts hérités du clone WordPress. La migration en composants Astro reste à faire, progressivement : accueil ES/EN, éléments communs, autres pages, puis suppression des dépendances inutiles. Les optimisations WebP et SEO sont des étapes distinctes.

Les scripts historiques `crawl.py` et `refresh-home.py` écrivent désormais les sources et ressources plutôt que le build. Un nouveau crawl peut remplacer les corrections approuvées (dont Contacto) : réservé à une nouvelle capture volontaire de l’ancien site.
