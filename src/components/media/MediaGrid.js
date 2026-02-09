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
      {/* GRID OPTIMIZATION:
        - Increased columns (lg:grid-cols-4, xl:grid-cols-5) -> Smaller cards
        - Reduced gap (gap-6 -> gap-5) -> Tighter layout
      */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-8">
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
              {/* Poster Image - Optimized Aspect Ratio */}
              <div className="aspect-[2/3] w-full overflow-hidden bg-slate-200 relative">
                <img
                  src={`https://archive.org/download/${movie.archiveId}/${movie.posterFile}`}
                  alt={movie.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />

                {/* Runtime Badge - Smaller & Glassy */}
                <div className="absolute bottom-2 right-2 bg-black/40 backdrop-blur-md border border-white/20 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
                  {movie.runtime
                    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
                    : "N/A"}
                </div>
              </div>

              {/* Info Section - Reduced Padding for "Lighter" feel */}
              <div className="p-3 flex flex-col flex-grow bg-white/5">
                <h3
                  className="text-sm font-semibold text-slate-800 line-clamp-1 mb-1 group-hover:text-indigo-600 transition-colors"
                  title={movie.title}
                >
                  {movie.title}
                </h3>
                <div className="flex justify-between items-center text-[11px] text-slate-500 mt-auto font-medium">
                  <span>{movie.year || "Unknown"}</span>
                  <span className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>{" "}
                    {movie.rating?.toFixed(1) || 0}
                  </span>
                </div>
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>

      {/* Pagination - Simplified */}
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
