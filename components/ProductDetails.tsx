'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Variant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: { amount: string; currencyCode: string };
}

interface ProductImage {
  url: string;
  altText: string | null;
  width?: number;
  height?: number;
}

interface ProductDetailsProps {
  title: string;
  handle: string;
  description?: string;
  descriptionHtml?: string;
  productType?: string;
  tags: string[];
  collection?: { title: string };
  images: ProductImage[];
  variants: Variant[];
  shopUrl: string;
  superlative: string;
  price: number;
  maxPrice: number;
}

export default function ProductDetails({
  title,
  description,
  descriptionHtml,
  productType,
  tags,
  collection,
  images,
  variants,
  shopUrl,
  superlative,
  price,
  maxPrice,
}: ProductDetailsProps) {
  const heroImage = images[0];
  const extraImages = images.slice(1, 5);
  const [activeImage, setActiveImage] = useState(heroImage);

  // Find first available variant as default
  const firstAvailable = variants.find(v => v.availableForSale);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    firstAvailable || variants[0] || null
  );

  const displayPrice = selectedVariant
    ? parseFloat(selectedVariant.price.amount)
    : price;

  // Build checkout URL with variant ID
  const checkoutUrl = selectedVariant
    ? `${shopUrl}?variant=${selectedVariant.id.split('/').pop()}`
    : shopUrl;

  const canBuy = selectedVariant?.availableForSale ?? false;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-start">
      {/* LEFT: Polaroid image(s) */}
      <div className="flex flex-col items-center gap-6">
        {/* Hero Polaroid */}
        {activeImage && (
          <div className="relative card-rotate-1 transition-transform duration-300 hover:rotate-0 w-full max-w-md">
            <div className="tape-strip" />
            <div className="polaroid-card bg-white p-3 sm:p-4 pb-0 rounded-[2px]">
              <div className="relative aspect-[4/5] overflow-hidden bg-cream">
                <Image
                  src={activeImage.url}
                  alt={activeImage.altText || title}
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

        {/* Extra thumbnails row — clickable */}
        {extraImages.length > 0 && (
          <div className="flex gap-3 justify-center flex-wrap">
            {/* Show hero as first thumbnail when viewing another image */}
            {heroImage && activeImage !== heroImage && (
              <button
                onClick={() => setActiveImage(heroImage)}
                className="polaroid-card bg-white p-1.5 rounded-[2px] w-24 sm:w-28 card-rotate-0 transition-transform duration-300 hover:rotate-0 cursor-pointer ring-2 ring-transparent hover:ring-gold"
              >
                <div className="relative aspect-square overflow-hidden bg-cream">
                  <Image
                    src={heroImage.url}
                    alt={heroImage.altText || `${title} main photo`}
                    fill
                    sizes="112px"
                    className="object-cover yearbook-image"
                  />
                </div>
              </button>
            )}
            {extraImages.map((img, i) => (
              <button
                key={img.url}
                onClick={() => setActiveImage(img)}
                className={`polaroid-card bg-white p-1.5 rounded-[2px] w-24 sm:w-28 card-rotate-${i % 6} transition-transform duration-300 hover:rotate-0 cursor-pointer ring-2 ${
                  activeImage === img ? 'ring-gold' : 'ring-transparent hover:ring-gold/50'
                }`}
              >
                <div className="relative aspect-square overflow-hidden bg-cream">
                  <Image
                    src={img.url}
                    alt={img.altText || `${title} photo ${i + 2}`}
                    fill
                    sizes="112px"
                    className="object-cover yearbook-image"
                  />
                </div>
              </button>
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
                {title}
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

            {productType && (
              <div className="flex gap-2">
                <dt className="font-[family-name:var(--font-display)] text-varsity-blue italic min-w-[90px]">
                  Position:
                </dt>
                <dd className="font-[family-name:var(--font-body)] text-charcoal">
                  {productType}
                </dd>
              </div>
            )}

            <div className="flex gap-2">
              <dt className="font-[family-name:var(--font-display)] text-varsity-blue italic min-w-[90px]">
                Dues:
              </dt>
              <dd className="font-[family-name:var(--font-body)] text-maroon font-semibold">
                ${displayPrice.toFixed(0)}
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
        {description && (
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-varsity-blue italic text-lg mb-2 gold-underline">
              Bio
            </h2>
            <div
              className="font-[family-name:var(--font-body)] text-charcoal/80 text-sm sm:text-base leading-relaxed mt-4 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: descriptionHtml || description }}
            />
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-varsity-blue italic text-sm mb-2">
              Activities
            </h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
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

        {/* Variants — interactive */}
        {variants.length > 1 && (
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-varsity-blue italic text-sm mb-2">
              Options
            </h2>
            <div className="flex flex-wrap gap-2">
              {variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => v.availableForSale && setSelectedVariant(v)}
                  className={`inline-block border text-xs tracking-wide px-3 py-1.5 rounded-sm font-[family-name:var(--font-body)] transition-all min-h-[36px] ${
                    !v.availableForSale
                      ? 'border-charcoal/15 text-charcoal/40 line-through cursor-not-allowed'
                      : selectedVariant?.id === v.id
                      ? 'border-varsity-blue bg-varsity-blue text-cream'
                      : 'border-varsity-blue/30 text-varsity-blue hover:border-varsity-blue cursor-pointer'
                  }`}
                  disabled={!v.availableForSale}
                >
                  {v.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* CTA — sticky on mobile */}
        <div className="hidden md:block">
          <a
            href={checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-block w-full text-center font-[family-name:var(--font-display)] tracking-[0.2em] uppercase text-sm py-3.5 px-8 rounded-sm transition-colors shadow-sm hover:shadow-md ${
              canBuy
                ? 'bg-maroon hover:bg-maroon/90 text-cream'
                : 'bg-charcoal/20 text-charcoal/50 cursor-not-allowed pointer-events-none'
            }`}
          >
            {canBuy ? `Claim Yours — $${displayPrice.toFixed(0)}` : 'Sold Out'}
          </a>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-cream/95 backdrop-blur-sm border-t border-gold/20 px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
        <a
          href={checkoutUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`block w-full text-center font-[family-name:var(--font-display)] tracking-[0.2em] uppercase text-sm py-3.5 rounded-sm transition-colors shadow-sm ${
            canBuy
              ? 'bg-maroon hover:bg-maroon/90 text-cream'
              : 'bg-charcoal/20 text-charcoal/50 cursor-not-allowed pointer-events-none'
          }`}
        >
          {canBuy ? `Claim Yours — $${displayPrice.toFixed(0)}` : 'Sold Out'}
        </a>
      </div>
    </div>
  );
}
