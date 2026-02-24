import Link from "next/link";
import { getMovie } from "@/actions/media";
import { VideoPlayer } from "@/components/media/VideoPlayer";
import { GlassCard } from "@/components/ui/GlassCard";

export const revalidate = 3600;

// STRICT IMAGE LOGIC: Only accept TMDB or Cloudinary URLs
const getImageUrl = (posterFile) => {
  if (!posterFile) return null;
  if (posterFile.startsWith("http")) return posterFile;
  return null;
};

export async function generateMetadata({ params }) {
  const { id } = await params;
  const data = await getMovie(id);
  if (!data) return { title: "Movie Not Found" };
  return {
    title: `${data.movie.title} | Archive Discovery`,
    description: data.movie.description?.substring(0, 160),
  };
}

export default async function MoviePage({ params }) {
  const { id } = await params;
  const data = await getMovie(id);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <GlassCard className="text-pewter font-mono">
          Movie not found in our curated collection.
        </GlassCard>
      </div>
    );
  }

  const { movie, related } = data;

  // Video files always come from the Archive
  const videoUrl = `https://archive.org/download/${movie.archiveId}/${movie.videoFile}`;
  // Posters must go through our filter to prevent broken double-URLs
  const posterUrl = getImageUrl(movie.posterFile);

  return (
    <div className="container mx-auto px-4 sm:px-6 min-h-screen pt-32 pb-12">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* LEFT COLUMN: Player & Info */}
        <div className="xl:col-span-2 space-y-8">
          {/* 1. Custom Player */}
          <div className="rounded-md overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)] border border-border-subtle bg-noir aspect-video">
            <VideoPlayer
              src={videoUrl}
              poster={posterUrl}
              title={movie.title}
            />
          </div>

          {/* 2. Metadata Card */}
          <GlassCard className="space-y-6 p-6 sm:p-8">
            {/* Header: Title & Creator */}
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-silver tracking-wide leading-tight drop-shadow-md">
                {movie.title}
              </h1>
              {movie.creator && (
                <div className="mt-3 text-pewter font-sans text-sm md:text-base tracking-wide">
                  Directed by{" "}
                  <Link
                    href={`/media?q=${encodeURIComponent(movie.creator)}`}
                    className="text-gold hover:text-white transition-colors border-b border-gold/30 hover:border-white pb-0.5"
                  >
                    {movie.creator}
                  </Link>
                </div>
              )}
            </div>

            {/* Rich Metadata Bar (Technical Look) */}
            <div className="flex flex-wrap gap-2 sm:gap-3 text-[10px] sm:text-xs font-mono uppercase tracking-wider text-pewter">
              {movie.isVerified && (
                <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-sm shadow-md">
                  Verified
                </span>
              )}
              {movie.year && (
                <span className="px-3 py-1 bg-noir border border-border-subtle rounded-sm">
                  {movie.year}
                </span>
              )}
              {movie.runtime && (
                <span className="px-3 py-1 bg-noir border border-border-subtle rounded-sm">
                  {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                </span>
              )}
              {movie.language && (
                <span className="px-3 py-1 bg-noir border border-border-subtle rounded-sm">
                  {movie.language}
                </span>
              )}
              {movie.color && (
                <span className="px-3 py-1 bg-noir border border-border-subtle rounded-sm">
                  {movie.color}
                </span>
              )}
              <span className="px-3 py-1 bg-noir border border-gold/20 text-gold rounded-sm shadow-md">
                ★ {movie.rating?.toFixed(1) || 0} / 5
              </span>
              <span className="px-3 py-1 bg-noir border border-border-subtle rounded-sm">
                {(movie.downloads / 1000).toFixed(1)}k views
              </span>
              {movie.licenseUrl && (
                <a
                  href={movie.licenseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-noir border border-silver/20 text-silver hover:bg-silver/10 transition-colors rounded-sm flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/70 inline-block animate-pulse"></span>
                  Public Domain
                </a>
              )}
            </div>

            <div className="h-px w-full bg-border-subtle my-6 shadow-[0_1px_0_rgba(255,255,255,0.02)]" />

            {/* Description */}
            <p className="text-pewter leading-relaxed whitespace-pre-line font-sans text-sm md:text-base opacity-90">
              {movie.description || "No description available in the archive."}
            </p>

            {/* Clean TMDB Categories */}
            {movie.categories?.length > 0 && (
              <div className="pt-4 flex gap-2 sm:gap-3 flex-wrap">
                {movie.categories.map((c) => (
                  <Link key={c.id} href={`/media?genre=${c.name}`}>
                    <span className="text-[10px] sm:text-xs font-bold font-mono text-gold bg-gold/5 border border-gold/10 px-2 py-1 rounded-sm hover:bg-gold hover:text-noir cursor-pointer transition-all uppercase tracking-widest">
                      {c.name}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </GlassCard>

          {/* REVIEWS SECTION */}
          {movie.reviews && movie.reviews.length > 0 && (
            <div className="space-y-6 pt-4">
              <h3 className="text-xl font-serif font-bold text-silver px-2 border-l-2 border-gold pl-4">
                Archivist Notes
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {movie.reviews.map((review) => (
                  <GlassCard
                    key={review.id}
                    className="p-5 sm:p-6 bg-surface/40 hover:bg-surface/60 transition-colors"
                    hoverEffect={false}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="font-bold text-silver text-sm font-sans tracking-wide">
                        {review.author}
                      </span>
                      <span className="text-gold text-xs tracking-tighter drop-shadow-sm">
                        {"★".repeat(review.rating || 5)}
                      </span>
                    </div>
                    <p className="text-pewter text-xs sm:text-sm leading-relaxed italic font-serif border-l-2 border-border-subtle pl-4 mb-4">
                      "{review.body.substring(0, 150)}
                      {review.body.length > 150 ? "..." : ""}"
                    </p>
                    <div className="text-[9px] font-mono text-zinc-500 uppercase">
                      {new Date(review.date).toLocaleDateString()}
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Related Media */}
        <div className="xl:col-span-1 mt-8 xl:mt-0">
          <div className="sticky top-24">
            <h3 className="text-lg font-serif font-bold text-silver mb-6 px-2 border-l-2 border-gold pl-4">
              Up Next
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
              {related.map((item) => {
                const relImageUrl = getImageUrl(item.posterFile);

                return (
                  <Link key={item.id} href={`/media/${item.archiveId}`}>
                    <GlassCard
                      className="p-3 flex gap-4 group hover:bg-surface-hover hover:border-gold/30 transition-all duration-300 shadow-lg"
                      hoverEffect={false}
                    >
                      {/* Thumbnail (16:9 for sidebars) */}
                      <div className="relative w-28 aspect-video bg-noir rounded-sm overflow-hidden flex-shrink-0 border border-border-subtle">
                        {relImageUrl ? (
                          <img
                            src={relImageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100 grayscale-[20%] group-hover:grayscale-0"
                          />
                        ) : (
                          /* Fallback Typography Frame for Unenriched Items */
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-noir to-surface p-1 border-[2px] border-noir">
                            <span className="text-gold font-serif text-[9px] leading-tight text-center line-clamp-3">
                              {item.title}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex flex-col justify-center min-w-0 py-1">
                        <h4 className="font-bold text-sm text-silver line-clamp-2 leading-snug group-hover:text-gold transition-colors font-sans">
                          {item.title}
                        </h4>
                        <span className="text-[9px] font-mono text-pewter mt-1.5 uppercase tracking-wide">
                          {item.year || "Classic"} •{" "}
                          {item.rating?.toFixed(1) || 0} ★
                        </span>
                      </div>
                    </GlassCard>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
