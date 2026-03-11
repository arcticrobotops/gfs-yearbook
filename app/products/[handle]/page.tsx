import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getProductByHandle, getProducts } from '@/lib/shopify';

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
  const heroImage = images[0];
  const extraImages = images.slice(1, 5);
  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const maxPrice = parseFloat(product.priceRange.maxVariantPrice.amount);
  const collection = product.collections.edges[0]?.node;
  const superlative = superlatives[hashIndex(product.handle) % superlatives.length];
  const shopUrl =
    product.onlineStoreUrl ||
    `https://ghostforestsurfclub.com/products/${product.handle}`;

  return (
    <main className="min-h-screen bg-cream">
      {/* Back nav */}
      <div className="max-w-5xl mx-auto px-4 pt-6 pb-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-varsity-blue/70 hover:text-varsity-blue text-sm font-[family-name:var(--font-body)] tracking-wide transition-colors"
        >
          <span className="text-lg leading-none">&larr;</span>
          Back to Yearbook
        </Link>
      </div>

      <article className="max-w-5xl mx-auto px-4 pb-20">
        {/* Header strip */}
        <div className="text-center mb-8">
          <p className="font-[family-name:var(--font-display)] text-gold tracking-[0.25em] uppercase text-xs sm:text-sm mb-1">
            Member Profile
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-varsity-blue text-3xl sm:text-4xl md:text-5xl italic leading-tight">
            {product.title}
          </h1>
          <hr className="yearbook-divider max-w-xs mx-auto mt-4" />
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-start">
          {/* LEFT: Polaroid image(s) */}
          <div className="flex flex-col items-center gap-6">
            {/* Hero Polaroid */}
            {heroImage && (
              <div className="relative card-rotate-1 transition-transform duration-300 hover:rotate-0 w-full max-w-md">
                <div className="tape-strip" />
                <div className="polaroid-card bg-white p-3 sm:p-4 pb-0 rounded-[2px]">
                  <div className="relative aspect-[4/5] overflow-hidden bg-cream">
                    <Image
                      src={heroImage.url}
                      alt={heroImage.altText || product.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover yearbook-image"
                      priority
                    />
                  </div>
                  <div className="py-4 sm:py-5 text-center">
                    <p className="font-[family-name:var(--font-display)] text-charcoal/50 text-xs italic">
                      Official Club Photo
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Extra thumbnails row */}
            {extraImages.length > 0 && (
              <div className="flex gap-3 justify-center flex-wrap">
                {extraImages.map((img, i) => (
                  <div
                    key={img.url}
                    className={`polaroid-card bg-white p-1.5 rounded-[2px] w-24 sm:w-28 card-rotate-${i % 6} transition-transform duration-300 hover:rotate-0`}
                  >
                    <div className="relative aspect-square overflow-hidden bg-cream">
                      <Image
                        src={img.url}
                        alt={img.altText || `${product.title} photo ${i + 2}`}
                        fill
                        sizes="112px"
                        className="object-cover yearbook-image"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Yearbook entry details */}
          <div className="space-y-6">
            {/* Info card */}
            <div className="border border-gold/30 rounded-sm p-5 sm:p-6 bg-white/60">
              <dl className="space-y-3 text-sm sm:text-base">
                <div className="flex gap-2">
                  <dt className="font-[family-name:var(--font-display)] text-varsity-blue italic min-w-[90px]">
                    Name:
                  </dt>
                  <dd className="font-[family-name:var(--font-body)] text-charcoal font-medium">
                    {product.title}
                  </dd>
                </div>

                {collection && (
                  <div className="flex gap-2">
                    <dt className="font-[family-name:var(--font-display)] text-varsity-blue italic min-w-[90px]">
                      Club:
                    </dt>
                    <dd className="font-[family-name:var(--font-body)] text-charcoal">
                      {collection.title}
                    </dd>
                  </div>
                )}

                {product.productType && (
                  <div className="flex gap-2">
                    <dt className="font-[family-name:var(--font-display)] text-varsity-blue italic min-w-[90px]">
                      Position:
                    </dt>
                    <dd className="font-[family-name:var(--font-body)] text-charcoal">
                      {product.productType}
                    </dd>
                  </div>
                )}

                <div className="flex gap-2">
                  <dt className="font-[family-name:var(--font-display)] text-varsity-blue italic min-w-[90px]">
                    Dues:
                  </dt>
                  <dd className="font-[family-name:var(--font-body)] text-maroon font-semibold">
                    {price === maxPrice
                      ? `$${price.toFixed(0)}`
                      : `$${price.toFixed(0)} \u2013 $${maxPrice.toFixed(0)}`}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Superlative */}
            <div className="bg-varsity-blue/5 border-l-4 border-gold px-4 py-3 rounded-r-sm">
              <p className="font-[family-name:var(--font-display)] text-varsity-blue italic text-sm sm:text-base">
                &ldquo;{superlative}&rdquo;
              </p>
            </div>

            {/* Bio / Description */}
            {product.description && (
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-varsity-blue italic text-lg mb-2 gold-underline">
                  Bio
                </h2>
                <div
                  className="font-[family-name:var(--font-body)] text-charcoal/80 text-sm sm:text-base leading-relaxed mt-4 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.descriptionHtml || product.description }}
                />
              </div>
            )}

            {/* Tags */}
            {product.tags.length > 0 && (
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-varsity-blue italic text-sm mb-2">
                  Activities
                </h2>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block bg-gold/15 text-varsity-blue text-xs tracking-wide px-2.5 py-1 rounded-sm font-[family-name:var(--font-body)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Variants */}
            {product.variants.edges.length > 1 && (
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-varsity-blue italic text-sm mb-2">
                  Options
                </h2>
                <div className="flex flex-wrap gap-2">
                  {product.variants.edges.map(({ node: v }) => (
                    <span
                      key={v.id}
                      className={`inline-block border text-xs tracking-wide px-2.5 py-1 rounded-sm font-[family-name:var(--font-body)] ${
                        v.availableForSale
                          ? 'border-varsity-blue/30 text-varsity-blue'
                          : 'border-charcoal/15 text-charcoal/40 line-through'
                      }`}
                    >
                      {v.title}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <a
              href={shopUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full text-center bg-maroon hover:bg-maroon/90 text-cream font-[family-name:var(--font-display)] tracking-[0.2em] uppercase text-sm py-3.5 px-8 rounded-sm transition-colors shadow-sm hover:shadow-md"
            >
              Claim Yours
            </a>
          </div>
        </div>
      </article>
    </main>
  );
}
