"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";

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
      <div className="glass p-12 text-center rounded-2xl text-slate-500 mt-8">
        No movies found matching your search.
      </div>
    );
  }

  return (
    <>
      {/* LAYOUT UPDATE:
         1. aspect-video: Fits the source thumbnails perfectly (no zoom).
         2. grid-cols: Adjusted to 1/2/3/4 to give cards breathing room.
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
        {movies.map((movie, index) => (
          <Link
            key={movie.id}
            href={`/media/${movie.archiveId}`}
            className="group block h-full"
          >
            <GlassCard
              className="h-full flex flex-col p-0 overflow-hidden hover:ring-2 hover:ring-indigo-400/30 transition-all duration-300"
              hoverEffect={true}
              delay={index * 0.03}
            >
              {/* THUMBNAIL CONTAINER (Horizontal) */}
              <div className="aspect-video w-full overflow-hidden bg-slate-900 relative">
                <img
                  src={`https://archive.org/download/${movie.archiveId}/${movie.posterFile}`}
                  alt={movie.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Badge: Color/B&W (Top Left) */}
                {movie.color && (
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md border border-white/10 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                    {movie.color === "Black & White" ? "B&W" : "Color"}
                  </div>
                )}

                {/* Badge: Runtime (Bottom Right) */}
                {movie.runtime && (
                  <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
                    {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                  </div>
                )}
              </div>

              {/* INFO SECTION */}
              <div className="p-4 flex flex-col flex-grow bg-white/5 border-t border-white/5">
                <h3
                  className="text-base font-semibold text-slate-800 line-clamp-1 mb-1 group-hover:text-indigo-600 transition-colors"
                  title={movie.title}
                >
                  {movie.title}
                </h3>

                {movie.creator && (
                  <p className="text-xs text-slate-400 line-clamp-1 mb-3">
                    {movie.creator}
                  </p>
                )}

                <div className="flex justify-between items-center text-xs text-slate-500 mt-auto font-medium">
                  <span>{movie.year || "Classic"}</span>

                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-3 h-3 text-slate-400"
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
                      <span className="text-yellow-500">★</span>{" "}
                      {movie.rating?.toFixed(1) || 0}
                    </span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>

      {/* Pagination (Unchanged) */}
      <div className="flex justify-center items-center gap-4 mt-12 mb-8">
        <GlassButton
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page <= 1}
          className={`px-4 py-2 text-sm ${pagination.page <= 1 ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          ← Prev
        </GlassButton>
        <span className="text-sm font-medium text-slate-600 bg-white/40 px-4 py-2 rounded-lg border border-white/20">
          Page {pagination.page} / {pagination.totalPages}
        </span>
        <GlassButton
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.page >= pagination.totalPages}
          className={`px-4 py-2 text-sm ${pagination.page >= pagination.totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Next →
        </GlassButton>
      </div>
    </>
  );
}
