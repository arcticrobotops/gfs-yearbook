import Image from 'next/image';
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

const annotations = [
  { text: 'Staff Pick', rotation: '-rotate-6' },
  { text: 'Classic', rotation: 'rotate-3' },
  { text: 'Fan Favorite', rotation: '-rotate-3' },
  { text: 'Essential', rotation: 'rotate-6' },
  { text: 'New Drop', rotation: '-rotate-2' },
  { text: 'Club Approved', rotation: 'rotate-4' },
];

export default function ProductCard({ product, index }: ProductCardProps) {
  const image = product.images.edges[0]?.node;
  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const maxPrice = parseFloat(product.priceRange.maxVariantPrice.amount);
  const rotationClass = rotations[index % rotations.length];
  const annotation = annotations[index % annotations.length];

  const linkUrl = product.onlineStoreUrl || `https://ghostforestsurfclub.com/products/${product.handle}`;

  return (
    <a
      href={linkUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`group block ${rotationClass} transition-all duration-300 ease-out hover:scale-105 hover:rotate-0`}
    >
      <div className="relative polaroid-card bg-white p-3 sm:p-4 pb-0 rounded-[2px]">
        {/* Hover annotation badge */}
        <div
          className={`absolute -top-3 -right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${annotation.rotation}`}
        >
          <span className="inline-block bg-maroon text-cream font-[family-name:var(--font-display)] text-[10px] tracking-[0.15em] uppercase px-2.5 py-1 rounded-sm shadow-sm">
            {annotation.text}
          </span>
        </div>

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
              <span className="text-charcoal/30 font-[family-name:var(--font-display)] text-lg italic">
                No Photo
              </span>
            </div>
          )}
        </div>

        {/* Caption area (thick Polaroid bottom strip) */}
        <div className="pt-4 pb-5 sm:pt-5 sm:pb-6 text-center">
          <h3 className="font-[family-name:var(--font-display)] text-charcoal text-sm sm:text-base italic leading-tight line-clamp-2">
            {product.title}
          </h3>
          <p className="font-[family-name:var(--font-body)] text-charcoal/60 text-xs sm:text-sm mt-1.5 tracking-wide">
            {price === maxPrice
              ? `$${price.toFixed(0)}`
              : `$${price.toFixed(0)} - $${maxPrice.toFixed(0)}`}
          </p>
        </div>
      </div>
    </a>
  );
}
