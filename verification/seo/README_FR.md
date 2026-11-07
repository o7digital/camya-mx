# Préparation SEO sur dev

Ces changements sont préparés sur `dev`. Ils ne doivent pas être déployés en production dans cette tâche. La prévisualisation Vercel reste bloquée à l’indexation ; la production existante et ses paramètres ne sont pas modifiés.

## Dix groupes de mots-clés locaux

Il s’agit de pistes de ciblage fondées sur les services effectivement présentés par CAMYA, sans volumes de recherche mesurés. Utiliser naturellement « CDMX » ou « en Ciudad de México » à la fin des expressions, plutôt que répéter systématiquement « México CDMX ». « Bosques de las Lomas » est une variante pertinente pour le contact et les bureaux.

| Groupe | Expression principale | Expressions associées |
| --- | --- | --- |
| 1. Cabinet et marque | despacho de abogados CDMX | firma de abogados Ciudad de México ; CAMYA Abogados CDMX |
| 2. Entreprises et contrats | abogados corporativos CDMX | asesoría legal para empresas CDMX ; contratos mercantiles Ciudad de México |
| 3. Contentieux civil | abogados litigio civil CDMX | litigio civil Ciudad de México ; cumplimiento de contratos CDMX |
| 4. Contentieux commercial et arbitrage | abogados litigio mercantil CDMX | arbitraje comercial Ciudad de México ; ejecución de laudos arbitrales CDMX |
| 5. Fiscalité et contentieux fiscal | abogados fiscales CDMX | litigio fiscal Ciudad de México ; impugnación de créditos fiscales CDMX |
| 6. Droit administratif et amparo | abogados derecho administrativo CDMX | juicio de amparo Ciudad de México ; contrataciones públicas CDMX |
| 7. Procédures collectives et restructuration | abogados concursos mercantiles CDMX | reestructuración empresarial Ciudad de México ; litigio concursal CDMX |
| 8. Droit immobilier et foncier | abogados inmobiliarios CDMX | derecho inmobiliario Ciudad de México ; regularización territorial CDMX |
| 9. Énergie et environnement | abogados derecho energético CDMX | derecho ambiental Ciudad de México ; regulación energética CDMX |
| 10. Conformité et anticorruption | compliance empresarial CDMX | políticas de integridad Ciudad de México ; asesoría anticorrupción CDMX |

L’accueil cible le cabinet et l’accompagnement des entreprises ; la page des pratiques présente les spécialités ; les profils sont décrits selon leur contenu. Les métadonnées anglaises sont rédigées en anglais avec « Mexico City (CDMX) ». Les titres et descriptions d’articles historiques respectent leur sujet et leur époque au lieu de recevoir un suffixe local artificiel.

Les dix groupes sont centralisés dans `src/data/keyword-groups.json`, avec une expression principale et deux variantes par langue. À la demande du client, les dix expressions principales figurent dans une balise `meta keywords` et dans le pied de page des 79 routes. Les variantes restent une réserve éditoriale. Le bloc visible reprend la dernière capture de Jean Louis David : sous le copyright, texte gris discret de 11 px, points médians et trois paragraphes qui peuvent se replier sur mobile. Seul ce bloc est ajouté ; les contenus, en-têtes, images et coordonnées existants sont conservés.

La balise `meta keywords` reproduit le modèle demandé ; [Google précise qu’elle n’a aucun effet sur l’indexation ou le classement](https://developers.google.com/search/docs/crawling-indexing/special-tags#unsupported). Elle ne remplace pas les titres, descriptions et contenus ciblés.

## Indexation et sitemap

- Vercel Preview : toujours `noindex,nofollow` et `Disallow: /`, y compris si `PUBLIC_ALLOW_INDEXING=true`.
- Vercel Production, lors d’une future publication autorisée : `index,follow` et `Allow: /` par défaut ; `PUBLIC_ALLOW_INDEXING=false` reste un interrupteur explicite de désactivation.
- Local : `noindex` par défaut ; activation explicite possible pour les vérifications.
- Le sitemap contient les 76 pages canoniques parmi les 79 routes conservées. `/en/`, `/category/sin-categoria-es/page/1/` et `/staff-category/asociados/page/1/` restent accessibles mais désignent respectivement `/en/home/`, `/category/sin-categoria-es/` et `/staff-category/asociados/` comme URL canonique.

## Point 2 : Search Console, après la publication en production

La soumission n’est pas effectuée depuis une prévisualisation : Google doit d’abord pouvoir explorer la version corrigée sur le domaine de production. GSC Wizard a également renvoyé `payment_required` / `subscription_required` lors du diagnostic ; aucune soumission ni inspection Google n’a donc pu être faite par ce connecteur.

1. Après une future publication de `main`, vérifier sur `https://www.camya.mx/robots.txt` la présence de `Allow: /`, et vérifier l’absence de `noindex` dans les pages prioritaires et les en-têtes HTTP.
2. Dans la propriété Search Console du domaine, soumettre `https://www.camya.mx/sitemap.xml`. Cette opération peut être faite directement dans Search Console, ou via GSC Wizard une fois son accès rétabli.
3. Inspecter l’accueil, `/areas-de-practica/`, `/contacto/`, `/equipo/` et `/en/home/` ; lancer un test en direct et demander l’indexation si nécessaire.
4. Vérifier ensuite le rapport d’indexation et comparer les performances sur des périodes complètes. La soumission ne garantit ni un délai d’indexation ni une position.

Références : [titres Google](https://developers.google.com/search/docs/appearance/title-link), [descriptions](https://developers.google.com/search/docs/appearance/snippet), [création et soumission du sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [blocage avec noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing).

## Vérifications initiales, avant l’ajout du bloc de mots-clés

- Builds sous Node 24 : local par défaut, `VERCEL_ENV=production`, puis `VERCEL_ENV=preview PUBLIC_ALLOW_INDEXING=true`. Les trois passent avec les directives d’indexation attendues.
- Vérification des 79 routes, des 76 URL canoniques du sitemap, des titres et descriptions uniques par page canonique, des balises de partage cohérentes et d’un H1 par page.
- `npm test` : 29 tests réussis ; configuration iPhone Safari : 7 tests réussis.
- Comparaison du build de `dev` avant changement (`dfae75d`) avec le build après changement : 18 routes à 390 et 1440 pixels, soit 36 comparaisons de captures pleine page strictement identiques au pixel près. Résultats : `visual-report.json`.
- Aucun style ni asset modifié ; les 207 assets suivis par le contrôle de conservation sont identiques. Seules les références DOM des 12 articles ayant reçu un H1 accessible sont mises à jour, à partir du build vérifié d’avant modification.

## Ajout des mots-clés au pied de page

Les contrôles du build et le test du pied de page vérifient les dix expressions de la bonne langue sur chacune des 79 routes, ainsi que leur présence dans les métadonnées. Les références DOM de `footer-bottom` ont été mises à jour en vérifiant que retirer le seul bloc ajouté redonne exactement la référence précédente. Les régions `main`, `site-header` et `footer`, ainsi que les 207 assets suivis, conservent leurs références précédentes.

Build et 29 tests fonctionnels réussis ; 7 tests iPhone Safari réussis après l’ajustement d’espacement mobile. Le contrôle visuel des accueils ES/EN à 320, 390 et 1440 px confirme dix expressions, trois paragraphes, aucune sortie horizontale et aucun texte recouvert par le bouton de retour en haut. Résultats : `footer-check.json`.
