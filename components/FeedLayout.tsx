'use client';

import { useState, useCallback } from 'react';
import { ShopifyProduct, ShopifyCollection } from '@/types/shopify';
import Navbar from './Navbar';
import ProductCard from './ProductCard';
import EditorialCard, { getEditorialByIndex } from './EditorialCard';
import TextMoment from './TextMoment';

interface FeedLayoutProps {
  initialProducts: ShopifyProduct[];
  collections: ShopifyCollection[];
}

export default function FeedLayout({
  initialProducts,
  collections,
}: FeedLayoutProps) {
  const [products, setProducts] = useState<ShopifyProduct[]>(initialProducts);
  const [activeCollection, setActiveCollection] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleCollectionChange = useCallback(async (handle: string) => {
    setActiveCollection(handle);
    setLoading(true);

    try {
      setError(false);
      const params = handle !== 'all' ? `?collection=${handle}` : '';
      const res = await fetch(`/api/products${params}`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // Build interleaved feed: editorial every 4 products, text moment every 7
  const feedItems: Array<
    | { type: 'product'; product: ShopifyProduct; productIndex: number }
    | { type: 'editorial'; editorialIndex: number }
    | { type: 'text-moment'; momentIndex: number }
  > = [];

  let editorialCount = 0;
  let momentCount = 0;

  products.forEach((product, i) => {
    // Insert editorial before every 4th product (indices 3, 7, 11...)
    if (i > 0 && i % 4 === 3) {
      feedItems.push({ type: 'editorial', editorialIndex: editorialCount });
      editorialCount++;
    }

    // Insert text moment before every 7th product (indices 6, 13, 20...)
    if (i > 0 && i % 7 === 6) {
      feedItems.push({ type: 'text-moment', momentIndex: momentCount });
      momentCount++;
    }

    feedItems.push({ type: 'product', product, productIndex: i });
  });

  return (
    <>
      <Navbar
        collections={collections}
        activeCollection={activeCollection}
        onCollectionChange={handleCollectionChange}
      />

      {/* Hero section with first product image */}
      {products.length > 0 && products[0].images.edges[0]?.node && (
        <div className="relative h-[60vh] sm:h-[70vh] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${products[0].images.edges[0].node.url})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-varsity-blue/60 via-varsity-blue/40 to-cream" />
          <div className="relative h-full flex items-end justify-center pb-12 sm:pb-16 px-4">
            <div className="text-center">
              <p className="font-display text-gold text-xs tracking-[0.4em] uppercase mb-3 drop-shadow-sm">
                Neskowin, Oregon
              </p>
              <h2 className="font-display text-cream text-3xl sm:text-4xl lg:text-5xl italic leading-tight drop-shadow-md">
                The Coldwater Cowboys<br className="hidden sm:block" /> of the 45th Parallel
              </h2>
              <div className="flex items-center justify-center gap-3 sm:gap-4 mt-4">
                <span className="text-gold text-sm sm:text-base drop-shadow-sm">&#9733;</span>
                <div className="w-8 sm:w-12 h-px bg-gold/60" />
                <span className="font-display text-gold text-xs tracking-[0.3em] uppercase drop-shadow-sm">
                  Vol. I
                </span>
                <div className="w-8 sm:w-12 h-px bg-gold/60" />
                <span className="text-gold text-sm sm:text-base drop-shadow-sm">&#9733;</span>
              </div>
              <p className="font-body text-cream/80 text-sm mt-5 tracking-wide drop-shadow-sm">
                A collection of memories, gear, and the things that keep us paddling out.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Feed */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {error ? (
          <div className="text-center py-20" role="alert">
            <p className="font-display text-maroon text-lg italic mb-3">
              Something went wrong loading this chapter.
            </p>
            <button
              onClick={() => handleCollectionChange(activeCollection)}
              className="font-body text-varsity-blue text-sm underline underline-offset-2 hover:text-maroon transition-colors min-h-[44px] min-w-[44px] px-4 py-2"
            >
              Try again
            </button>
          </div>
        ) : loading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10"
            aria-busy="true"
            aria-label="Loading products"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={`skeleton-${i}`} className={`card-rotate-${i % 6}`} aria-hidden="true">
                <div className="polaroid-card bg-white p-3 sm:p-4 pb-0 rounded-[2px]">
                  <div className="aspect-square bg-charcoal/10 animate-pulse rounded-sm" />
                  <div className="pt-4 pb-5 sm:pt-5 sm:pb-6 flex flex-col items-center gap-2.5">
                    <div className="h-4 w-3/4 bg-charcoal/10 animate-pulse rounded-sm" />
                    <div className="h-3 w-1/3 bg-charcoal/10 animate-pulse rounded-sm" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-display text-charcoal/40 text-lg italic">
              This chapter is still being written.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {feedItems.map((item, i) => {
              if (item.type === 'product') {
                return (
                  <div key={`product-${item.product.id}`} className="flex">
                    <div className="w-full">
                      <ProductCard
                        product={item.product}
                        index={item.productIndex}
                      />
                    </div>
                  </div>
                );
              }

              if (item.type === 'editorial') {
                const editorial = getEditorialByIndex(item.editorialIndex);
                return (
                  <div
                    key={`editorial-${item.editorialIndex}`}
                    className="sm:col-span-2 flex"
                  >
                    <div className="w-full">
                      <EditorialCard
                        imageUrl={editorial.imageUrl}
                        alt={editorial.alt}
                        caption={editorial.caption}
                        index={editorial.index}
                      />
                    </div>
                  </div>
                );
              }

              if (item.type === 'text-moment') {
                return (
                  <div key={`moment-${item.momentIndex}`} className="flex items-center">
                    <div className="w-full">
                      <TextMoment index={item.momentIndex} />
                    </div>
                  </div>
                );
              }

              return null;
            })}
          </div>
        )}
      </main>
    </>
  );
}
