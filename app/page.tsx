import { getProducts, getCollections } from '@/lib/shopify';
import { ShopifyProduct, ShopifyCollection } from '@/types/shopify';
import FeedLayout from '@/components/FeedLayout';
import Footer from '@/components/Footer';
import ErrorBoundary from '@/components/ErrorBoundary';

export const revalidate = 60;

export default async function Home() {
  let products: ShopifyProduct[] = [];
  let collections: ShopifyCollection[] = [];
  let fetchError = false;

  try {
    const [productsData, collectionsData] = await Promise.all([
      getProducts(50),
      getCollections(),
    ]);
    products = productsData.products;
    collections = collectionsData;
    if (products.length === 0) {
      console.warn('[GFS Yearbook] Shopify returned zero products');
    }
  } catch (error) {
    fetchError = true;
    console.error('[GFS Yearbook] Failed to fetch from Shopify:', error);
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
      {fetchError ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px 24px',
            textAlign: 'center',
          }}
        >
          <div style={{ color: '#C9A84C', fontSize: '24px', marginBottom: '16px' }}>&#9733;</div>
          <h2
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: '1.25rem',
              color: '#333333',
              marginBottom: '12px',
              fontStyle: 'italic',
            }}
          >
            The yearbook is warming up
          </h2>
          <p
            style={{
              fontFamily: '"DM Sans", system-ui, sans-serif',
              fontSize: '0.875rem',
              color: '#666666',
              maxWidth: '20rem',
              lineHeight: '1.6',
            }}
          >
            We&apos;re having trouble loading the collection right now. Please refresh to try again.
          </p>
        </div>
      ) : (
        <ErrorBoundary>
          <FeedLayout
            initialProducts={products}
            collections={collections}
          />
        </ErrorBoundary>
      )}
      <Footer />
    </div>
  );
}
