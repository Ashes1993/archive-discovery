import Link from "next/link";
import { GlassButton } from "@/components/ui/GlassButton";

export function Spotlight({ movie }) {
  if (!movie) return null;

  return (
    <section className="relative py-16 lg:py-24 overflow-hidden border-t border-border-subtle">
      {/* Dynamic Background Image with Heavy Blur and Fade */}
      <div className="absolute inset-0 z-0 bg-noir">
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-noir via-noir/90 to-noir/60 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-noir via-transparent to-noir z-10" />
        {movie.posterFile && (
          <img
            src={movie.posterFile}
            alt={`${movie.title} Background`}
            className="w-full h-full object-cover blur-2xl opacity-30 scale-110"
          />
        )}
      </div>

      <div className="container mx-auto px-6 relative z-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Visual Poster Card (Now visible on mobile, ordered to the top!) */}
        <div className="flex justify-center lg:justify-end relative group perspective-[1000px] order-1 lg:order-2 mb-4 lg:mb-0">
          <div className="absolute -inset-4 bg-gold/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-full" />
          <img
            src={movie.posterFile}
            alt={`${movie.title} Poster`}
            className="relative w-48 sm:w-64 md:w-80 aspect-[2/3] object-cover rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 rotate-0 lg:rotate-2 group-hover:rotate-0 group-hover:scale-105 transition-all duration-700"
          />
        </div>

        {/* Content (Ordered below the poster on mobile) */}
        <div className="space-y-4 md:space-y-6 text-center lg:text-left order-2 lg:order-1 flex flex-col items-center lg:items-start">
          <div className="inline-block px-3 py-1 border border-gold/30 rounded-sm bg-gold/5 backdrop-blur-sm">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gold shadow-black drop-shadow-md">
              Featured Masterpiece
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold text-white leading-tight drop-shadow-lg">
            {movie.title}{" "}
            {movie.year && (
              <span className="text-xl md:text-2xl text-pewter block mt-1 md:mt-2 font-sans font-normal tracking-wide">
                ({movie.year})
              </span>
            )}
          </h2>

          <p className="text-silver text-sm sm:text-base md:text-lg leading-relaxed max-w-lg drop-shadow-md line-clamp-4 mx-auto lg:mx-0">
            {movie.description ||
              "Experience this restored classic from the public domain archives."}
          </p>

          <div className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-3 text-[10px] md:text-xs font-mono text-silver uppercase tracking-wider py-2 md:py-4">
            {movie.runtime && (
              <span className="border border-border-subtle bg-noir/50 backdrop-blur-md px-3 py-1 rounded-sm">
                {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
              </span>
            )}
            {movie.color && (
              <span className="border border-border-subtle bg-noir/50 backdrop-blur-md px-3 py-1 rounded-sm">
                {movie.color}
              </span>
            )}
            {movie.isVerified && (
              <span className="border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 backdrop-blur-md px-3 py-1 rounded-sm">
                Verified Meta
              </span>
            )}
          </div>

          <div className="flex w-full sm:w-auto pt-4">
            <Link
              href={`/media/${movie.archiveId}`}
              className="w-full sm:w-auto"
            >
              <GlassButton className="w-full sm:w-auto border-gold text-gold hover:bg-gold hover:text-noir transition-colors px-8 py-3">
                Watch Feature
              </GlassButton>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
