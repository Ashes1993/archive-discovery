import { PrismaClient } from "@prisma/client";
import { fetchClient } from "../src/lib/fetchClient.js";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });

const prisma = new PrismaClient();

const SEARCH_URL = "https://archive.org/advancedsearch.php";
const METADATA_BASE = "https://archive.org/metadata";
const MOVIES_TO_FETCH = 50;

// --- UTILS ---
const cleanString = (str) => {
  if (!str) return null;
  if (Array.isArray(str)) return str[0].toString().trim();
  return str.toString().trim();
};

// Check for Audio Garbage (Old Time Radio, Podcasts, Audiobooks)
const isGarbage = (doc, files) => {
  const title = (doc.title || "").toLowerCase();
  const collections = Array.isArray(doc.collection)
    ? doc.collection
    : [doc.collection];

  // 1. Check Title Keywords
  if (
    title.includes("old time radio") ||
    title.includes("audiobook") ||
    title.includes("soundtrack") ||
    title.includes("reading of")
  ) {
    return true;
  }

  // 2. Check Collections
  const bannedCollections = [
    "oldtimeradio",
    "radioprograms",
    "audio_book",
    "librivox",
    "podcast",
    "78rpm",
    "etree",
    "audio_poetry",
  ];
  if (collections.some((c) => bannedCollections.includes(c))) return true;

  // 3. THE "SOURCE AUDIT"
  if (files && Array.isArray(files)) {
    const originalFile = files.find((f) => f.source === "original");
    if (originalFile) {
      const ext = originalFile.name.split(".").pop().toLowerCase();
      const audioExtensions = [
        "mp3",
        "flac",
        "wav",
        "ogg",
        "m4a",
        "wma",
        "aac",
      ];
      if (audioExtensions.includes(ext)) {
        return true; // BANNED: Origin was audio
      }
    }
  }

  return false;
};

const cleanColor = (val) => {
  if (!val) return null;
  const str = val.toString().toLowerCase().trim();
  if (str.includes("black") && str.includes("white")) return "Black & White";
  if (str.includes("b&w")) return "Black & White";
  if (str.includes("color") || str.includes("colour")) return "Color";
  return null;
};

const cleanLanguage = (val) => {
  if (!val) return null;
  const str = Array.isArray(val) ? val[0].toString() : val.toString();
  const cleaned = str.trim();
  if (cleaned.length === 0) return null;
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
};

const extractYear = (dateStr) => {
  if (!dateStr) return null;
  const match = dateStr.toString().match(/\d{4}/);
  return match ? parseInt(match[0]) : null;
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
  return list.filter(
    (c) =>
      !c.startsWith("fav-") &&
      !c.startsWith("opensource") &&
      !c.startsWith("feature_films") &&
      !c.startsWith("moviesandfilms"),
  );
};

const cleanTags = (subject) => {
  if (!subject) return [];
  const list = Array.isArray(subject) ? subject : [subject];
  return list.map((t) => t.toLowerCase()).filter((t) => t.length < 30);
};

async function main() {
  console.log("🌱 Starting Rich Data Seed...");

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

  const queryString = new URLSearchParams(searchParams).toString();
  const searchResponse = await fetchClient(`${SEARCH_URL}?${queryString}`);

  if (!searchResponse.ok)
    throw new Error(`Search failed: ${searchResponse.status}`);

  const searchData = await searchResponse.json();
  const docs = searchData.response.docs;

  console.log(`Found ${docs.length} candidates. Fetching detailed metadata...`);

  for (const doc of docs) {
    const archiveId = doc.identifier;
    process.stdout.write(`Processing: ${doc.title.substring(0, 30)}... `);

    try {
      const metaResponse = await fetchClient(`${METADATA_BASE}/${archiveId}`);
      const metaData = await metaResponse.json();
      const files = metaData.files;
      const details = metaData.metadata;

      // 1. GARBAGE CHECK
      if (isGarbage(doc, files)) {
        console.log(`🗑️ Skipped (Audio/Fake Video)`);
        continue;
      }

      // 2. VIDEO FILE SELECTION (The New Tiered Logic)
      const BYTES_IN_MB = 1024 * 1024;
      const MIN_SIZE_MB = 150; // Threshold for "Real Movie"

      // TIER 1: Gold Standard (h.264)
      let videoFile = files.find(
        (f) =>
          (f.format === "h.264" || f.format === "h.264 IA") &&
          f.source === "derivative" &&
          !f.name.includes("512kb"),
      );

      // TIER 2: Silver Standard (MPEG4/Ogg) - CHECK SIZE
      if (!videoFile) {
        const fallback = files.find(
          (f) =>
            (f.format === "MPEG4" || f.format === "Ogg Video") &&
            f.source === "derivative",
        );

        if (fallback) {
          const size = parseInt(fallback.size || "0");
          const sizeMB = size / BYTES_IN_MB;
          if (sizeMB > MIN_SIZE_MB) {
            videoFile = fallback; // Accepted: Big enough
          }
        }
      }

      // If still no video, skip
      if (!videoFile) {
        console.log("⚠️ Skipped (No suitable video source)");
        continue;
      }

      const posterFile = files.find(
        (f) =>
          f.format === "Thumbnail" ||
          f.name.endsWith(".jpg") ||
          f.name.endsWith(".png"),
      );

      // 3. REVIEWS
      const reviewsData = Array.isArray(metaData.reviews)
        ? metaData.reviews.slice(0, 5).map((r) => ({
            author: r.reviewer || "Anonymous",
            body: r.reviewbody || "",
            rating: parseInt(r.stars) || 0,
            date: r.createdate ? new Date(r.createdate) : new Date(),
          }))
        : [];

      // 4. SMART YEAR
      let finalYear = parseInt(doc.year);
      if (!finalYear || isNaN(finalYear)) {
        finalYear = extractYear(details.date);
      }

      // 5. DB UPSERT
      await prisma.movie.upsert({
        where: { archiveId },
        update: {
          creator: cleanString(details.creator),
          language: cleanLanguage(details.language),
          color: cleanColor(details.color),
          licenseUrl: cleanString(details.licenseurl),
          year: finalYear || null,
          publicDate: details.publicdate ? new Date(details.publicdate) : null,
          reviews: {
            deleteMany: {},
            create: reviewsData,
          },
        },
        create: {
          archiveId,
          title: cleanString(doc.title),
          description: cleanString(doc.description),
          year: finalYear || null,
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
          tags: {
            connectOrCreate: cleanTags(doc.subject).map((t) => ({
              where: { name: t },
              create: { name: t },
            })),
          },
          reviews: {
            create: reviewsData,
          },
        },
      });

      console.log(
        `✅ Updated: ${cleanString(doc.title)} [${finalYear || "No Year"}]`,
      );
    } catch (err) {
      console.log(`❌ Error: ${err.message}`);
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
