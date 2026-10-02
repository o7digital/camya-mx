# CAMYA — accueil en prévisualisation sur dev

Le clone et sa correction mobile ont été validés. La branche `dev` adapte uniquement l'accueil espagnol et anglais selon le brief client : header framboise/bleu, image montagne fournie, textes et boutons demandés, reconnaissances avec les logos originaux.

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

La production https://camya-mx.vercel.app/ conserve le clone validé. Déployer `dev` en preview avec `vercel deploy --yes --scope olivier-steineur`, sans `--prod`. Attendre la validation du client avant toute promotion en production.
