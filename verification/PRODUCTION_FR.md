# Vérification du clone publié

URL : https://camya-mx.vercel.app/

Déploiement du clone : `camya-jakcj86ce-olivier-steineur.vercel.app`, à partir du commit `963f0f4`.

Les 79 routes publiques répondent en HTTP 200, avec un contenu HTML identique aux fichiers locaux comparés à l'original et l'en-tête noindex. Les fichiers du nouveau design `/styles.css`, `/site.js` et `/assets/hero-montanas.webp` répondent en 404. Les deux URL techniques de popup redirigent vers l'accueil.

Les 12 contrôles navigateur ont été validés sur l'URL publique : 11 lors de la suite complète, puis le contrôle du menu mobile après correction d'une attente de chargement dans le test. Le test corrigé passe aussi localement. Aucun fichier du site n'a été modifié pour cette correction de test.

Le build valide les 79 routes et leurs ressources locales. Les preuves visuelles des 158 comparaisons avec l'original sont détaillées dans [CLONE_FR.md](CLONE_FR.md).

Le clone attend la validation du client. Le formulaire ne dispose pas d'un backend d'envoi et ne simule aucun succès.
