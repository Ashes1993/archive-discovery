import { getMovies } from "@/actions/media";
import { MediaGrid } from "@/components/media/MediaGrid";
import { ControlBar } from "@/components/media/ControlBar";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600;

export const metadata = {
  title: "Browse | Archive Discovery",
  description: "Curated public domain movies.",
};

async function getCategories() {
  const categories = await prisma.category.findMany({
    select: { name: true },
    orderBy: { name: "asc" },
  });
  return categories.map((c) => c.name);
}

export default async function MediaPage({ searchParams }) {
  const params = await searchParams;
  const query = params?.q || "";
  const page = Number(params?.page) || 1;
  const sort = params?.sort || "popular";
  const genre = params?.genre || "all";

  const [movieData, genres] = await Promise.all([
    getMovies({ query, page, sort, genre, limit: 20 }),
    getCategories(),
  ]);

  return (
    <div className="container mx-auto px-6 min-h-screen pt-32 pb-12">
      <div className="flex flex-col gap-8 mb-10">
        <div>
          {/* NEO-NOIR TYPOGRAPHY */}
          <h1 className="text-4xl font-serif font-bold text-silver tracking-wide mb-2">
            Explore Collection
          </h1>
          <p className="text-pewter font-mono text-xs uppercase tracking-widest border-l-2 border-gold/50 pl-3">
            {movieData.metadata.total} Titles Indexed
          </p>
        </div>

        <ControlBar genres={genres} />
      </div>

      <MediaGrid movies={movieData.data} pagination={movieData.metadata} />
    </div>
  );
}
