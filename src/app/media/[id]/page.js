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

  // Construct direct Archive.org URLs
  const videoUrl = `https://archive.org/download/${movie.archiveId}/${movie.videoFile}`;
  const posterUrl = `https://archive.org/download/${movie.archiveId}/${movie.posterFile}`;

  return (
    <div className="container mx-auto px-4 md:px-6 min-h-screen pt-28 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: Player & Info (Spans 2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Custom Player */}
          <VideoPlayer src={videoUrl} poster={posterUrl} title={movie.title} />

          {/* 2. Metadata Card */}
          <GlassCard className="space-y-4">
            <h1 className="text-3xl font-bold text-slate-800">{movie.title}</h1>

            <div className="flex flex-wrap gap-2 text-sm">
              {movie.year && (
                <span className="px-3 py-1 bg-slate-100 rounded-full text-slate-600 border border-slate-200">
                  {movie.year}
                </span>
              )}
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100 font-medium">
                ★ {movie.rating || 0} / 5
              </span>
              <span className="px-3 py-1 bg-slate-100 rounded-full text-slate-600 border border-slate-200">
                {movie.downloads.toLocaleString()} views
              </span>
            </div>

            <div className="h-px w-full bg-slate-200/60 my-4" />

            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
              {movie.description || "No description available."}
            </p>

            <div className="pt-4 flex gap-2 flex-wrap">
              {movie.categories.map((c) => (
                <Link key={c.id} href={`/media?genre=${c.name}`}>
                  <span className="text-xs font-bold text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors uppercase tracking-wider">
                    #{c.name}
                  </span>
                </Link>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* RIGHT COLUMN: Related Media (Spans 1 column) */}
        <div className="lg:col-span-1">
          <h3 className="text-xl font-bold text-slate-800 mb-4 px-2">
            Up Next
          </h3>

          <div className="flex flex-col gap-4">
            {related.map((item, i) => (
              <Link key={item.id} href={`/media/${item.archiveId}`}>
                <GlassCard
                  className="p-3 flex gap-3 group hover:bg-white/40 transition-colors"
                  hoverEffect={false}
                >
                  {/* Thumbnail */}
                  <div className="relative w-32 aspect-video bg-slate-200 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={`https://archive.org/download/${item.archiveId}/${item.posterFile}`}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Text */}
                  <div className="flex flex-col justify-center min-w-0">
                    <h4 className="font-semibold text-sm text-slate-800 line-clamp-2 leading-tight group-hover:text-indigo-600">
                      {item.title}
                    </h4>
                    <span className="text-xs text-slate-500 mt-1">
                      {item.year} • {item.rating} ★
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
