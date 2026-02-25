import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { SocksProxyAgent } from "socks-proxy-agent";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

// 1. Configure the SOCKS5 proxy
const proxyUrl = "socks5://127.0.0.1:10808";
const httpsAgent = new SocksProxyAgent(proxyUrl);

// 2. TMDB API Key & Config
const TMDB_API_KEY = "ce4f1aad7d852252c23bfcbd2b790f64";
const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";
const FAILED_LOG_PATH = path.join(process.cwd(), "failed_enrichments.json");

// --- UTILITY: Clean messy archive titles ---
function cleanTitle(rawTitle) {
  let title = rawTitle;
  title = title.replace(/\([^)]*\)/g, "");
  title = title.replace(/\b(1080p|720p|4k|remaster|hd|mp4|mkv|avi)\b/gi, "");
  title = title.replace(/[_-]/g, " ");
  return title.replace(/\s+/g, " ").trim();
}

// --- UTILITY: Manage Failed IDs ---
async function loadFailedIds() {
  try {
    const data = await fs.readFile(FAILED_LOG_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return []; // Return empty array if file doesn't exist yet
  }
}

async function saveFailedId(failedIds, newId) {
  failedIds.push(newId);
  await fs.writeFile(FAILED_LOG_PATH, JSON.stringify(failedIds, null, 2));
}

async function enrichTopMovies() {
  console.log("🚀 Booting Production Enrichment Script...");

  const failedIds = await loadFailedIds();
  if (failedIds.length > 0) {
    console.log(`📂 Loaded ${failedIds.length} previously failed IDs to skip.`);
  }

  try {
    // --- FOOLPROOF RESUME LOGIC ---
    // Fetch top 200 movies that are NOT verified, and NOT in the failed ledger
    const movies = await prisma.movie.findMany({
      where: {
        isVerified: false,
        id: { notIn: failedIds },
      },
      orderBy: { downloads: "desc" },
      take: 200,
      include: { categories: true },
    });

    if (movies.length === 0) {
      console.log("✅ No unenriched movies left to process!");
      return;
    }

    console.log(`📦 Found ${movies.length} fresh movies to enrich.\n`);

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < movies.length; i++) {
      const movie = movies[i];
      const searchTitle = cleanTitle(movie.title);

      // Clearer logging formatting
      process.stdout.write(
        `[${(i + 1).toString().padStart(3, "0")}/${movies.length}] 🎬 ${searchTitle.padEnd(40).substring(0, 40)} `,
      );

      try {
        // --- STEP A: Search TMDB ---
        const searchParams = {
          api_key: TMDB_API_KEY,
          query: searchTitle,
          language: "en-US",
        };

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
          console.log("❌ No Match");
          await saveFailedId(failedIds, movie.id);
          failCount++;
          continue;
        }

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
          : movie.posterFile;

        const finalYear = tmdbData.release_date
          ? parseInt(tmdbData.release_date.split("-")[0])
          : movie.year;

        const categoryConnections = tmdbData.genres.map((g) => ({
          where: { name: g.name },
          create: { name: g.name },
        }));

        // --- STEP D: Database Overwrite ---
        await prisma.movie.update({
          where: { id: movie.id },
          data: {
            title: tmdbData.title,
            description: tmdbData.overview || movie.description,
            year: finalYear,
            runtime: tmdbData.runtime || movie.runtime,
            posterFile: finalPoster,
            categories: {
              set: [],
              connectOrCreate: categoryConnections,
            },
            isVerified: true,
          },
        });

        console.log("✅ Success");
        successCount++;
      } catch (err) {
        console.log(`⚠️ Error (${err.message})`);
        await saveFailedId(failedIds, movie.id);
        failCount++;
      }

      // Respect TMDB rate limits
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    console.log("\n====================================");
    console.log("🎉 BATCH ENRICHMENT COMPLETE!");
    console.log(`Successfully Enriched : ${successCount}`);
    console.log(`Failed / Skipped      : ${failCount}`);
    console.log("====================================\n");
  } catch (error) {
    console.error("\n🚨 Critical Script Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

enrichTopMovies();
