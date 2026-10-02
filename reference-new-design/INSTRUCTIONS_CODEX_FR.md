# Instructions Codex — CAMYA : clonage fidèle, puis nouveau design

## Périmètre et ordre obligatoires
Le ZIP contient le NOUVEAU design proposé, pas un clone complet du site actuel. Ne pas l'utiliser comme point de départ du clonage.

Étape 1 : cloner fidèlement le site public actuel http://www.camya.mx/ dans le projet cible, sans appliquer la nouvelle maquette et sans réinterpréter son apparence.
Étape 2 : lorsque la copie fidèle est vérifiée et conservée dans un commit distinct, appliquer le nouveau code fourni dans dist/ en préservant l'ensemble des pages et contenus récupérés à l'étape 1.

Le projet cible doit utiliser Astro/React si c'est sa stack existante. Il ne s'agit pas de reconstruire un WordPress ni de modifier le serveur du client. Le périmètre est le site public; l'administration et les traitements serveur ne sont pas inclus sans leurs accès et une demande spécifique.

## Étape 1 — Reproduction du site actuel
1. Lire AGENTS.md et inspecter le projet cible. Créer une branche dédiée et préserver les modifications existantes.
2. Inventorier les URL depuis http://www.camya.mx/wp-sitemap.xml et depuis les liens internes. Inclure les pages espagnoles et anglaises, les profils, les catégories utiles et les actualités. Évaluer les pages techniques et doublons séparément; ne pas les convertir arbitrairement en pages commerciales.
3. Utiliser HTTP pour lire la source si le HTTPS échoue. Ne pas contourner les avertissements de certificat. Si une page est inaccessible, signaler précisément laquelle et demander la source manquante; ne pas inventer son contenu.
4. Reproduire la mise en page existante : en-tête, menus, couleurs, typographie, espacements, images, sliders, ordre des sections et pied de page. Copier les contenus, biographies, mentions et traductions sans réécriture.
5. Conserver les chemins des pages et leurs correspondances de langue. Ne pas réduire le site à une seule page d'accueil ni remplacer toutes les pages par des sections.
6. Télécharger et servir localement les images, logos, polices et ressources nécessaires. Préserver les proportions et cadrages. Réimplémenter les interactions publiques requises sans dépendre du serveur WordPress du client.
7. Vérifier menus desktop/mobile, changement de langue, onglets, profils, ancres et sliders. Ne pas simuler l'envoi du formulaire : son backend devra être connecté séparément. Ne pas copier les nonces ni les appels AJAX WordPress temporaires dans la nouvelle application.
8. Comparer la copie au site d'origine aux mêmes dimensions desktop et mobile. Fournir les captures comparatives et une liste explicite des éventuels écarts. Ne pas annoncer un clone à l'identique si des pages ou références visuelles restent manquantes.
9. Enregistrer un commit distinct pour la copie fidèle afin de pouvoir revenir à cet état.

## Étape 2 — Application du nouveau code
1. Reprendre dist/index.html, dist/styles.css, dist/app.js et dist/assets comme référence de la nouvelle page d'accueil. Adapter à Astro/React sans inventer un troisième design.
2. Conserver toutes les pages, URL, contenus, profils et langues du clonage. Appliquer de façon cohérente l'identité framboise/bleu marine aux autres pages, sans supprimer leur contenu.
3. Les nouvelles sections et textes de la maquette ne doivent pas écraser les contenus originaux sans validation. Préserver les contenus récupérés et signaler les différences de rédaction.
4. Le visuel montagne de ce ZIP est provisoire et généré pour la proposition. Le client n'a pas encore fourni les deux images annoncées dans son message. Ne pas prétendre reproduire exactement sa maquette visuelle sans ces références. Remplacer le fond et ajuster le design lorsqu'elles sont fournies.
5. Le formulaire fourni prépare un email via mailto : il ne stocke rien et n'envoie rien automatiquement. Ne pas afficher de faux succès d'envoi.
6. Vérifier à 390 px, 768 px et 1440 px : absence de débordement, textes lisibles, assets disponibles, navigation, langues et interactions correctes.
7. Conserver noindex sur la démonstration. Avant un vrai lancement, valider titres, descriptions, canoniques, hreflang, sitemap et redirections URL par URL. Ne pas toucher aux DNS ou au WordPress existant pendant la démonstration.
8. Livrer l'URL de test, les vérifications effectuées et les limites restantes. Ne pas présenter une maquette d'accueil comme une migration complète terminée.

## Livrables attendus
- Premier état : copie fidèle du site actuel, avec URL de test et comparaison visuelle.
- Deuxième état : même site avec le nouveau design, en conservant le premier état dans l'historique.

Le HTML public de plusieurs pages récupéré pendant l'audit est inclus dans reference-site-actuel/ pour aider si le site est difficile d'accès. Il s'agit d'un échantillon de référence, pas d'un export complet ni d'une sauvegarde WordPress. Les URL distantes et paramètres temporaires qu'il contient ne sont pas à déployer tels quels.
