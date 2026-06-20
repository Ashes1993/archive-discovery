"use client";
import Link from "next/link";
import Image from "next/image";
import { GlassCard } from "@/components/ui/GlassCard";

const getImageUrl = (posterFile) => {
  if (!posterFile) return null;
  if (posterFile.startsWith("http")) return posterFile;
  return null;
};

export function Marquee({ title, movies }) {
  if (!movies || movies.length === 0) return null;

  return (
    <section className="py-20 border-t border-border-subtle overflow-hidden">
      <div className="container mx-auto px-6 mb-8 flex items-end justify-between">
        <div>
          <span className="text-gold font-mono text-xs uppercase tracking-widest mb-2 block">
            Now Screening
          </span>
          <h2 className="text-3xl font-serif font-bold text-silver">{title}</h2>
        </div>
        <Link
          href="/media"
          className="text-xs font-mono text-pewter hover:text-white uppercase tracking-wider border-b border-transparent hover:border-gold transition-all hidden sm:block"
        >
          View Full Index →
        </Link>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="flex overflow-x-auto pb-8 px-6 gap-4 sm:gap-6 scrollbar-hide snap-x">
        {movies.map((movie) => {
          const imageUrl = getImageUrl(movie.posterFile);

          return (
            <Link
              key={movie.id}
              href={`/media/${movie.archiveId}`}
              className="flex-shrink-0 snap-start w-36 sm:w-48"
            >
              <GlassCard
                className="w-full aspect-[2/3] p-0 border-border-subtle hover:border-gold/50 group transition-all duration-300 shadow-lg"
                hoverEffect={true}
              >
                <div className="relative w-full h-full bg-noir overflow-hidden rounded-sm">
                  {imageUrl ? (
                    /* NEXT.JS IMAGE OPTIMIZATION */
                    <Image
                      src={imageUrl}
                      alt={movie.title}
                      fill
                      unoptimized={process.env.NODE_ENV === "development"}
                      sizes="(max-width: 640px) 150px, 200px"
                      className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-noir to-surface p-2 text-center border-[4px] border-noir transition-transform duration-700 group-hover:scale-105">
                      <div className="border border-border-subtle/50 w-full h-full flex flex-col items-center justify-center p-2">
                        <h3 className="text-gold font-serif text-xs leading-snug mb-1 line-clamp-3">
                          {movie.title}
                        </h3>
                        <span className="text-pewter font-mono text-[8px] uppercase">
                          {movie.year || "Classic"}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-noir via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                  <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 bg-gradient-to-t from-noir to-transparent z-10">
                    <h3 className="text-xs sm:text-sm font-serif font-bold text-silver line-clamp-1 group-hover:text-gold transition-colors drop-shadow-md">
                      {movie.title}
                    </h3>
                    <p className="text-[9px] sm:text-[10px] font-mono text-pewter mt-1">
                      {movie.year}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
