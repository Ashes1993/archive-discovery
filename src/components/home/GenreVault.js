import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";

export function GenreVault({ genres }) {
  if (!genres || genres.length === 0) return null;

  return (
    <section className="py-20 bg-surface border-y border-border-subtle">
      <div className="container mx-auto px-6 text-center mb-12">
        <h2 className="text-3xl font-serif font-bold text-silver mb-3">
          Browse The Vaults
        </h2>
        <div className="h-0.5 w-12 bg-gold mx-auto" />
      </div>

      <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {genres.map((g) => (
          <Link key={g.id} href={`/media?genre=${g.slug}`}>
            <GlassCard
              className="group relative h-40 overflow-hidden flex flex-col justify-center items-center p-0 border-border-subtle hover:border-gold/50 transition-all duration-500 shadow-lg"
              hoverEffect={true}
            >
              {/* Dynamic Background Cover */}
              {g.coverUrl && (
                <div className="absolute inset-0 z-0">
                  <img
                    src={g.coverUrl}
                    alt={g.name}
                    className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-all duration-700 grayscale-[60%] group-hover:grayscale-0 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/80 to-noir/40" />
                </div>
              )}

              {/* Text Content */}
              <div className="relative z-10 text-center">
                <h3 className="text-2xl font-serif font-bold text-silver group-hover:text-white transition-colors drop-shadow-md">
                  {g.name}
                </h3>
                <div className="h-0.5 w-0 group-hover:w-full bg-gold transition-all duration-500 ease-out mx-auto mt-1 shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
                <p className="text-xs font-mono text-gold mt-2 uppercase tracking-widest drop-shadow-md">
                  {g.count} Titles
                </p>
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>
    </section>
  );
}
