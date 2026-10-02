export const siteUrl = 'https://www.camya.mx';
// Enable only in the production build after the domain has switched to Vercel.
export const allowIndexing = import.meta.env.PUBLIC_ALLOW_INDEXING === 'true'
  && import.meta.env.VERCEL_ENV !== 'preview';
