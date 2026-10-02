# CAMYA — clone du site public pour validation

Cette branche reproduit uniquement http://www.camya.mx/ : ses pages, textes, menus, styles, images, langues et URL. Aucun fichier de la nouvelle maquette n'est utilisé. Le nouveau design est conservé dans l'historique Git et attend la validation du clone.

À la demande du client, l'accueil anglais possède une correction responsive sous 1024 px : titre lisible et espacement sous le logo. Voir [la vérification mobile](verification/ENGLISH_MOBILE_FR.md).

```sh
npm ci
npm run build
npm run dev
npm test
```

Les ressources sont locales et le WordPress/DNS du client reste intact. Les formulaires ont l'apparence originale, mais leur backend d'envoi n'est pas connecté. Toute tentative d'envoi l'indique sans annoncer de succès.

Pour actualiser la copie depuis le site public : installer `requirements.txt`, exécuter `node scripts/capture-forms.cjs`, puis `python scripts/crawl.py`. Les champs rendus sont capturés depuis les pages d'origine, sans jetons serveur.

`node scripts/audit-clone.mjs` compare chaque URL à l'original en 390 et 1440 px, avec captures appariées et différences de pixels. Les rapports sont dans `verification/clone-complete/`.

Aperçu du clone : https://camya-mx.vercel.app/
