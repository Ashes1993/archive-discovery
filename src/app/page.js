import { getMovies } from "@/actions/media";
import { getCollections } from "@/actions/collections";
import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { Spotlight } from "@/components/home/Spotlight";
import { GenreVault } from "@/components/home/GenreVault";

export const revalidate = 3600;

export default async function Home() {
  // 1. Fetch larger batches so we have enough data after filtering
  const featuredData = await getMovies({ sort: "downloads", limit: 50 });
  const newArrivals = await getMovies({ sort: "newest", limit: 50 });
  const collections = await getCollections();

  // 2. PREMIUM FILTER: Only keep movies with high-res TMDB/Cloudinary posters
  const premiumFeatured = featuredData.data.filter((m) =>
    m.posterFile?.startsWith("http"),
  );
  const premiumNew = newArrivals.data.filter((m) =>
    m.posterFile?.startsWith("http"),
  );

  // 3. Select specific data for components
  const heroMovies = premiumFeatured.slice(0, 5);
  const spotlightMovie = premiumFeatured[0]; // The #1 most popular enriched movie
  const topGenres = collections.slice(0, 4); // Top 4 TMDB genres

  return (
    <main className="min-h-screen bg-noir">
      {/* 1. HERO: The Introduction */}
      <Hero featuredMovies={heroMovies} />

      {/* 2. GENRE VAULT: Now completely dynamic based on TMDB data */}
      <GenreVault genres={topGenres} />

      {/* 3. MARQUEE: "Trending Now" */}
      <Marquee title="Crowd Favorites" movies={premiumFeatured.slice(1, 15)} />

      {/* 4. SPOTLIGHT: Dynamic Featured Masterpiece */}
      {spotlightMovie && <Spotlight movie={spotlightMovie} />}

      {/* 5. MARQUEE: "Just Added" */}
      <Marquee title="Recently Restored" movies={premiumNew.slice(0, 15)} />
    </main>
  );
}
