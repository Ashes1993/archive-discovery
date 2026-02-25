import Link from "next/link";
import Image from "next/image";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";

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

      <div className="container mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {genres.map((g) => (
          <Link key={g.id} href={`/media?genre=${g.slug}`}>
            <GlassCard
              className="group relative aspect-[4/5] md:aspect-[2/3] overflow-hidden flex flex-col justify-center items-center p-0 border-border-subtle hover:border-gold/50 transition-all duration-500 shadow-lg"
              hoverEffect={true}
            >
              {/* Dynamic Background Cover */}
              {g.coverUrl && (
                <div className="absolute inset-0 z-0">
                  {/* NEXT.JS IMAGE OPTIMIZATION */}
                  <Image
                    src={g.coverUrl}
                    alt={g.name}
                    fill
                    unoptimized={process.env.NODE_ENV === "development"}
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover object-top opacity-50 group-hover:opacity-70 transition-all duration-700 grayscale-[60%] group-hover:grayscale-0 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/80 to-noir/40" />
                </div>
              )}

              {/* Text Content */}
              <div className="relative z-10 text-center p-4 w-full">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-silver group-hover:text-white transition-colors drop-shadow-md">
                  {g.name}
                </h3>
                <div className="h-0.5 w-0 group-hover:w-16 bg-gold transition-all duration-500 ease-out mx-auto mt-2 shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
                <p className="text-[10px] sm:text-xs font-mono text-gold mt-3 uppercase tracking-widest drop-shadow-md">
                  {g.count} Titles
                </p>
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>

      {/* CALL TO ACTION */}
      <div className="container mx-auto px-6 mt-12 flex justify-center">
        <Link href="/collections">
          <GlassButton
            variant="ghost"
            className="px-8 py-3 text-xs sm:text-sm font-mono uppercase tracking-widest hover:text-gold transition-colors border-border-subtle hover:border-gold/50"
          >
            Explore All Collections →
          </GlassButton>
        </Link>
      </div>
    </section>
  );
}
