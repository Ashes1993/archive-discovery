"use client";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";

export function Marquee({ title, movies }) {
  return (
    <section className="py-20 border-t border-border-subtle">
      <div className="container mx-auto px-6 mb-8 flex items-end justify-between">
        <div>
          <span className="text-gold font-mono text-xs uppercase tracking-widest mb-2 block">
            // Now Screening
          </span>
          <h2 className="text-3xl font-serif font-bold text-silver">{title}</h2>
        </div>
        <Link
          href="/media"
          className="text-xs font-mono text-pewter hover:text-white uppercase tracking-wider border-b border-transparent hover:border-gold transition-all"
        >
          View Full Index →
        </Link>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="flex overflow-x-auto pb-8 px-6 gap-6 scrollbar-hide snap-x">
        {movies.map((movie) => (
          <Link
            key={movie.id}
            href={`/media/${movie.archiveId}`}
            className="flex-shrink-0 snap-center"
          >
            <GlassCard
              className="w-48 aspect-[2/3] p-0 border-border-subtle group"
              hoverEffect={true}
            >
              <div className="relative w-full h-full bg-noir">
                <img
                  src={`https://archive.org/download/${movie.archiveId}/${movie.posterFile}`}
                  alt={movie.title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 grayscale-[30%] group-hover:grayscale-0"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-noir via-transparent to-transparent opacity-60" />

                <div className="absolute bottom-0 inset-x-0 p-3">
                  <h3 className="text-sm font-serif font-bold text-silver line-clamp-1 group-hover:text-gold transition-colors">
                    {movie.title}
                  </h3>
                  <p className="text-[10px] font-mono text-pewter mt-1">
                    {movie.year}
                  </p>
                </div>
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>
    </section>
  );
}
