# Vérification du premier état

79 routes publiques récupérées : pages ES/EN, 31 profils (19 espagnols et 12 anglais), actualités, catégories et pagination. 237 ressources du domaine téléchargées et servies localement. Les pages doublons présentes au sitemap sont conservées à leur URL.

Comparaisons : accueil ES/EN, firme, domaines de pratique et équipe, à 390, 768 et 1440 px. Les captures `*-original.png` et `*-clone.png` sont appariées dans `verification/clone/`. Mise en page, couleurs, images, cadrages, textes, onglets et menus de ces pages conservés. Le rapport navigateur associé ne relève aucune erreur JavaScript ni débordement sur ces vues.

Écarts intentionnels : formulaire local avec les mêmes champs, validation native et préparation d'email ; bouton et note explicitent l'absence d'envoi serveur. Les composants d'administration, nonces, configurations AJAX et l'iframe externe invisible ne sont pas déployés. Les démonstrations sont noindex. La recherche WordPress et les traitements serveur ne font pas partie de cette copie statique.

Deux URL popupbuilder du sitemap sont des objets techniques, recensés séparément sans conversion en pages commerciales. Les trois liens malformés `www.camya.mx` des mentions légales renvoient déjà une 404 sur l'original ; leurs textes restent conservés. Les autres erreurs de collecte portent sur des expressions JavaScript prises pour des URL ou un répertoire de plugin, et non sur des pages ou ressources publiques nécessaires.

Cette vérification visuelle porte sur les pages représentatives indiquées, pas sur chaque état visuel des 79 routes. Le contenu et les ressources des autres routes sont vérifiés automatiquement.
