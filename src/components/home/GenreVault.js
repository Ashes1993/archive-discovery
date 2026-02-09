import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";

const genres = [
  { name: "Film Noir", count: "120+", slug: "film_noir" },
  { name: "Sci-Fi", count: "85+", slug: "sci_fi" },
  { name: "Horror", count: "200+", slug: "horror" },
  { name: "Silent", count: "300+", slug: "silent_films" },
];

export function GenreVault() {
  return (
    <section className="py-20 bg-surface border-y border-border-subtle">
      <div className="container mx-auto px-6 text-center mb-12">
        <h2 className="text-3xl font-serif font-bold text-silver mb-3">
          Browse The Vaults
        </h2>
        <div className="h-0.5 w-12 bg-gold mx-auto" />
      </div>

      <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {genres.map((g) => (
          <Link key={g.name} href={`/media?genre=${g.slug}`}>
            <GlassCard
              className="group p-8 text-center bg-noir hover:bg-surface-hover border-border-subtle hover:border-gold/30 transition-all duration-500"
              hoverEffect={false}
            >
              <h3 className="text-xl font-serif font-bold text-silver group-hover:text-gold transition-colors">
                {g.name}
              </h3>
              <p className="text-xs font-mono text-pewter mt-2 group-hover:text-silver">
                {g.count} Titles
              </p>
            </GlassCard>
          </Link>
        ))}
      </div>
    </section>
  );
}
