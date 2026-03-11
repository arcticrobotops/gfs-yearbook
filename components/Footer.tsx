export default function Footer() {
  return (
    <footer className="bg-varsity-blue text-cream mt-16">
      {/* Gold accent line */}
      <div className="h-1 bg-gold" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center space-y-6">
          {/* Gold seal emblem */}
          <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-gold/60 flex items-center justify-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border border-gold/30 flex items-center justify-center">
              <span className="text-gold text-2xl sm:text-3xl">&#9733;</span>
            </div>
          </div>

          {/* Publisher */}
          <div>
            <p className="font-display text-lg sm:text-xl tracking-[0.15em] uppercase">
              Published by Ghost Forest Surf Club
            </p>
          </div>

          {/* Location and volume */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-cream/60">
            <span className="font-body text-xs sm:text-sm tracking-[0.1em] uppercase">
              Neskowin, Oregon
            </span>
            <span className="text-gold">&#8226;</span>
            <span className="font-body text-xs sm:text-sm tracking-[0.1em] uppercase">
              Volume I
            </span>
            <span className="text-gold">&#8226;</span>
            <span className="font-body text-xs sm:text-sm tracking-[0.1em] uppercase">
              2025
            </span>
          </div>

          {/* Tagline */}
          <div className="pt-2">
            <p className="font-display text-gold text-sm italic tracking-wide">
              &#9733; Coldwater Cowboys &#9733; 45th Parallel &#9733;
            </p>
          </div>

          {/* Decorative divider */}
          <div className="pt-4">
            <div className="mx-auto w-24 h-px bg-gold/40" />
          </div>

          {/* Fine print */}
          <div className="pt-2 space-y-1.5">
            <p className="font-body text-cream/30 text-xs tracking-wider uppercase">
              Ghost Forest Surf Club &copy; {new Date().getFullYear()}
            </p>
            <p className="font-display text-cream/20 text-xs italic tracking-wide">
              No wetsuits were harmed in the making of this yearbook. Several were retired with honors.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
