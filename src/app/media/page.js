import { getMovies } from "@/actions/media";
import { MediaGrid } from "@/components/media/MediaGrid";
import { ControlBar } from "@/components/media/ControlBar";
import { prisma } from "@/lib/prisma"; // We need this to fetch categories once

export const revalidate = 3600;

export const metadata = {
  title: "Browse | Archive Discovery",
  description: "Curated public domain movies.",
};

// Helper to get unique categories for the dropdown
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

  // Fetch movies and categories in parallel
  const [movieData, genres] = await Promise.all([
    getMovies({ query, page, sort, genre, limit: 20 }), // Increased limit to 20 for better grid feel
    getCategories(),
  ]);

  return (
    // FIX: pt-32 adds padding to top so Navbar doesn't cover content
    <div className="container mx-auto px-6 min-h-screen pt-32 pb-12">
      <div className="flex flex-col gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Explore Collection
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {movieData.metadata.total} movies available
          </p>
        </div>

        {/* New Consolidated Control Bar */}
        <ControlBar genres={genres} />
      </div>

      <MediaGrid movies={movieData.data} pagination={movieData.metadata} />
    </div>
  );
}
