import Link from "next/link";
import { getMovie } from "@/actions/media";
import { VideoPlayer } from "@/components/media/VideoPlayer";
import { GlassCard } from "@/components/ui/GlassCard";

export const revalidate = 3600;

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

  const videoUrl = `https://archive.org/download/${movie.archiveId}/${movie.videoFile}`;
  const posterUrl = `https://archive.org/download/${movie.archiveId}/${movie.posterFile}`;

  return (
    <div className="container mx-auto px-6 min-h-screen pt-32 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: Player & Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* 1. Custom Player */}
          <VideoPlayer src={videoUrl} poster={posterUrl} title={movie.title} />

          {/* 2. Metadata Card */}
          <GlassCard className="space-y-6 p-8">
            {/* Header: Title & Creator */}
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-silver tracking-wide leading-tight">
                {movie.title}
              </h1>
              {movie.creator && (
                <div className="mt-2 text-pewter font-sans text-sm tracking-wide">
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
            <div className="flex flex-wrap gap-3 text-xs font-mono uppercase tracking-wider text-pewter">
              {movie.year && (
                <span className="px-3 py-1 bg-noir border border-border-subtle rounded-sm">
                  {movie.year}
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
              <span className="px-3 py-1 bg-noir border border-gold/20 text-gold rounded-sm">
                ★ {movie.rating || 0} / 5
              </span>
              <span className="px-3 py-1 bg-noir border border-border-subtle rounded-sm">
                {movie.downloads.toLocaleString()} views
              </span>
              {movie.licenseUrl && (
                <a
                  href={movie.licenseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-noir border border-silver/20 text-silver hover:bg-silver/10 transition-colors rounded-sm flex items-center gap-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500/70 inline-block mr-1"></span>
                  Public Domain
                </a>
              )}
            </div>

            <div className="h-px w-full bg-border-subtle my-6" />

            {/* Description */}
            <p className="text-pewter leading-relaxed whitespace-pre-line font-sans text-sm md:text-base">
              {movie.description || "No description available."}
            </p>

            {/* Categories */}
            <div className="pt-4 flex gap-3 flex-wrap">
              {movie.categories.map((c) => (
                <Link key={c.id} href={`/media?genre=${c.name}`}>
                  <span className="text-xs font-bold font-mono text-pewter hover:text-gold cursor-pointer transition-colors uppercase tracking-widest">
                    #{c.name}
                  </span>
                </Link>
              ))}
            </div>
          </GlassCard>

          {/* REVIEWS SECTION */}
          {movie.reviews && movie.reviews.length > 0 && (
            <div className="space-y-6 pt-4">
              <h3 className="text-xl font-serif font-bold text-silver px-2 border-l-2 border-gold pl-4">
                Archivist Notes
              </h3>
              <div className="grid gap-4">
                {movie.reviews.map((review) => (
                  <GlassCard
                    key={review.id}
                    className="p-6 bg-surface/50"
                    hoverEffect={false}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="font-bold text-silver text-sm font-sans tracking-wide">
                        {review.author}
                      </span>
                      <span className="text-gold text-xs tracking-tighter">
                        {"★".repeat(review.rating || 5)}
                      </span>
                    </div>
                    <p className="text-pewter text-sm leading-relaxed italic font-serif border-l-2 border-border-subtle pl-4 mb-3">
                      "{review.body.substring(0, 300)}
                      {review.body.length > 300 ? "..." : ""}"
                    </p>
                    <div className="text-[10px] font-mono text-zinc-600 uppercase">
                      {new Date(review.date).toLocaleDateString()}
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Related Media */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <h3 className="text-lg font-serif font-bold text-silver mb-6 px-2 border-l-2 border-gold pl-4">
              Up Next
            </h3>

            <div className="flex flex-col gap-4">
              {related.map((item) => (
                <Link key={item.id} href={`/media/${item.archiveId}`}>
                  <GlassCard
                    className="p-3 flex gap-4 group hover:bg-surface-hover hover:border-border-active transition-colors"
                    hoverEffect={false}
                  >
                    {/* Thumbnail */}
                    <div className="relative w-28 aspect-video bg-noir rounded-sm overflow-hidden flex-shrink-0 border border-border-subtle">
                      <img
                        src={`https://archive.org/download/${item.archiveId}/${item.posterFile}`}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex flex-col justify-center min-w-0 py-1">
                      <h4 className="font-medium text-sm text-silver line-clamp-2 leading-snug group-hover:text-gold transition-colors font-sans">
                        {item.title}
                      </h4>
                      <span className="text-[10px] font-mono text-pewter mt-2 uppercase tracking-wide">
                        {item.year || "Classic"} • {item.rating} ★
                      </span>
                    </div>
                  </GlassCard>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
