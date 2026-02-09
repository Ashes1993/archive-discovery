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
        <GlassCard>Movie not found in our curated collection.</GlassCard>
      </div>
    );
  }

  const { movie, related } = data;

  const videoUrl = `https://archive.org/download/${movie.archiveId}/${movie.videoFile}`;
  const posterUrl = `https://archive.org/download/${movie.archiveId}/${movie.posterFile}`;

  return (
    <div className="container mx-auto px-4 md:px-6 min-h-screen pt-28 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: Player & Info */}
        <div className="lg:col-span-2 space-y-6">
          <VideoPlayer src={videoUrl} poster={posterUrl} title={movie.title} />

          <GlassCard className="space-y-6">
            {/* Header: Title & Creator */}
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                {movie.title}
              </h1>
              {movie.creator && (
                <div className="mt-1 text-slate-500 font-medium">
                  Directed by{" "}
                  <Link
                    href={`/media?q=${encodeURIComponent(movie.creator)}`}
                    className="text-indigo-600 hover:underline"
                  >
                    {movie.creator}
                  </Link>
                </div>
              )}
            </div>

            {/* Rich Metadata Bar */}
            <div className="flex flex-wrap gap-2 text-xs font-medium uppercase tracking-wide">
              {movie.year && (
                <span className="px-3 py-1 bg-slate-100 rounded-full text-slate-600 border border-slate-200">
                  {movie.year}
                </span>
              )}
              {movie.language && (
                <span className="px-3 py-1 bg-slate-100 rounded-full text-slate-600 border border-slate-200">
                  {movie.language}
                </span>
              )}
              {movie.color && (
                <span className="px-3 py-1 bg-slate-100 rounded-full text-slate-600 border border-slate-200">
                  {movie.color}
                </span>
              )}
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100">
                ★ {movie.rating || 0} / 5
              </span>
              <span className="px-3 py-1 bg-slate-100 rounded-full text-slate-600 border border-slate-200">
                {movie.downloads.toLocaleString()} views
              </span>
              {movie.licenseUrl && (
                <a
                  href={movie.licenseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-100 hover:bg-green-100 transition-colors"
                >
                  Public Domain
                </a>
              )}
            </div>

            <div className="h-px w-full bg-slate-200/60" />

            {/* Description */}
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
              {movie.description || "No description available."}
            </p>

            {/* Categories */}
            <div className="pt-2 flex gap-2 flex-wrap">
              {movie.categories.map((c) => (
                <Link key={c.id} href={`/media?genre=${c.name}`}>
                  <span className="text-xs font-bold text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors uppercase tracking-wider">
                    #{c.name}
                  </span>
                </Link>
              ))}
            </div>
          </GlassCard>

          {/* REVIEWS SECTION */}
          {movie.reviews && movie.reviews.length > 0 && (
            <div className="space-y-4 pt-4">
              <h3 className="text-xl font-bold text-slate-800 px-2">
                Archivist Notes & Reviews
              </h3>
              <div className="grid gap-4">
                {movie.reviews.map((review) => (
                  <GlassCard
                    key={review.id}
                    className="p-4"
                    hoverEffect={false}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-slate-800 text-sm">
                        {review.author}
                      </span>
                      <span className="text-yellow-500 text-xs">
                        {"★".repeat(review.rating || 5)}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed italic">
                      "{review.body.substring(0, 300)}
                      {review.body.length > 300 ? "..." : ""}"
                    </p>
                    <div className="mt-2 text-xs text-slate-400">
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
          <h3 className="text-xl font-bold text-slate-800 mb-4 px-2">
            Up Next
          </h3>

          <div className="flex flex-col gap-4">
            {related.map((item) => (
              <Link key={item.id} href={`/media/${item.archiveId}`}>
                <GlassCard
                  className="p-3 flex gap-3 group hover:bg-white/40 transition-colors"
                  hoverEffect={false}
                >
                  <div className="relative w-32 aspect-video bg-slate-200 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={`https://archive.org/download/${item.archiveId}/${item.posterFile}`}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex flex-col justify-center min-w-0">
                    <h4 className="font-semibold text-sm text-slate-800 line-clamp-2 leading-tight group-hover:text-indigo-600">
                      {item.title}
                    </h4>
                    <span className="text-xs text-slate-500 mt-1">
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
  );
}
