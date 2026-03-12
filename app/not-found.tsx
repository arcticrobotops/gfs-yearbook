import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center">
        {/* Polaroid card */}
        <div className="bg-white shadow-xl p-4 pb-10 rotate-[-1deg] inline-block mb-8">
          <div className="bg-charcoal/5 aspect-square w-48 flex items-center justify-center mb-3">
            <p className="font-display text-[64px] leading-none text-varsity-blue/20 font-bold">
              404
            </p>
          </div>
          <p className="font-body text-[11px] tracking-[0.15em] text-charcoal/50 uppercase text-center">
            Photo not found
          </p>
        </div>

        <div className="block">
          <h1 className="font-display text-2xl text-varsity-blue mb-3">
            Page Missing
          </h1>
          <p className="font-body text-sm text-charcoal/60 leading-relaxed mb-8">
            This page wasn&apos;t in the annual. It may have been cut from the final edit.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-body text-xs tracking-[0.15em] uppercase text-gold border border-gold px-6 py-3 hover:bg-gold hover:text-varsity-blue transition-colors min-h-[44px]"
          >
            &larr; Back to the Annual
          </Link>
        </div>
      </div>
    </main>
  );
}
