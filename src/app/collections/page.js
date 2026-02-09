import Link from "next/link";
import { getCollections } from "@/actions/collections";
import { GlassCard } from "@/components/ui/GlassCard";

export const revalidate = 3600;

export const metadata = {
  title: "Collections | Archive Discovery",
  description: "Browse our curated library by genre and category.",
};

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <div className="container mx-auto px-6 min-h-screen pt-32 pb-12">
      {/* HEADER SECTION */}
      <div className="mb-16 text-center">
        <span className="inline-block px-3 py-1 mb-4 border border-gold/30 rounded-sm bg-gold/5 text-gold text-[10px] font-mono uppercase tracking-[0.2em]">
          Restored Archives
        </span>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-silver mb-4 tracking-wide">
          Curated Collections
        </h1>
        <p className="text-pewter max-w-lg mx-auto font-sans text-sm md:text-base leading-relaxed">
          Navigate the history of cinema through our organized vaults. From
          silent era masterpieces to mid-century noir.
        </p>
        <div className="h-px w-24 bg-gradient-to-r from-transparent via-gold/50 to-transparent mx-auto mt-8" />
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {collections.map((collection, index) => (
          <Link key={collection.id} href={`/media?genre=${collection.slug}`}>
            <GlassCard
              // UPDATED: Removed 'h-64', added 'aspect-[3/2]' for better image ratio
              className="group relative aspect-[3/2] overflow-hidden flex flex-col justify-end p-0 border-border-subtle"
              hoverEffect={true}
              delay={index * 0.05}
            >
              {/* BACKGROUND IMAGE (The "Cover") */}
              {collection.cover && (
                <div className="absolute inset-0">
                  <img
                    src={collection.cover.url}
                    alt={collection.name}
                    // UPDATED:
                    // 1. Added 'object-top' to prioritize faces/titles in posters
                    // 2. Reduced hover scale from scale-110 to scale-105 for clarity
                    className="w-full h-full object-cover object-top transition-all duration-700 
                               opacity-60 group-hover:opacity-100 
                               grayscale-[80%] group-hover:grayscale-0 
                               scale-100 group-hover:scale-105"
                  />
                  {/* Heavy Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/60 to-transparent opacity-90" />
                </div>
              )}

              {/* CONTENT */}
              <div className="relative z-10 p-6 w-full border-t border-white/5">
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-xl font-serif font-bold text-silver mb-1 group-hover:text-white transition-colors line-clamp-1">
                      {collection.name}
                    </h2>
                    <div className="h-0.5 w-0 group-hover:w-8 bg-gold transition-all duration-500 ease-out" />
                  </div>

                  <span className="text-[10px] font-mono text-gold/80 bg-noir/50 px-2 py-1 rounded-sm border border-gold/20 uppercase tracking-wider flex-shrink-0">
                    {collection.count}{" "}
                    {collection.count === 1 ? "Title" : "Titles"}
                  </span>
                </div>
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
