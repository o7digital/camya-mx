# Correction de l'accueil anglais sur mobile

Les routes `/en/` et `/en/home/` conservaient le titre original à environ 65 px et un espace masqué sous 1024 px. Le titre chevauchait le logo.

La correction s'applique uniquement à leur bannière sous 1024 px : titre entre 28 et 40 px, interligne 1,2 et espace suffisant sous le menu et le logo. Les textes, les images et les couleurs sont conservés.

Captures : [avant à 375 px](english-mobile/english-375-before.png), [après à 375 px](english-mobile/english-375-after.png), [après à 430 px](english-mobile/english-430-after.png).

Le test de régression contrôle les deux URL à 320, 375, 390, 430, 768 et 1023 px : absence de chevauchement avec l'en-tête, taille lisible, titre complet, aucun débordement horizontal et menu accessible. Le build valide les 79 routes et leurs ressources. Les autres contrôles portent sur les contenus, les langues, les profils, les images, le formulaire et le pied de page.

Le contrôle Safari utilise WebKit avec le profil iPhone 13 : `npx playwright test --config=playwright.mobile.config.js`. Il contrôle aussi le menu mobile et le changement de langue.

Les 158 comparaisons historiques du clone initial ne constituent pas la validation de cette correction mobile.
