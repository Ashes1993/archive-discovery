"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";

// --- SMART IMAGE LOGIC ADDED HERE ---
const getImageUrl = (archiveId, posterFile) => {
  if (!posterFile) return null;
  if (posterFile.startsWith("http")) return posterFile;
  return `https://archive.org/download/${archiveId}/${posterFile}`;
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
      {/* GRID: Horizontal Cards (Cinema Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
        {movies.map((movie, index) => {
          // --- GET THE CORRECT URL FOR EACH MOVIE ---
          const imageUrl = getImageUrl(movie.archiveId, movie.posterFile);

          return (
            <Link
              key={movie.id}
              href={`/media/${movie.archiveId}`}
              className="group block h-full"
            >
              <GlassCard
                className="h-full flex flex-col p-0 overflow-hidden hover:border-border-active transition-all duration-300"
                hoverEffect={true}
                delay={index * 0.03}
              >
                {/* THUMBNAIL CONTAINER */}
                <div className="aspect-video w-full overflow-hidden bg-noir relative">
                  {/* --- RENDER THE SMART URL --- */}
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-noir text-pewter text-xs font-mono">
                      No Image
                    </div>
                  )}

                  {/* Badge: Color/B&W */}
                  {movie.color && (
                    <div className="absolute top-2 left-2 bg-noir/80 backdrop-blur-md border border-border-subtle text-silver text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                      {movie.color === "Black & White" ? "B&W" : "Color"}
                    </div>
                  )}

                  {/* Badge: Runtime */}
                  {movie.runtime && (
                    <div className="absolute bottom-2 right-2 bg-noir/80 backdrop-blur-md border border-border-subtle text-silver text-[10px] font-mono px-1.5 py-0.5 rounded-sm">
                      {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                    </div>
                  )}
                </div>

                {/* INFO SECTION */}
                <div className="p-4 flex flex-col flex-grow bg-surface border-t border-border-subtle">
                  <h3
                    className="text-base font-medium text-silver line-clamp-1 mb-1 group-hover:text-gold transition-colors font-sans tracking-wide"
                    title={movie.title}
                  >
                    {movie.title}
                  </h3>

                  {movie.creator && (
                    <p className="text-xs text-pewter line-clamp-1 mb-3 font-sans">
                      {movie.creator}
                    </p>
                  )}

                  {/* Metadata Row (Mono font for technical feel) */}
                  <div className="flex justify-between items-center text-xs text-pewter mt-auto font-mono">
                    <span>{movie.year || "Classic"}</span>

                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        {/* Download Icon */}
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
                          ? `${(movie.downloads / 1000).toFixed(0)}k`
                          : movie.downloads}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="text-gold">★</span>{" "}
                        {movie.rating?.toFixed(1) || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </Link>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-12 mb-8">
        <GlassButton
          variant="ghost"
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page <= 1}
          className="text-xs font-mono uppercase"
        >
          ← Prev
        </GlassButton>

        <span className="text-xs font-mono text-pewter bg-surface px-4 py-2 rounded-md border border-border-subtle">
          Page {pagination.page} / {pagination.totalPages}
        </span>

        <GlassButton
          variant="ghost"
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.page >= pagination.totalPages}
          className="text-xs font-mono uppercase"
        >
          Next →
        </GlassButton>
      </div>
    </>
  );
}
