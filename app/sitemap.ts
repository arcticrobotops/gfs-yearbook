import type { MetadataRoute } from 'next';
import { getProducts } from '@/lib/shopify';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.SITE_URL || 'https://ghostforestsurfclub.com';

  const { products } = await getProducts(100);

  const productUrls: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${siteUrl}/products/${p.handle}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...productUrls,
  ];
}
