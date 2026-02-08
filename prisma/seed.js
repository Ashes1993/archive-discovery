import { PrismaClient } from "@prisma/client";
import { fetchClient } from "../src/lib/fetchClient.js"; // Using our Proxy Client
import dotenv from "dotenv";

// Load env vars so fetchClient can see the PROXY settings
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });

const prisma = new PrismaClient();

// CONSTANTS
const SEARCH_URL = "https://archive.org/advancedsearch.php";
const METADATA_BASE = "https://archive.org/metadata";
const MOVIES_TO_FETCH = 50; // Fetch top 50 for now

// UTILS
const cleanString = (str) => (str ? str.toString().trim() : null);

// Convert "1:14:20" or "89 min" to integer minutes
const parseRuntime = (timeStr) => {
  if (!timeStr) return null;
  const str = timeStr.toString();

  // Format: "89 min"
  if (str.includes("min")) return parseInt(str);

  // Format: "HH:MM:SS" or "MM:SS"
  const parts = str.split(":").map(Number);
  if (parts.length === 3) return parts[0] * 60 + parts[1]; // Ignore seconds
  if (parts.length === 2) return parts[0];
  return null;
};

// Filter out garbage collections
const cleanCollections = (list) => {
  if (!Array.isArray(list)) return [];
  return list.filter(
    (c) =>
      !c.startsWith("fav-") &&
      !c.startsWith("opensource") &&
      !c.startsWith("feature_films") &&
      !c.startsWith("moviesandfilms"),
  );
};

// Filter out garbage tags/subjects
const cleanTags = (subject) => {
  if (!subject) return [];
  const list = Array.isArray(subject) ? subject : [subject];
  return list.map((t) => t.toLowerCase()).filter((t) => t.length < 20); // Remove massive spam tags
};

async function main() {
  console.log("🌱 Starting Smart Seed...");

  // 1. SEARCH: Get top movies
  const searchParams = {
    q: "collection:(feature_films) AND mediatype:(movies)",
    fl: [
      "identifier",
      "title",
      "description",
      "year",
      "downloads",
      "avg_rating",
      "runtime",
      "collection",
      "subject",
    ],
    sort: ["downloads desc"],
    rows: MOVIES_TO_FETCH,
    output: "json",
  };

  // Convert params to query string manually because our fetchClient is simple
  const queryString = new URLSearchParams(searchParams).toString();
  const searchResponse = await fetchClient(`${SEARCH_URL}?${queryString}`);

  if (!searchResponse.ok) {
    throw new Error(`Search failed: ${searchResponse.status}`);
  }

  const searchData = await searchResponse.json();
  const docs = searchData.response.docs;

  console.log(`Found ${docs.length} candidates. Fetching metadata...`);

  // 2. PROCESS: Loop through each movie
  for (const doc of docs) {
    const archiveId = doc.identifier;
    console.log(`\nProcessing: ${doc.title}...`);

    try {
      // A. Fetch file list to find the .mp4
      const metaResponse = await fetchClient(`${METADATA_BASE}/${archiveId}`);
      const metaData = await metaResponse.json();
      const files = metaData.files;

      // B. Find BEST video file
      // Logic: Prefer h.264 derivative. Avoid '512kb' low quality ones.
      let videoFile = files.find(
        (f) =>
          f.format === "h.264" &&
          f.source === "derivative" &&
          !f.name.includes("512kb"),
      );

      // Fallback: Any MP4
      if (!videoFile) videoFile = files.find((f) => f.name.endsWith(".mp4"));

      // Skip if no playable video found
      if (!videoFile) {
        console.warn(`   ⚠️ No MP4 found for ${archiveId}. Skipping.`);
        continue;
      }

      // C. Find Poster
      const posterFile = files.find(
        (f) =>
          f.format === "Thumbnail" ||
          f.name.endsWith(".jpg") ||
          f.name.endsWith(".png"),
      );

      // D. Clean Data
      const categories = cleanCollections(doc.collection);
      const tags = cleanTags(doc.subject);
      const runtimeMinutes = parseRuntime(doc.runtime);

      // E. Save to DB
      await prisma.movie.upsert({
        where: { archiveId },
        update: {},
        create: {
          archiveId,
          title: cleanString(doc.title),
          description: cleanString(doc.description),
          year: parseInt(doc.year) || null,
          runtime: runtimeMinutes,
          downloads: doc.downloads,
          rating: doc.avg_rating,
          videoFile: videoFile.name,
          posterFile: posterFile ? posterFile.name : null,
          // Connect/Create Categories
          categories: {
            connectOrCreate: categories.map((c) => ({
              where: { name: c },
              create: { name: c },
            })),
          },
          // Connect/Create Tags
          tags: {
            connectOrCreate: tags.map((t) => ({
              where: { name: t },
              create: { name: t },
            })),
          },
        },
      });

      console.log(`   ✅ Saved! (Video: ${videoFile.name})`);
    } catch (err) {
      console.error(`   ❌ Failed: ${err.message}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
