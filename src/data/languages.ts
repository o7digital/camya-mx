import routes from './language-routes.json';

export type Language = 'es' | 'en' | 'fr';
export const languageTags = { es: 'es-MX', en: 'en-US', fr: 'fr-FR' };
export const languageLabels = { es: 'ESP', en: 'ENG', fr: 'FR' };

export function languageForPath(path: string): Language {
  return path.startsWith('/fr/') ? 'fr' : path.startsWith('/en/') ? 'en' : 'es';
}

export function alternatesForPath(path: string): { language: Language; path: string }[] {
  const group = routes.find(group => group.es === path || group.en === path || group.fr === path || group.aliases?.includes(path));
  if (!group) throw new Error(`Missing translation group: ${path}`);
  return (['es', 'en', 'fr'] as const)
    .flatMap(language => group[language] ? [{ language, path: group[language] }] : []);
}
