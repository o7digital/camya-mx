# Migration Astro native

Les 79 routes utilisent des pages `.astro` et le layout commun. Le rendu brut des documents `src/legacy` est retiré. Les anciens scripts WordPress/jQuery/WPBakery/Revolution Slider/Backbone/skrollr sont remplacés par le module natif `src/scripts/site.ts`. Les styles du design sont conservés avec leurs sélecteurs de présentation, et les images/polices sont déplacées sans réencodage.

Le build compare la structure DOM du contenu, des headers et des footers aux références du commit `6083841`, et vérifie les 207 assets conservés.

Comparaison visuelle : 24 captures pleine page sur 12 routes, à 390 et 1440 px, après chargement des polices et des images. Dimensions identiques et aucun pixel différent au seuil pixelmatch 0,1. Les résultats sont dans `visual-comparison.json`. Cette comparaison ne couvre pas les différences de timing des animations ou de position de scroll lors de l’ouverture des onglets mobiles.

Tests locaux : 25 Chromium, 7 WebKit/iPhone Safari. Les nouveaux tests vérifient les 79 routes sans global jQuery, sans configuration de plugin et sans erreur JavaScript, puis les contrôles clavier, le menu mobile, les accordéons, la recherche, le header fixe et le partage. Le POST Formspree est intercepté dans les tests ; aucun message de test n’est envoyé réellement.

La migration est publiée uniquement en prévisualisation sur `dev`. `main` et `dev2` restent inchangées. Les travaux WebP et SEO sont volontairement séparés.
