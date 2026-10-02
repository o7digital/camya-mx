# Clone fidèle — vérification exhaustive pour validation

La version publiée contient uniquement le clone du site public actuel, récupéré de nouveau depuis http://www.camya.mx/. Aucun HTML, CSS, JavaScript, texte ou visuel de la nouvelle maquette n'est utilisé.

79 URL sont conservées : pages espagnoles et anglaises, 31 profils, actualités, catégories, pages anciennes toujours publiques et pagination. 237 ressources sont téléchargées localement. Les contenus ne sont ni regroupés ni reformulés.

## Comparaison de chaque page

Chaque URL a été visitée sur le site d'origine et sur le clone avec Chromium, en 390 et 1440 px. Le défilement déclenche le chargement des images ; les polices et les images sont rendues avant les captures de la page complète. 158 paires de captures sont conservées avec un rapport page par page dans [la galerie](clone-complete/index.html), [le rapport complet](clone-complete/report.json) et [la synthèse](clone-complete/summary.json).

Les contrôles portent sur les dimensions, le rendu des captures, les textes visibles, les images, les titres, les erreurs navigateur et le nombre de pieds de page. Les planches appariées sont examinées visuellement. La catégorie Asociados et son alias de pagination ont été recapturés après décodage complet des photos, pour corriger un chargement incomplet dans les premières captures de l'original.

Résultat : **158/158 captures identiques pixel par pixel (données RGBA)**, dimensions et textes visibles identiques, aucune page de l'inventaire inaccessible, aucune image visible manquante et aucun pied de page dupliqué. Ce résultat décrit les états capturés dans Chromium à ces deux largeurs ; il ne prétend pas couvrir tous les navigateurs ou tous les états interactifs possibles.

Les 12 tests navigateur passent : disponibilité des URL, contenus originaux conservés, menus et langue, onglets d'équipe, biographies, formulaire sans faux envoi, images, absence de débordement à 390/768/1440 px et un seul pied de page original sur chaque URL.

## Pied de page et formulaire

Le pied de page ajouté par la nouvelle maquette a été supprimé. Seuls le `footer#footer` et sa ligne de copyright `#footer-bottom` d'origine sont conservés, à leur emplacement et avec leurs textes et espacements d'origine.

Les champs des formulaires et leurs boutons Enviar/Send sont reproduits depuis le DOM réellement rendu par le site d'origine, avec les CSS originales de Ninja Forms. Aucun texte supplémentaire n'est affiché dans leur état initial. Le backend n'étant pas connecté, une tentative d'envoi affiche un message explicite indiquant qu'aucun message n'a été envoyé. Aucun appel n'est effectué au WordPress du client.

## URL techniques et liens défectueux de l'original

Les deux URL `/popupbuilder/aviso-2/` et `/popupbuilder/aviso-2-2/` redirigent vers l'accueil sur le site public actuel. Elles ont été vérifiées en HTTP et conservent cette destination sur l'aperçu.

Trois liens malformés du contenu légal renvoient une 404 sur le site d'origine :

- `http://www.camya.mx/aviso-de-privacidad/www.camya.mx%20`
- `http://www.camya.mx/aviso-de-privacidad/www.camya.mx.%20`
- `http://www.camya.mx/terminos-y-condiciones/www.camya.mx%20`

Ils ne correspondent pas à des pages de contenu accessibles. Aucune page ni présentation n'a été inventée à ces emplacements. Leurs textes sont conservés. Les autres échecs du collecteur sont des fragments de chaînes JavaScript interprétés comme URL ou un répertoire de plugin, pas des pages manquantes.

La copie n'inclut pas les traitements serveur WordPress, l'administration ou le moteur de recherche côté serveur. L'aperçu est noindex et les DNS/WordPress du client sont inchangés. Le nouveau design attend la validation du clone.
