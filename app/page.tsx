import { getProducts, getCollections } from '@/lib/shopify';
import { ShopifyProduct, ShopifyCollection } from '@/types/shopify';
import FeedLayout from '@/components/FeedLayout';
import Footer from '@/components/Footer';
import ErrorBoundary from '@/components/ErrorBoundary';

export const revalidate = 60;

export default async function Home() {
  let products: ShopifyProduct[] = [];
  let collections: ShopifyCollection[] = [];

  try {
    const [productsData, collectionsData] = await Promise.all([
      getProducts(50),
      getCollections(),
    ]);
    products = productsData.products;
    collections = collectionsData;
  } catch (error) {
    console.error('Failed to fetch from Shopify:', error);
  }

  const siteUrl = process.env.SITE_URL || 'https://ghostforestsurfclub.com';

  const webSiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Ghost Forest Surf Club Yearbook',
    url: siteUrl,
    description: 'A collection of memories, gear, and the things that keep us paddling out.',
    publisher: {
      '@type': 'Organization',
      name: 'Ghost Forest Surf Club',
    },
  };

  return (
    <div className="min-h-screen bg-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd).replace(/</g, '\\u003c') }}
      />
      <ErrorBoundary>
        <FeedLayout
          initialProducts={products}
          collections={collections}
        />
      </ErrorBoundary>
      <Footer />
    </div>
  );
}
