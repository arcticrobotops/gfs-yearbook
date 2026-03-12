import Image from 'next/image';

interface EditorialCardProps {
  imageUrl: string;
  alt: string;
  caption: string;
  index: number;
}

const rotations = [
  'card-rotate-2',
  'card-rotate-5',
  'card-rotate-0',
  'card-rotate-3',
];

const editorialData: EditorialCardProps[] = [
  {
    imageUrl: 'https://images.unsplash.com/photo-1502680390548-bdbac40e4a21?w=800&q=80',
    alt: 'Surfer walking on misty beach at dawn',
    caption: 'Dawn patrol, somewhere north of Neskowin. The fog never really lifts.',
    index: 0,
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    alt: 'Golden light on ocean waves',
    caption: 'When the light hits right, you forget about the cold.',
    index: 1,
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1455729552457-5c322b382886?w=800&q=80',
    alt: 'Old surfboards leaning against weathered wood',
    caption: 'The quiver wall at the clubhouse. Every ding tells a story.',
    index: 2,
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1416163272553-1318a402ddc0?w=800&q=80',
    alt: 'Misty Pacific Northwest coastline',
    caption: 'Tillamook Head on a Tuesday. Not another soul in sight.',
    index: 3,
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1509914398892-963f53e6e2f1?w=800&q=80',
    alt: 'Dramatic wave breaking',
    caption: 'February swell. The trees watched from the cliff.',
    index: 4,
  },
];

export function getEditorialByIndex(index: number): EditorialCardProps {
  return editorialData[index % editorialData.length];
}

export default function EditorialCard({
  imageUrl,
  alt,
  caption,
  index,
}: EditorialCardProps) {
  const rotationClass = rotations[index % rotations.length];

  return (
    <div className={`${rotationClass} transition-transform duration-300 hover:rotate-0`}>
      {/* MEMORIES header */}
      <div className="text-center mb-3">
        <span className="font-display text-gold text-xs tracking-[0.3em] uppercase font-semibold">
          Memories
        </span>
      </div>

      {/* Polaroid frame with tape strip */}
      <div className="relative bg-white p-3 sm:p-4 polaroid-card rounded-[2px]">
        {/* Gold tape strip */}
        <div className="tape-strip" />
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={imageUrl}
            alt={alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 66vw"
            className="object-cover yearbook-image"
          />
        </div>

        {/* Handwritten caption */}
        <div className="pt-3 pb-1 text-center">
          <p className="font-display text-charcoal/80 text-sm italic leading-relaxed">
            &ldquo;{caption}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}
