interface TextMomentProps {
  index: number;
}

const superlatives = [
  {
    title: 'Most Likely to Paddle Out in January',
    name: 'Every single member',
    variant: 'blue' as const,
  },
  {
    title: 'Best Dawn Patrol Face',
    name: '4:47 AM, still smiling',
    variant: 'cream' as const,
  },
  {
    title: 'Perpetual Wetsuit Tan',
    name: 'Badge of honor since day one',
    variant: 'blue' as const,
  },
  {
    title: 'Most Creative Board Repair',
    name: 'Duct tape and a dream',
    variant: 'cream' as const,
  },
  {
    title: 'Best Post-Session Parking Lot Debrief',
    name: 'The real surf club meeting',
    variant: 'blue' as const,
  },
  {
    title: 'Coldest Water. Warmest Hearts.',
    name: '45th Parallel, always',
    variant: 'cream' as const,
  },
];

export function getSuperlativeByIndex(index: number) {
  return superlatives[index % superlatives.length];
}

export default function TextMoment({ index }: TextMomentProps) {
  const superlative = superlatives[index % superlatives.length];
  const isBlue = superlative.variant === 'blue';

  return (
    <div
      className={`rounded-[2px] p-6 sm:p-8 text-center transition-[background-color,opacity] duration-300 ${
        isBlue
          ? 'bg-varsity-blue text-cream'
          : 'bg-cream border-2 border-maroon/20 text-charcoal'
      }`}
    >
      {/* Gold double-border inset frame */}
      <div
        className={`border rounded-[1px] p-5 sm:p-6 ${
          isBlue ? 'border-gold/30' : 'border-gold/40'
        }`}
      >
        <div
          className={`border rounded-[1px] p-4 sm:p-5 ${
            isBlue ? 'border-gold/15' : 'border-gold/20'
          }`}
        >
          {/* SUPERLATIVES header */}
          <div className="mb-4">
            <span className="font-display text-gold text-xs tracking-[0.15em] sm:tracking-[0.3em] uppercase font-semibold">
              Superlatives
            </span>
          </div>

          {/* Star decoration */}
          <div aria-hidden="true" className={`text-2xl mb-3 ${isBlue ? 'text-gold' : 'text-maroon'}`}>
            ★
          </div>

          {/* Superlative title */}
          <h3
            className={`font-display text-lg sm:text-xl italic leading-snug mb-3 ${
              isBlue ? 'text-cream' : 'text-maroon'
            }`}
          >
            &ldquo;{superlative.title}&rdquo;
          </h3>

          {/* Attribution */}
          <p
            className={`font-body text-xs tracking-[0.1em] uppercase ${
              isBlue ? 'text-cream/60' : 'text-charcoal/50'
            }`}
          >
            {superlative.name}
          </p>

          {/* Bottom star */}
          <div aria-hidden="true" className={`text-2xl mt-3 ${isBlue ? 'text-gold' : 'text-maroon'}`}>
            ★
          </div>
        </div>
      </div>
    </div>
  );
}
