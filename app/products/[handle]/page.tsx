import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getProductByHandle, getProducts } from '@/lib/shopify';
import ProductDetails from '@/components/ProductDetails';
import ErrorBoundary from '@/components/ErrorBoundary';
import PDPSkeleton from '@/components/PDPSkeleton';

export const revalidate = 60;

// --- Static params for ISR ---
export async function generateStaticParams() {
  const { products } = await getProducts(100);
  return products.map((p) => ({ handle: p.handle }));
}

// --- SEO metadata ---
export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  if (!product) return { title: 'Member Not Found' };

  const image = product.images.edges[0]?.node;
  return {
    title: `${product.title} — GFS Yearbook`,
    description: product.description?.slice(0, 160) || `Check out ${product.title} from Ghost Forest Surf Club.`,
    openGraph: {
      title: product.title,
      description: product.description?.slice(0, 160),
      images: image ? [{ url: image.url, width: image.width, height: image.height }] : [],
    },
  };
}

// --- Superlatives assigned by index hash ---
const superlatives = [
  'Most Likely to Paddle Out at Dawn',
  'Best Nose Rider',
  'Most Likely to Share Their Wax',
  'Best Post-Session Storyteller',
  'Most Stoked at All Times',
  'Best Board Collection',
  'Most Likely to Find the Secret Spot',
  'Best Wetsuit Tan Lines',
  'Most Likely to Go Bigger',
  'Best Shaka Form',
  'Most Likely to Live in a Van',
  'Best Barrel Stance',
];

function hashIndex(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

// --- Page ---
export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  if (!product) notFound();

  const images = product.images.edges.map((e) => e.node);
  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const maxPrice = parseFloat(product.priceRange.maxVariantPrice.amount);
  const collection = product.collections.edges[0]?.node;
  const superlative = superlatives[hashIndex(product.handle) % superlatives.length];
  const shopUrl =
    product.onlineStoreUrl ||
    `https://ghostforestsurfclub.com/products/${product.handle}`;

  const variants = product.variants.edges.map(({ node }) => ({
    id: node.id,
    title: node.title,
    availableForSale: node.availableForSale,
    price: node.price,
  }));

  // Fetch related products (same collection, or all products as fallback)
  const collectionHandle = collection?.handle;
  const { products: allRelated } = await getProducts(
    20,
    undefined,
    collectionHandle || undefined
  );
  const relatedProducts = allRelated
    .filter((p) => p.handle !== handle)
    .slice(0, 4)
    .map((p) => ({
      handle: p.handle,
      title: p.title,
      price: parseFloat(p.priceRange.minVariantPrice.amount),
      imageUrl: p.images.edges[0]?.node.url || null,
      imageAlt: p.images.edges[0]?.node.altText || null,
    }));

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: images[0]?.url,
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: price.toFixed(2),
      highPrice: maxPrice.toFixed(2),
      priceCurrency: product.priceRange.minVariantPrice.currencyCode || 'USD',
      availability: variants.some(v => v.availableForSale)
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <main className="min-h-screen bg-cream pb-20 md:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Back nav */}
      <div className="max-w-5xl mx-auto px-4 pt-6 pb-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-varsity-blue/70 hover:text-varsity-blue text-sm font-body tracking-wide transition-colors min-h-[44px]"
        >
          <span className="text-lg leading-none">&larr;</span>
          Back to Yearbook
        </Link>
      </div>

      <article className="max-w-5xl mx-auto px-4 pb-20">
        {/* Header strip */}
        <div className="text-center mb-8">
          <p className="font-display text-gold tracking-[0.25em] uppercase text-xs sm:text-sm mb-1">
            Member Profile
          </p>
          <h1 className="font-display text-varsity-blue text-3xl sm:text-4xl md:text-5xl italic leading-tight">
            {product.title}
          </h1>
          <hr className="yearbook-divider max-w-xs mx-auto mt-4" />
        </div>

        <ErrorBoundary>
          <ProductDetails
            title={product.title}
            handle={product.handle}
            description={product.description}
            descriptionHtml={product.descriptionHtml}
            productType={product.productType}
            tags={product.tags}
            collection={collection ? { title: collection.title } : undefined}
            images={images}
            variants={variants}
            shopUrl={shopUrl}
            superlative={superlative}
            price={price}
            maxPrice={maxPrice}
            relatedProducts={relatedProducts}
          />
        </ErrorBoundary>
      </article>
    </main>
  );
}
