# Accueil ES/EN — prévisualisation sur dev

Cette adaptation part du clone et de sa correction mobile validés (`3d4412f`). Seuls `/`, `/en/` et `/en/home/` changent. Les 76 autres URL conservent leurs fichiers HTML. Les anciens paragraphes et titres du hero sont déplacés sous les reconnaissances sans réécriture ; les services, profils, biographies, actualités, contact et mentions restent disponibles.

Le header utilise le dégradé demandé et le logo CAMYA original `wp-content/uploads/2026/10/logoblanco_nvo.svg`. Les textes espagnols du hero sont ceux du brief, avec traduction anglaise fidèle. À la demande du client, les boutons « Nuestros Servicios » et « Conócenos », ainsi que leurs équivalents anglais, ont été retirés du hero. Les pages d'áreas de práctica et de La Firma restent accessibles depuis le menu.

Le bandeau logo/menu est ensuite ajusté à la référence du client : hauteur de 88 px sur ordinateur, 76 px sur tablette et 72 px sur téléphone, diagonale de 126° avec bande de transition bordeaux, logo original et navigation répartie sur la même ligne. La barre de coordonnées et réseaux sociaux d'origine est déplacée dans le footer existant pour commencer directement par le header. Le menu mobile reste accessible sous 1280 px et la version anglaise conserve son accès. Les boutons du hero restent supprimés.

À la demande du client, le titre du hero est affiché sur une seule ligne à partir de 1024 px, avec une taille proportionnelle à la largeur (32 à 50 px). Le titre anglais utilise la même règle. Sur téléphone et tablette, les retours à la ligne et les tailles lisibles restent conservés.

| Menu espagnol | Destination |
| --- | --- |
| Inicio | `/` |
| Servicios | `/areas-de-practica/` |
| Nosotros | `/la-firma/` |
| Sectores | `/areas-de-practica/#content` |
| Equipo | `/equipo/` |
| Contacto / Consulta | `/#contacto` |

Les équivalents anglais utilisent les URL originales `/en/home/`, `/en/pratic-areas/`, `/en/the-firm/` et `/en/team/`. « Sectores » utilise la liste existante, notamment Agrario, Energía, Petróleo y Gas, Inmobiliario et Minero. Aucune page ni texte de secteur n'est inventé.

## Images et typographie

- La montagne provient de `CAMYA_Mockup_Code-2.zip`, fichier `dist/assets/hero-montanas.webp`, copié sans modification.
- Les trois marques proviennent du fichier original `wp-content/uploads/2026/10/logos-white_3.png`. Les tiers sont affichés par découpage CSS dans l'ordre Chambers, Legal 500, WWL. Le filtre monochrome rend les marques blanches originales lisibles dans la capsule blanche. Aucun logo n'est dessiné avec du texte, des polices ou des formes ; le fichier original reste intact.
- Inter variable est hébergé localement, avec sa licence SIL OFL, depuis le dépôt officiel `rsms/inter`.

## Vérifications

Les contrôles couvrent 375, 390, 430, 768 et 1440 px : textes, gradients, images, ordre des marques, absence de débordement, bouton Consulta, liens des boutons, menu mobile, fermeture par Échap, accès aux langues et pied de page unique. Le test anglais contrôle aussi les petits écrans à 320 px et l'absence de chevauchement du logo. Le formulaire conserve son état explicite sans backend d'envoi.

Les captures ES/EN sont réunies dans [la galerie](home-refresh/index.html), avec [le relevé des captures](home-refresh/captures.json). Le build vérifie les 79 routes et leurs ressources locales. Les tests de préservation vérifient tous les paragraphes, titres et listes d'origine, ainsi que les profils et interactions du clone.

Résultats locaux : build réussi, **18 tests Chromium réussis** et **7 tests WebKit réussis** avec le profil iPhone 13. Les 10 captures (5 largeurs × 2 langues) ne présentent aucune erreur JavaScript, image manquante, réponse HTTP en erreur ni débordement horizontal. Chaque accueil conserve un seul footer. La comparaison binaire confirme les 76 pages intérieures inchangées, les corrections mobiles et les fichiers de logos originaux intacts : [preuve de préservation](home-refresh/preservation.json).

## Publication

Prévisualisation publique actuelle, avec le header corrigé et sans les boutons du hero : [accueil espagnol](https://camya-l6iyut6ti-olivier-steineur.vercel.app/) et [accueil anglais](https://camya-l6iyut6ti-olivier-steineur.vercel.app/en/home/). Le code est enregistré dans le commit `4ba29fa` sur `dev`.

La correction du header passe les 5 tests publics ES/EN aux largeurs demandées. Les captures sont renouvelées depuis cette URL. Les largeurs de transition 1279, 1280 et 1366 px sont aussi contrôlées pour exclure tout chevauchement des liens. La production reste identique à son état avant cette correction : [contrôle du header](home-refresh/header-verification.json).

La branche `dev` est poussée et déployée en **preview**, sans `--prod`. Les empreintes du clone initial sont conservées dans [production-baseline.json](home-refresh/production-baseline.json) comme relevé historique avant adaptation de l'accueil.

Lors de la livraison initiale du nouvel accueil, les empreintes des deux accueils et de la CSS mobile de `camya-mx.vercel.app` étaient identiques au clone : [contrôle initial de production](home-refresh/preview-verification.json).

Après retrait des boutons, **5 tests publics réussis** confirment les cinq largeurs, les deux langues, l'absence de liens dans le hero et les menus. Les 10 captures sont renouvelées depuis cette prévisualisation, sans image manquante, erreur ni débordement. Les tests locaux restent tous réussis (18 Chromium, 7 WebKit).

La production avait entre-temps été mise à jour vers un déploiement créé à 23 h 09, contenant le commit `7c427db`. Cette correction n'y intervient pas : elle reste en prévisualisation. Le [relevé de cette correction](home-refresh/hero-buttons-removal.json) vérifie les 79 routes publiques et que la production conserve ce contenu précédemment publié.

L'aperçu est noindex. La promotion en production attend la validation du client ; les DNS et le WordPress du client ne sont pas modifiés.
