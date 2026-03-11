export default function Footer() {
  return (
    <footer className="bg-varsity-blue text-cream mt-16">
      {/* Gold accent line */}
      <div className="h-1 bg-gold" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center space-y-6">
          {/* Publisher */}
          <div>
            <p className="font-[family-name:var(--font-display)] text-lg sm:text-xl tracking-[0.15em] uppercase">
              Published by Ghost Forest Surf Club
            </p>
          </div>

          {/* Location and volume */}
          <div className="flex items-center justify-center gap-3 text-cream/60">
            <span className="font-[family-name:var(--font-body)] text-sm tracking-[0.1em] uppercase">
              Neskowin, Oregon
            </span>
            <span className="text-gold">&#8226;</span>
            <span className="font-[family-name:var(--font-body)] text-sm tracking-[0.1em] uppercase">
              Volume I
            </span>
            <span className="text-gold">&#8226;</span>
            <span className="font-[family-name:var(--font-body)] text-sm tracking-[0.1em] uppercase">
              2024
            </span>
          </div>

          {/* Tagline */}
          <div className="pt-2">
            <p className="font-[family-name:var(--font-display)] text-gold text-sm italic tracking-wide">
              &#9733; Coldwater Cowboys &#9733; 45th Parallel &#9733;
            </p>
          </div>

          {/* Decorative divider */}
          <div className="pt-4">
            <div className="mx-auto w-24 h-px bg-gold/40" />
          </div>

          {/* Fine print */}
          <div className="pt-2">
            <p className="font-[family-name:var(--font-body)] text-cream/30 text-xs tracking-wider uppercase">
              Ghost Forest Surf Club &copy; {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
