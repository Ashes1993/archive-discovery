"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";

// --- STRICT IMAGE LOGIC ---
// Only accept TMDB or Cloudinary URLs. Reject all Archive.org defaults.
const getImageUrl = (posterFile) => {
  if (!posterFile) return null;
  if (posterFile.startsWith("http")) return posterFile;
  return null;
};

export function MediaGrid({ movies, pagination }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`/media?${params.toString()}`);
  };

  if (movies.length === 0) {
    return (
      <div className="bg-surface border border-border-subtle p-12 text-center rounded-md text-pewter mt-8 font-mono text-sm">
        No movies found matching your search.
      </div>
    );
  }

  return (
    <>
      {/* GRID: Vertical Cards (Standard Movie Poster Style) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 mt-8">
        {movies.map((movie, index) => {
          const imageUrl = getImageUrl(movie.posterFile);

          return (
            <Link
              key={movie.id}
              href={`/media/${movie.archiveId}`}
              className="group block h-full"
            >
              <GlassCard
                className="h-full flex flex-col p-0 overflow-hidden hover:border-gold/50 transition-all duration-300 shadow-lg hover:shadow-gold/10"
                hoverEffect={true}
                delay={index * 0.02}
              >
                {/* POSTER CONTAINER (2:3 Aspect Ratio) */}
                <div className="aspect-[2/3] w-full overflow-hidden bg-noir relative border-b border-border-subtle">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                      loading="lazy"
                    />
                  ) : (
                    /* PREMIUM FALLBACK FRAME */
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-noir to-surface p-4 text-center border-[6px] border-noir transition-transform duration-700 group-hover:scale-105">
                      <div className="border border-border-subtle/50 w-full h-full flex flex-col items-center justify-center p-2 relative">
                        {/* Decorative corner markers */}
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gold/50"></div>
                        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-gold/50"></div>
                        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-gold/50"></div>
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-gold/50"></div>

                        <h3 className="text-gold font-serif text-sm sm:text-base leading-snug mb-2 line-clamp-4 px-2">
                          {movie.title}
                        </h3>
                        <div className="w-6 h-[1px] bg-gold/30 mb-2"></div>
                        <span className="text-pewter font-mono text-[10px] tracking-widest uppercase">
                          {movie.year || "Classic"}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Badge: Quality / Verification */}
                  {movie.isVerified && (
                    <div className="absolute top-2 right-2 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider shadow-black/50 shadow-md">
                      Verified
                    </div>
                  )}

                  {/* Badge: Runtime */}
                  {movie.runtime && (
                    <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-md border border-white/10 text-silver text-[10px] font-mono px-1.5 py-0.5 rounded-sm shadow-black/50 shadow-md">
                      {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                    </div>
                  )}
                </div>

                {/* INFO SECTION */}
                <div className="p-3 sm:p-4 flex flex-col flex-grow bg-surface">
                  <h3
                    className="text-sm sm:text-base font-bold text-silver line-clamp-1 mb-1 group-hover:text-gold transition-colors font-sans tracking-wide"
                    title={movie.title}
                  >
                    {movie.title}
                  </h3>

                  <div className="flex justify-between items-center text-[10px] sm:text-xs text-pewter mt-auto font-mono">
                    <span>{movie.year || "—"}</span>

                    <div className="flex items-center gap-2 sm:gap-3">
                      <span
                        className="flex items-center gap-1"
                        title="Downloads"
                      >
                        <svg
                          className="w-3 h-3 text-pewter"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        {movie.downloads > 1000
                          ? `${(movie.downloads / 1000).toFixed(1)}k`
                          : movie.downloads}
                      </span>
                      <span className="flex items-center gap-1" title="Rating">
                        <span className="text-gold">★</span>
                        {movie.rating?.toFixed(1) || "0.0"}
                      </span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </Link>
          );
        })}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-2 sm:gap-4 mt-12 mb-8">
        <GlassButton
          variant="ghost"
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page <= 1}
          className="text-[10px] sm:text-xs font-mono uppercase px-3 py-2"
        >
          ← Prev
        </GlassButton>

        <span className="text-[10px] sm:text-xs font-mono text-pewter bg-surface px-3 sm:px-4 py-2 rounded-md border border-border-subtle">
          Page {pagination.page} / {pagination.totalPages}
        </span>

        <GlassButton
          variant="ghost"
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.page >= pagination.totalPages}
          className="text-[10px] sm:text-xs font-mono uppercase px-3 py-2"
        >
          Next →
        </GlassButton>
      </div>
    </>
  );
}
