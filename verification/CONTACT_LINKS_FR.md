# Liens téléphone et email

Les coordonnées du bandeau étaient du texte simple. Le composant commun `ContactDetails.astro` utilise désormais `tel:+525567989181` et `mailto:info@camya.mx`. Les icônes font partie des liens. Le numéro des footers espagnol et anglais utilise également le lien d'appel.

Les textes, couleurs et espacements sont conservés. Le survol souligne le lien et le focus clavier dispose d'un contour visible. L'activation utilise les applications d'appel et d'email configurées sur l'appareil ; le site n'envoie aucun email automatiquement.

Le build vérifie les 79 routes. Les références de footer dans `archive/astro-baseline.json` sont mises à jour uniquement pour les nouveaux liens : une comparaison après retrait des nouvelles balises confirme que tous les contenus et structures restent identiques. Les autres régions et les 207 empreintes d'assets de référence sont inchangées.

Les 25 tests existants passent. Un contrôle de navigateur sur `/`, `/areas-de-practica/`, `/en/home/` et `/en/pratic-areas/`, à 390 et 1440 px, confirme les clics sur les icônes, l'activation par Entrée, l'absence de blocage de l'action native et l'absence de débordement. Le même contrôle passe dans Chromium et WebKit. L'ouverture d'une application externe est interceptée uniquement pendant la vérification pour ne pas lancer un appel réel.

La correction est livrée sur `dev` avec la prévisualisation de la migration Astro.
