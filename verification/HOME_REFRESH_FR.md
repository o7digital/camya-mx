# Accueil ES/EN — prévisualisation sur dev

Cette adaptation part du clone et de sa correction mobile validés (`3d4412f`). Seuls `/`, `/en/` et `/en/home/` changent. Les 76 autres URL conservent leurs fichiers HTML. Les anciens paragraphes et titres du hero sont déplacés sous les reconnaissances sans réécriture ; les services, profils, biographies, actualités, contact et mentions restent disponibles.

Le header utilise le dégradé demandé et le logo CAMYA original `wp-content/uploads/2026/10/logoblanco_nvo.svg`. Les textes espagnols du hero sont ceux du brief, avec traduction anglaise fidèle. Les boutons renvoient aux pages existantes d'áreas de práctica et de La Firma.

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

Prévisualisation publique : [accueil espagnol](https://camya-hwtb6xuld-olivier-steineur.vercel.app/) et [accueil anglais](https://camya-hwtb6xuld-olivier-steineur.vercel.app/en/home/). Le code est enregistré dans le commit `7c427db` sur `dev`.

La branche `dev` est poussée et déployée en **preview**, sans `--prod`. La branche de production Vercel est `main`. Les empreintes des accueils et de la CSS mobile de production sont conservées dans [production-baseline.json](home-refresh/production-baseline.json) pour confirmer que le clone publié reste intact.

Après le déploiement de la prévisualisation, les empreintes des deux accueils et de la CSS mobile de `camya-mx.vercel.app` sont identiques au relevé initial : [contrôle de production](home-refresh/preview-verification.json).

Sur l'URL publique de prévisualisation, **8 tests réussis** confirment les cinq largeurs, les deux langues, les boutons et menus. Les **79 routes répondent en HTTP 200**. Les 10 captures de la galerie proviennent de cette URL déployée, sans image manquante, erreur ni débordement.

L'aperçu est noindex. La promotion en production attend la validation du client ; les DNS et le WordPress du client ne sont pas modifiés.
