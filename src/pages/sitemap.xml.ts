import pages from '../data/pages.json';
import { siteUrl } from '../data/site';
export function GET() {
  const urls = Object.keys(pages).filter(route => route !== '/en/').map(route => `<url><loc>${siteUrl}${route}</loc></url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {headers: {'Content-Type': 'application/xml; charset=utf-8'}});
}
