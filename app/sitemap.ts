import type { MetadataRoute } from 'next';
import { getProducts } from '@/lib/shopify';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.SITE_URL || 'https://ghostforestsurfclub.com';

  const homepageEntry: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ];

  try {
    const { products } = await getProducts(100);

    const productUrls: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${siteUrl}/products/${p.handle}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    return [...homepageEntry, ...productUrls];
  } catch (error) {
    console.error('Failed to fetch products for sitemap, returning minimal sitemap:', error);
    return homepageEntry;
  }
}
