import { allowIndexing, siteUrl } from '../data/site';
export function GET() {
  return new Response(`User-agent: *\n${allowIndexing ? 'Allow: /' : 'Disallow: /'}\nSitemap: ${siteUrl}/sitemap.xml\n`, {headers: {'Content-Type': 'text/plain; charset=utf-8'}});
}
