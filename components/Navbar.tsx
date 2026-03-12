import { ShopifyCollection } from '@/types/shopify';

interface NavbarProps {
  collections: ShopifyCollection[];
  activeCollection: string;
  onCollectionChange: (handle: string) => void;
}

export default function Navbar({
  collections,
  activeCollection,
  onCollectionChange,
}: NavbarProps) {

  const filteredCollections = collections.filter(
    (c) => c.handle !== 'frontpage'
  );

  return (
    <nav className="sticky top-0 z-50 bg-varsity-blue shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex items-center justify-between py-4">
          <div className="flex-1" />
          <div className="text-center">
            <span className="font-display text-cream text-sm tracking-[0.15em] sm:tracking-[0.25em] uppercase font-semibold sm:text-base lg:text-lg">
              Ghost Forest Surf Club Annual
            </span>
            <p className="font-display text-gold text-[13px] tracking-[0.15em] uppercase mt-0.5">
              Vol. I
            </p>
          </div>
          <div className="flex-1" />
        </div>

        {/* Gold divider between header and tabs - desktop */}
        <div className="hidden lg:block h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent -mt-1 mb-2" />

        {/* Chapter tabs - desktop */}
        <div className="hidden lg:flex items-center justify-center gap-1 pb-3">
          <button
            onClick={() => onCollectionChange('all')}
            className={`px-4 py-1.5 text-xs tracking-[0.12em] uppercase font-body rounded-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-varsity-blue ${
              activeCollection === 'all'
                ? 'bg-gold text-varsity-blue font-semibold'
                : 'text-cream/70 hover:text-cream hover:bg-cream/10'
            }`}
          >
            All Chapters
          </button>
          {filteredCollections.map((collection) => (
            <button
              key={collection.handle}
              onClick={() => onCollectionChange(collection.handle)}
              className={`px-4 py-1.5 text-xs tracking-[0.12em] uppercase font-body rounded-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-varsity-blue ${
                activeCollection === collection.handle
                  ? 'bg-gold text-varsity-blue font-semibold'
                  : 'text-cream/70 hover:text-cream hover:bg-cream/10'
              }`}
            >
              {collection.title}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile horizontal scrolling pills */}
      <div className="lg:hidden border-t border-cream/10 bg-varsity-blue">
        <div className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory px-4 py-2.5 gap-2 nav-scroll-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
          <button
            onClick={() => onCollectionChange('all')}
            className={`flex-none snap-start min-h-[44px] px-4 py-2.5 text-xs tracking-[0.12em] uppercase font-body rounded-sm whitespace-nowrap transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-varsity-blue ${
              activeCollection === 'all'
                ? 'bg-gold text-varsity-blue font-semibold'
                : 'text-cream/70 hover:text-cream bg-cream/5'
            }`}
          >
            All Chapters
          </button>
          {filteredCollections.map((collection) => (
            <button
              key={collection.handle}
              onClick={() => onCollectionChange(collection.handle)}
              className={`flex-none snap-start min-h-[44px] px-4 py-2.5 text-xs tracking-[0.12em] uppercase font-body rounded-sm whitespace-nowrap transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-varsity-blue ${
                activeCollection === collection.handle
                  ? 'bg-gold text-varsity-blue font-semibold'
                  : 'text-cream/70 hover:text-cream bg-cream/5'
              }`}
            >
              {collection.title}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
