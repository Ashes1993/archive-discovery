import Link from "next/link";
import { getCollections } from "@/actions/collections";
import { GlassCard } from "@/components/ui/GlassCard";

export const revalidate = 3600; // Cache for 1 hour

export const metadata = {
  title: "Collections | Archive Discovery",
  description: "Browse our curated library by genre and category.",
};

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <div className="container mx-auto px-4 min-h-screen pt-24 pb-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Library Collections
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto">
          Explore our archives organized by genre, style, and era.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {collections.map((collection, index) => (
          <Link key={collection.id} href={`/media?genre=${collection.slug}`}>
            <GlassCard
              className="group relative h-48 overflow-hidden flex items-center justify-center p-0"
              hoverEffect={true}
              delay={index * 0.05}
            >
              {/* BACKGROUND IMAGE (The "Cover") */}
              {collection.cover && (
                <div className="absolute inset-0">
                  <img
                    src={collection.cover.url}
                    alt={collection.name}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700"
                  />
                  {/* Gradient Overlay to make text readable */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-slate-900/30" />
                </div>
              )}

              {/* CONTENT */}
              <div className="relative z-10 text-center p-4">
                <h2 className="text-2xl font-bold text-white mb-2 group-hover:translate-y-[-2px] transition-transform">
                  {collection.name}
                </h2>
                <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs text-white/90 font-medium">
                  {collection.count}{" "}
                  {collection.count === 1 ? "Movie" : "Movies"}
                </span>
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
