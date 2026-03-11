'use client';

import { useState } from 'react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <h1 className="font-[family-name:var(--font-display)] text-cream text-sm tracking-[0.25em] uppercase font-semibold sm:text-base lg:text-lg">
              Ghost Forest Surf Club Annual
            </h1>
            <p className="font-[family-name:var(--font-display)] text-gold text-xs tracking-[0.15em] uppercase mt-0.5">
              Vol. I
            </p>
          </div>
          <div className="flex-1 flex justify-end">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-cream p-2 hover:text-gold transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Chapter tabs - desktop */}
        <div className="hidden lg:flex items-center justify-center gap-1 pb-3 -mt-1">
          <button
            onClick={() => onCollectionChange('all')}
            className={`px-4 py-1.5 text-xs tracking-[0.12em] uppercase font-[family-name:var(--font-body)] rounded-sm transition-all duration-200 ${
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
              className={`px-4 py-1.5 text-xs tracking-[0.12em] uppercase font-[family-name:var(--font-body)] rounded-sm transition-all duration-200 ${
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

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-cream/10 bg-varsity-blue">
          <div className="px-4 py-3 space-y-1">
            <button
              onClick={() => {
                onCollectionChange('all');
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 text-sm tracking-[0.1em] uppercase font-[family-name:var(--font-body)] rounded-sm transition-all ${
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
                onClick={() => {
                  onCollectionChange(collection.handle);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 text-sm tracking-[0.1em] uppercase font-[family-name:var(--font-body)] rounded-sm transition-all ${
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
      )}
    </nav>
  );
}
