import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { SocksProxyAgent } from "socks-proxy-agent";

const prisma = new PrismaClient();

// 1. Configure the SOCKS5 proxy
const proxyUrl = "socks5://127.0.0.1:10808";
const httpsAgent = new SocksProxyAgent(proxyUrl);

// 2. TMDB API Key
const TMDB_API_KEY = "ce4f1aad7d852252c23bfcbd2b790f64";
const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";

// --- UTILITY: Clean messy archive titles ---
function cleanTitle(rawTitle) {
  let title = rawTitle;
  // Remove anything inside parentheses, e.g., "(1968)"
  title = title.replace(/\([^)]*\)/g, "");
  // Remove common archive garbage tags
  title = title.replace(/\b(1080p|720p|4k|remaster|hd|mp4|mkv|avi)\b/gi, "");
  // Replace underscores and hyphens with spaces
  title = title.replace(/[_-]/g, " ");
  // Trim extra spaces
  return title.replace(/\s+/g, " ").trim();
}

async function enrichTopMovies() {
  console.log("🚀 Starting TMDB Enrichment for Top 100 Movies...");

  try {
    // 1. Fetch the top 100 movies sorted by downloads (highest first)
    const movies = await prisma.movie.findMany({
      orderBy: { downloads: "desc" },
      take: 100,
      include: { categories: true }, // Include so we can see what we are replacing
    });

    console.log(`📦 Found ${movies.length} movies to enrich.\n`);

    let successCount = 0;
    let failCount = 0;

    // 2. Loop through each movie sequentially to respect API limits
    for (let i = 0; i < movies.length; i++) {
      const movie = movies[i];
      const searchTitle = cleanTitle(movie.title);

      process.stdout.write(`[${i + 1}/100] Enriching "${searchTitle}"... `);

      try {
        // --- STEP A: Search TMDB (Strict Match Strategy) ---
        const searchParams = {
          api_key: TMDB_API_KEY,
          query: searchTitle,
          language: "en-US",
        };

        // If we have a year, strictly enforce it for accuracy
        if (movie.year) {
          searchParams.primary_release_year = movie.year;
        }

        const searchRes = await axios.get(
          "https://api.themoviedb.org/3/search/movie",
          {
            params: searchParams,
            httpsAgent,
            proxy: false,
          },
        );

        const results = searchRes.data.results;

        if (!results || results.length === 0) {
          console.log("❌ No TMDB match found.");
          failCount++;
          continue; // Skip to the next movie
        }

        // Take the absolute best match
        const topMatch = results[0];

        // --- STEP B: Fetch Deep Details ---
        const detailsRes = await axios.get(
          `https://api.themoviedb.org/3/movie/${topMatch.id}`,
          {
            params: { api_key: TMDB_API_KEY, language: "en-US" },
            httpsAgent,
            proxy: false,
          },
        );

        const tmdbData = detailsRes.data;

        // --- STEP C: Prepare the Data ---
        const finalPoster = tmdbData.poster_path
          ? `${POSTER_BASE_URL}${tmdbData.poster_path}`
          : movie.posterFile; // Keep old poster only if TMDB has absolutely nothing

        const finalYear = tmdbData.release_date
          ? parseInt(tmdbData.release_date.split("-")[0])
          : movie.year;

        // Map TMDB genres to Prisma Category objects
        const categoryConnections = tmdbData.genres.map((g) => ({
          where: { name: g.name },
          create: { name: g.name },
        }));

        // --- STEP D: Database Overwrite ---
        await prisma.movie.update({
          where: { id: movie.id },
          data: {
            title: tmdbData.title, // Use TMDB's official title
            description: tmdbData.overview || movie.description,
            year: finalYear,
            runtime: tmdbData.runtime || movie.runtime,
            posterFile: finalPoster,
            // Wipe out old categories and inject the new clean TMDB ones
            categories: {
              set: [], // Disconnects all existing categories for this movie
              connectOrCreate: categoryConnections, // Adds the clean TMDB genres
            },
            isVerified: true, // Let's mark it verified since TMDB data is solid
          },
        });

        console.log("✅ Success!");
        successCount++;
      } catch (err) {
        console.log(`❌ Failed: ${err.message}`);
        failCount++;
      }

      // Small pause to avoid hitting TMDB rate limits
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    console.log("\n🎉 ENRICHMENT COMPLETE!");
    console.log(`Successfully Updated: ${successCount}`);
    console.log(`Failed/No Match: ${failCount}`);
  } catch (error) {
    console.error("Critical Script Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

enrichTopMovies();
