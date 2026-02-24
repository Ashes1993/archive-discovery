import Link from "next/link";
import { GlassButton } from "@/components/ui/GlassButton";

export function Spotlight({ movie }) {
  if (!movie) return null;

  return (
    <section className="relative py-24 overflow-hidden border-t border-border-subtle">
      {/* Dynamic Background Image with Heavy Blur and Fade */}
      <div className="absolute inset-0 z-0 bg-noir">
        <div className="absolute inset-0 bg-gradient-to-r from-noir via-noir/90 to-noir/60 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-noir via-transparent to-noir z-10" />
        {movie.posterFile && (
          <img
            src={movie.posterFile}
            alt={`${movie.title} Background`}
            className="w-full h-full object-cover blur-2xl opacity-30 scale-110"
          />
        )}
      </div>

      <div className="container mx-auto px-6 relative z-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Content */}
        <div className="space-y-6">
          <div className="inline-block px-3 py-1 border border-gold/30 rounded-sm bg-gold/5 backdrop-blur-sm">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gold shadow-black drop-shadow-md">
              Featured Masterpiece
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-serif font-bold text-white leading-tight drop-shadow-lg">
            {movie.title}{" "}
            {movie.year && (
              <span className="text-2xl text-pewter block mt-2 font-sans font-normal tracking-wide">
                ({movie.year})
              </span>
            )}
          </h2>

          <p className="text-silver text-base md:text-lg leading-relaxed max-w-lg drop-shadow-md line-clamp-4">
            {movie.description ||
              "Experience this restored classic from the public domain archives."}
          </p>

          <div className="flex flex-wrap gap-3 text-[10px] md:text-xs font-mono text-silver uppercase tracking-wider py-4">
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
            {/* If you passed categories down, you could map them here. We'll show a verification badge for now */}
            {movie.isVerified && (
              <span className="border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 backdrop-blur-md px-3 py-1 rounded-sm">
                Verified Meta
              </span>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <Link href={`/media/${movie.archiveId}`}>
              <GlassButton className="border-gold text-gold hover:bg-gold hover:text-noir transition-colors px-8 py-3">
                Watch Feature
              </GlassButton>
            </Link>
          </div>
        </div>

        {/* Visual Poster Card (Hidden on very small screens) */}
        <div className="hidden sm:flex justify-self-center lg:justify-self-end relative group perspective-[1000px]">
          <div className="absolute -inset-4 bg-gold/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-full" />
          <img
            src={movie.posterFile}
            alt={`${movie.title} Poster`}
            className="relative w-64 md:w-80 aspect-[2/3] object-cover rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 rotate-2 group-hover:rotate-0 group-hover:scale-105 transition-all duration-700"
          />
        </div>
      </div>
    </section>
  );
}
