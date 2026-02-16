import { PrismaClient } from "@prisma/client";
import { fetchClient } from "../src/lib/fetchClient.js";
import dotenv from "dotenv";
import fs from "fs/promises"; // ADDED: For reading/writing the checkpoint file

// Load environment variables
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });

const prisma = new PrismaClient();

// --- CONFIGURATION ---
const SEARCH_URL = "https://archive.org/advancedsearch.php";
const METADATA_BASE = "https://archive.org/metadata";
const PROGRESS_FILE = ".seed-progress"; // The file that stores our current page

// BATCH SETTINGS
const PAGE_SIZE = 50;
const CONCURRENCY_LIMIT = 5;
const SLEEP_BETWEEN_PAGES = 2000;

// --- UTILS ---
const cleanString = (str) => {
  if (!str) return null;
  if (Array.isArray(str)) return str[0].toString().trim();
  return str.toString().trim();
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isGarbage = (doc, files) => {
  const title = (doc.title || "").toLowerCase();
  const collections = Array.isArray(doc.collection)
    ? doc.collection
    : [doc.collection];

  const badKeywords = [
    "old time radio",
    "audiobook",
    "reading of",
    "podcast",
    "chapter",
    "librivox",
  ];
  if (badKeywords.some((kw) => title.includes(kw))) return true;

  const bannedCollections = [
    "oldtimeradio",
    "radioprograms",
    "audio_book",
    "librivox",
    "podcast",
    "78rpm",
    "etree",
  ];
  if (collections.some((c) => bannedCollections.includes(c))) return true;

  if (files && Array.isArray(files)) {
    const original = files.find((f) => f.source === "original");
    if (original) {
      const ext = original.name.split(".").pop().toLowerCase();
      if (["mp3", "flac", "wav", "m4a", "wma"].includes(ext)) return true;
    }
  }
  return false;
};

const cleanColor = (val) => {
  if (!val) return null;
  const str = val.toString().toLowerCase();
  if (str.includes("black") && str.includes("white")) return "Black & White";
  if (str.includes("b&w")) return "Black & White";
  if (str.includes("color")) return "Color";
  return null;
};

const cleanLanguage = (val) => {
  if (!val) return null;
  const str = Array.isArray(val) ? val[0].toString() : val.toString();
  return str.trim().charAt(0).toUpperCase() + str.trim().slice(1).toLowerCase();
};

const parseRuntime = (timeStr) => {
  if (!timeStr) return null;
  const str = timeStr.toString();
  if (str.includes("min")) return parseInt(str);
  const parts = str.split(":").map(Number);
  if (parts.length === 3) return parts[0] * 60 + parts[1];
  if (parts.length === 2) return parts[0];
  return null;
};

const cleanCollections = (list) => {
  if (!Array.isArray(list)) return [];
  const banned = [
    "fav-",
    "opensource",
    "feature_films",
    "moviesandfilms",
    "archive_films",
  ];
  return list.filter((c) => !banned.some((b) => c.startsWith(b)));
};

// --- CORE PROCESSING FUNCTION ---
async function processMovie(doc) {
  try {
    // === OPTIMIZATION: FAST-PATH DUPLICATE CHECK ===
    // If we already have this movie, just update stats and skip the heavy metadata fetch
    const existingMovie = await prisma.movie.findUnique({
      where: { archiveId: doc.identifier },
      select: { archiveId: true }, // Only fetch ID to keep it lightweight
    });

    if (existingMovie) {
      await prisma.movie.update({
        where: { archiveId: doc.identifier },
        data: {
          downloads: doc.downloads,
          rating: doc.avg_rating,
        },
      });
      return { status: "success", reason: "updated existing" };
    }
    // ===============================================

    const metaResponse = await fetchClient(
      `${METADATA_BASE}/${doc.identifier}`,
    );
    if (!metaResponse.ok)
      return { status: "skipped", reason: "Metadata Failed" };

    const metaData = await metaResponse.json();
    const files = metaData.files;
    const details = metaData.metadata;

    if (isGarbage(doc, files))
      return { status: "skipped", reason: "Garbage Content" };

    // VIDEO SELECTION LOGIC
    let videoFile = files.find(
      (f) =>
        (f.format === "h.264" || f.format === "h.264 IA") &&
        f.source === "derivative" &&
        !f.name.includes("512kb"),
    );

    if (!videoFile) {
      const fallback = files.find(
        (f) =>
          (f.format === "MPEG4" || f.format === "Ogg Video") &&
          f.source === "derivative",
      );
      if (fallback && parseInt(fallback.size || "0") / (1024 * 1024) > 150) {
        videoFile = fallback;
      }
    }

    if (!videoFile) return { status: "skipped", reason: "No Video Source" };

    const posterFile = files.find(
      (f) =>
        (f.format === "Thumbnail" || f.name.endsWith(".jpg")) &&
        !f.name.includes("ia_thumb"),
    );

    const reviewsData = (metaData.reviews || []).slice(0, 5).map((r) => ({
      author: r.reviewer || "Anonymous",
      body: r.reviewbody || "",
      rating: parseInt(r.stars) || 0,
      date: r.createdate ? new Date(r.createdate) : new Date(),
    }));

    const finalYear =
      parseInt(doc.year) || parseInt(details.date?.substring(0, 4)) || null;

    // DATABASE CREATE (We know it doesn't exist because of the fast-path check)
    await prisma.movie.create({
      data: {
        archiveId: doc.identifier,
        title: cleanString(doc.title),
        description: cleanString(doc.description),
        year: finalYear,
        runtime: parseRuntime(doc.runtime),
        downloads: doc.downloads,
        rating: doc.avg_rating,
        videoFile: videoFile.name,
        posterFile: posterFile ? posterFile.name : null,
        creator: cleanString(details.creator),
        language: cleanLanguage(details.language),
        color: cleanColor(details.color),
        licenseUrl: cleanString(details.licenseurl),
        publicDate: details.publicdate ? new Date(details.publicdate) : null,
        categories: {
          connectOrCreate: cleanCollections(doc.collection).map((c) => ({
            where: { name: c },
            create: { name: c },
          })),
        },
        reviews: { create: reviewsData },
      },
    });

    return { status: "success" };
  } catch (error) {
    return { status: "error", error: error.message };
  }
}

// --- MAIN LOOP ---
async function main() {
  console.log("📡 Connecting to Archive.org Scrape API...");

  // The dedicated endpoint for getting >10,000 results
  const SCRAPE_URL = "https://archive.org/services/search/v1/scrape";

  let savedCount = 0;
  let skippedCount = 0;
  let batch = 1;
  let cursor = null;

  // === CHECKPOINT RECOVERY (Cursor Based) ===
  try {
    const savedProgress = await fs.readFile(PROGRESS_FILE, "utf-8");
    if (savedProgress && savedProgress.trim().length > 10) {
      cursor = savedProgress.trim();
      console.log(`\n📂 Found cursor checkpoint! Resuming safely...`);
    } else {
      console.log(
        "\n🚀 Starting fresh from the beginning. (Fast-path will skip existing DB entries)...",
      );
    }
  } catch (e) {
    console.log("\n🚀 Starting fresh from the beginning...");
  }
  // ==========================================

  let hasMore = true;

  while (hasMore) {
    process.stdout.write(
      `\n📄 Batch ${batch} | Saved/Updated: ${savedCount} | Skipped: ${skippedCount} : `,
    );

    const params = new URLSearchParams();
    params.append("q", "collection:(feature_films) AND mediatype:(movies)");
    // Note: Scrape API uses 'fields' instead of 'fl', and does not support sorting.
    params.append(
      "fields",
      "identifier,title,description,year,downloads,avg_rating,runtime,collection,subject",
    );

    if (cursor) {
      params.append("cursor", cursor);
    }

    try {
      const res = await fetchClient(`${SCRAPE_URL}?${params.toString()}`);
      if (!res.ok) throw new Error(`Scrape API Failed: ${res.status}`);

      const data = await res.json();
      const docs = data.items; // Scrape API uses .items instead of .response.docs

      if (!docs || docs.length === 0) {
        console.log("\n⚠️ No more docs returned. Reached the end.");
        hasMore = false;
        break;
      }

      // Process batch
      for (let i = 0; i < docs.length; i += CONCURRENCY_LIMIT) {
        const chunk = docs.slice(i, i + CONCURRENCY_LIMIT);
        const results = await Promise.all(
          chunk.map((doc) => processMovie(doc)),
        );

        results.forEach((r) => {
          if (r.status === "success") {
            savedCount++;
            process.stdout.write(r.reason === "updated existing" ? "U" : "█");
          } else {
            skippedCount++;
            process.stdout.write(".");
          }
        });

        await sleep(100);
      }

      // === SAVE CURSOR CHECKPOINT ===
      if (data.cursor) {
        cursor = data.cursor;
        await fs.writeFile(PROGRESS_FILE, cursor, "utf-8");
        batch++;
      } else {
        // If no new cursor is provided, we are finished!
        hasMore = false;
      }

      await sleep(SLEEP_BETWEEN_PAGES);
    } catch (err) {
      console.error(
        `\n❌ Network Error on Batch ${batch}. Retrying in 10s...`,
        err.message,
      );
      await sleep(10000);
      // We do NOT update the cursor, so the next loop retries this exact batch
    }
  }

  // Cleanup: Delete the checkpoint file if we successfully finish everything
  try {
    await fs.unlink(PROGRESS_FILE);
  } catch (e) {
    // Ignore
  }

  console.log("\n\n🎉 ARCHIVE SYNC COMPLETE!");
  console.log(`Total Saved/Updated: ${savedCount}`);
  console.log(`Total Skipped: ${skippedCount}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
