import { Hero } from "@/components/home/Hero";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600; // Revalidate every hour

async function getFeaturedMovies() {
  // Fetch 3 movies with high download counts to show in the Hero
  return await prisma.movie.findMany({
    take: 3,
    orderBy: { downloads: "desc" },
    select: { id: true, title: true, archiveId: true, posterFile: true },
  });
}

export default async function Home() {
  const featuredMovies = await getFeaturedMovies();

  return (
    <div className="min-h-screen">
      <Hero featuredMovies={featuredMovies} />

      {/* (Optional) We can add a "Featured Collections" strip here later */}
    </div>
  );
}
