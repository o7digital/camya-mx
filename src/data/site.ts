import { isIndexingAllowed } from './indexing-policy.mjs';

export const siteUrl = 'https://www.camya.mx';
export const allowIndexing = isIndexingAllowed(
  import.meta.env.VERCEL_ENV,
  import.meta.env.PUBLIC_ALLOW_INDEXING,
);
