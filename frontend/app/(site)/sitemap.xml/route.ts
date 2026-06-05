import sitemap from '@/app/sitemap-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  
const data = await sitemap();

console.log(
  data.filter(x => x.url.toLowerCase().includes('insight')).slice(0, 10)
)

  const urls = (data || []).map(item => `
    <url>
      <loc>${item.url}</loc>
      <changefreq>${item.changeFrequency ?? 'weekly'}</changefreq>
      <priority>${item.priority ?? 0.5}</priority>
    </url>
  `).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls}
  </urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}