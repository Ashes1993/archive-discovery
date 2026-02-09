import { getMovies } from "@/actions/media";
import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { Spotlight } from "@/components/home/Spotlight";
import { GenreVault } from "@/components/home/GenreVault";

export const revalidate = 3600;

export default async function Home() {
  // Fetch some movies for the Hero and Marquee
  const featuredData = await getMovies({ sort: "downloads", limit: 10 });
  const newArrivals = await getMovies({ sort: "newest", limit: 10 });

  return (
    <main className="min-h-screen bg-noir">
      {/* 1. HERO: The Introduction */}
      <Hero featuredMovies={featuredData.data} />

      {/* 2. GENRE VAULT: Quick Navigation (Placed high for usability) */}
      <GenreVault />

      {/* 3. MARQUEE: "Trending Now" */}
      <Marquee title="Crowd Favorites" movies={featuredData.data} />

      {/* 4. SPOTLIGHT: Featured Masterpiece */}
      <Spotlight />

      {/* 5. MARQUEE: "Just Added" */}
      <Marquee title="Recently Restored" movies={newArrivals.data} />
    </main>
  );
}
