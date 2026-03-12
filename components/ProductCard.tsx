import Image from 'next/image';
import Link from 'next/link';
import { ShopifyProduct } from '@/types/shopify';

interface ProductCardProps {
  product: ShopifyProduct;
  index: number;
}

const rotations = [
  'card-rotate-0',
  'card-rotate-1',
  'card-rotate-2',
  'card-rotate-3',
  'card-rotate-4',
  'card-rotate-5',
];

// Map product tags to display badges
const tagBadgeMap: Record<string, string> = {
  'staff-pick': 'Staff Pick',
  'new': 'New Drop',
  'bestseller': 'Fan Favorite',
  'classic': 'Classic',
  'essential': 'Essential',
  'limited': 'Limited',
};

const badgeRotations = ['-rotate-6', 'rotate-3', '-rotate-3', 'rotate-6', '-rotate-2', 'rotate-4'];

export default function ProductCard({ product, index }: ProductCardProps) {
  const image = product.images.edges[0]?.node;
  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const maxPrice = parseFloat(product.priceRange.maxVariantPrice.amount);
  const rotationClass = rotations[index % rotations.length];

  // Only show badge if product has a matching tag
  const matchedTag = product.tags.find(t => t.toLowerCase() in tagBadgeMap);
  const badgeText = matchedTag ? tagBadgeMap[matchedTag.toLowerCase()] : null;
  const badgeRotation = badgeRotations[index % badgeRotations.length];

  return (
    <Link
      href={`/products/${product.handle}`}
      aria-label={`View ${product.title} — ${price === maxPrice ? `$${price.toFixed(0)}` : `$${price.toFixed(0)} to $${maxPrice.toFixed(0)}`}`}
      className={`group block min-h-[44px] ${rotationClass} transition-[transform] duration-300 ease-out hover:scale-105 hover:rotate-0`}
    >
      <div className="relative polaroid-card bg-white p-3 sm:p-4 pb-0 rounded-[2px]">
        {/* Hover annotation badge — only shown for tagged products */}
        {badgeText && (
          <div
            className={`absolute -top-3 -right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${badgeRotation}`}
          >
            <span className="inline-block bg-maroon text-cream font-display text-xs tracking-[0.15em] uppercase px-2.5 py-1 rounded-sm shadow-sm">
              {badgeText}
            </span>
          </div>
        )}

        {/* Polaroid image area */}
        <div className="relative aspect-square overflow-hidden bg-cream">
          {image ? (
            <Image
              src={image.url}
              alt={image.altText || product.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover yearbook-image"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-cream">
              <span className="text-charcoal/30 font-display text-lg italic">
                No Photo
              </span>
            </div>
          )}
        </div>

        {/* Caption area (thick Polaroid bottom strip) */}
        <div className="pt-4 pb-5 sm:pt-5 sm:pb-6 px-3 text-center">
          <h3 className="font-display text-charcoal text-sm sm:text-base italic leading-tight line-clamp-2">
            {product.title}
          </h3>
          <p
            className="font-body text-charcoal/60 text-[13px] sm:text-sm mt-1.5 tracking-wide"
            aria-label={
              price === maxPrice
                ? `Price: $${price.toFixed(0)}`
                : `Price: $${price.toFixed(0)} to $${maxPrice.toFixed(0)}`
            }
          >
            {price === maxPrice
              ? `$${price.toFixed(0)}`
              : `$${price.toFixed(0)} – $${maxPrice.toFixed(0)}`}
          </p>
        </div>
      </div>
    </Link>
  );
}
