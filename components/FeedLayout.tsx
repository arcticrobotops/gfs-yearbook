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

  const handleCollectionChange = useCallback(async (handle: string) => {
    setActiveCollection(handle);
    setLoading(true);

    try {
      const params = handle !== 'all' ? `?collection=${handle}` : '';
      const res = await fetch(`/api/products${params}`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
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

      {/* Yearbook title spread */}
      <div className="bg-cream py-10 sm:py-14 text-center border-b border-gold/20">
        <div className="mx-auto max-w-3xl px-4">
          <p className="font-[family-name:var(--font-display)] text-gold text-xs tracking-[0.4em] uppercase mb-3">
            Neskowin, Oregon
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-varsity-blue text-2xl sm:text-3xl lg:text-4xl italic leading-tight">
            The Coldwater Cowboys of the 45th Parallel
          </h2>
          <div className="mx-auto mt-4 w-16 h-px bg-gold" />
          <p className="font-[family-name:var(--font-body)] text-charcoal/50 text-sm mt-4 tracking-wide">
            A collection of memories, gear, and the things that keep us paddling out.
          </p>
        </div>
      </div>

      {/* Feed */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {loading ? (
          <div className="text-center py-24">
            <div className="inline-flex flex-col items-center gap-5">
              <div className="yearbook-spinner text-gold text-4xl">&#9733;</div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-px bg-gold/40" />
                <p className="font-[family-name:var(--font-display)] text-varsity-blue/50 text-lg italic">
                  Flipping pages...
                </p>
                <div className="w-8 h-px bg-gold/40" />
              </div>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-[family-name:var(--font-display)] text-charcoal/40 text-lg italic">
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
