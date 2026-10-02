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

`scripts/refresh-home.py` applique le brief à l'archive du clone validé, avec BeautifulSoup dans `requirements.txt`. Il modifie uniquement `/`, `/en/` et `/en/home/`. Un nouveau passage du collecteur `scripts/crawl.py` remplace l'export : réappliquer le brief ensuite si nécessaire.

Les captures et contrôles de l'accueil sont dans `verification/home-refresh/`. Les comparaisons du clone avant adaptation restent dans `verification/clone-complete/`.

`dev` reste la branche de travail. À la demande du client, la version centrée est fusionnée dans `main`, créée à partir du clone sauvegardé sur `backup` (`3d4412f`). La production Vercel utilise https://camya-mx.vercel.app/. Les previews utilisent `vercel deploy --yes --scope olivier-steineur` ; les versions validées sur `main` utilisent `vercel deploy --prod --yes --scope olivier-steineur`.
