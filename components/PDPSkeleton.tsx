export default function PDPSkeleton() {
  return (
    <main className="min-h-screen bg-cream animate-pulse">
      <div className="max-w-5xl mx-auto px-4 pt-6 pb-2">
        <div className="h-4 w-32 bg-charcoal/8" />
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="h-3 w-24 bg-gold/20 mx-auto mb-3" />
          <div className="h-10 w-64 bg-charcoal/8 mx-auto" />
          <div className="mx-auto w-48 h-px bg-gold/20 mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image gallery */}
          <div>
            <div className="polaroid-card bg-white p-4">
              <div className="aspect-square bg-charcoal/5" />
              <div className="pt-4 pb-5 flex flex-col items-center gap-2">
                <div className="h-3 w-32 bg-charcoal/8" />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 mt-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="aspect-square bg-charcoal/5 rounded-sm" />
              ))}
            </div>
          </div>

          {/* Product info */}
          <div className="space-y-5">
            <div className="h-6 w-40 bg-gold/15" />
            <div className="h-5 w-3/4 bg-charcoal/8" />
            <div className="h-4 w-20 bg-charcoal/5" />
            <div className="space-y-2 mt-4">
              <div className="h-3 w-full bg-charcoal/5" />
              <div className="h-3 w-5/6 bg-charcoal/5" />
              <div className="h-3 w-2/3 bg-charcoal/5" />
            </div>
            <div className="h-12 bg-varsity-blue/10 mt-6" />
          </div>
        </div>
      </div>
    </main>
  );
}
