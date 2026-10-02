# Vérification du deuxième état

Accueil repris du ZIP corrigé ; styles et images du ZIP conservés. L'identité framboise/bleu marine est appliquée aux 79 routes du clone. Le code ne dépend pas du serveur WordPress.

Les 12 tests Playwright passent en local : disponibilité et noindex des 79 routes ; conservation des paragraphes, titres et listes de pratique de chaque page ; absence de débordement des 79 pages à 390, 768 et 1440 px ; images visibles ; absence de requêtes au site d'origine et d'erreurs JavaScript sur les routes représentatives ; menu mobile ; correspondances ES/EN ; services dépliables ; cinq fenêtres de profil, Escape et retour du focus ; onglets Socios/Of Counsel/Asociados ; biographies complètes ; formulaire mailto sans POST ni annonce d'envoi réussi.

Les captures de l'accueil ES/EN, de la firme, de l'équipe, d'un profil et des actualités à ces trois tailles sont dans `verification/redesign/`.

Adaptations nécessaires au périmètre complet : les liens du menu conduisent aux pages originales, ajout de Noticias, accès à toute l'équipe et aux biographies complètes, maintien du champ Cargo, notices légales complètes et contenu du pied de page original. Les contenus des anciens accueils sont consultables dans « Más sobre CAMYA » / « More about CAMYA », sans remplacer le hero du ZIP.

Différences de rédaction à valider : le ZIP annonce « Más de 10 años », tandis que l'ancien accueil évoque des trajectoires professionnelles de plus de 20 ans ; le ZIP regroupe les pratiques en six catégories, tandis que le site actuel présente une liste plus détaillée ; les présentations de la firme et les résumés des profils du ZIP sont nouveaux. Les textes originaux restent conservés aux URL correspondantes. Les traductions héritées, y compris les passages espagnols déjà présents sur les pages anglaises originales, sont conservées sans réécriture.

Limites : montagne provisoire fournie dans le ZIP ; reconnaissances et nouveaux textes à valider avec le cabinet ; aucun service d'envoi réel, recherche WordPress ou traitement serveur ; lancement SEO et redirections du domaine client à traiter séparément. Les deux démonstrations sont noindex, sans changement du WordPress ni des DNS existants.
