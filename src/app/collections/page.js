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
              className="group relative aspect-[3/2] overflow-hidden flex flex-col justify-end p-0 border-border-subtle shadow-lg hover:shadow-gold/10 transition-all duration-500"
              hoverEffect={true}
              delay={index * 0.05}
            >
              {/* BACKGROUND IMAGE (The TMDB Cover) */}
              {collection.coverUrl && (
                <div className="absolute inset-0">
                  <img
                    src={collection.coverUrl}
                    alt={collection.name}
                    className="w-full h-full object-cover object-top transition-all duration-700 
                               opacity-50 group-hover:opacity-80 
                               grayscale-[50%] group-hover:grayscale-0 
                               scale-100 group-hover:scale-105"
                  />
                  {/* Heavy Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/80 to-transparent opacity-100" />
                </div>
              )}

              {/* CONTENT */}
              <div className="relative z-10 p-6 w-full border-t border-white/5">
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-xl font-serif font-bold text-silver mb-1 group-hover:text-white transition-colors line-clamp-1 drop-shadow-md">
                      {collection.name}
                    </h2>
                    <div className="h-0.5 w-0 group-hover:w-12 bg-gold transition-all duration-500 ease-out shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
                  </div>

                  <span className="text-[10px] font-mono text-gold bg-noir/80 px-2 py-1 rounded-sm border border-gold/30 uppercase tracking-wider flex-shrink-0 shadow-black/50 shadow-md">
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
