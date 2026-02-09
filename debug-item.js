import dotenv from "dotenv";
// 1. Load Environment Variables FIRST
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });

async function audit() {
  // 2. Import fetchClient dynamically (after env vars are loaded)
  const { fetchClient } = await import("./src/lib/fetchClient.js");

  const SEARCH_URL = "https://archive.org/advancedsearch.php";
  const MOVIES_TO_FETCH = 50;

  console.log("🔍 Searching for top 50 movies (same query as Seeder)...");

  const searchParams = {
    q: "collection:(feature_films) AND mediatype:(movies)",
    fl: ["identifier", "title", "downloads"],
    sort: ["downloads desc"],
    rows: MOVIES_TO_FETCH,
    output: "json",
  };

  try {
    const queryString = new URLSearchParams(searchParams).toString();
    const searchResponse = await fetchClient(`${SEARCH_URL}?${queryString}`);
    const searchData = await searchResponse.json();
    const docs = searchData.response.docs;

    console.log(`Found ${docs.length} candidates. Analyzing file formats...\n`);
    console.log(
      "Legend: ✅ = Has h.264 (Safe to Keep) | ❌ = No h.264 (Would be Dropped)\n",
    );

    let droppedCount = 0;

    for (const doc of docs) {
      const archiveId = doc.identifier;
      const metaUrl = `https://archive.org/metadata/${archiveId}`;

      const res = await fetchClient(metaUrl);
      const data = await res.json();
      const files = data.files || [];

      // THE TEST: Does it have a high-quality h.264 derivative?
      const hasH264 = files.some(
        (f) =>
          (f.format === "h.264" || f.format === "h.264 IA") &&
          f.source === "derivative" &&
          !f.name.includes("512kb"),
      );

      // Collect formats for debugging context
      const allFormats = files
        .filter(
          (f) =>
            f.format &&
            (f.format.includes("Video") ||
              f.format === "MPEG4" ||
              f.format === "h.264"),
        )
        .map((f) => f.format);
      const uniqueFormats = [...new Set(allFormats)];

      if (hasH264) {
        // Only print title to keep log clean
        console.log(`✅ ${doc.title.substring(0, 50)}`);
      } else {
        droppedCount++;
        console.log(`❌ [DROP WARNING] ${doc.title}`);
        console.log(
          `       Reason: Only has formats: [${uniqueFormats.join(", ")}]`,
        );
        console.log(`       ID: ${archiveId}`);
        console.log(
          `       ---------------------------------------------------`,
        );
      }
    }

    console.log(`\n📊 SUMMARY:`);
    console.log(`   Total: ${docs.length}`);
    console.log(`   Kept:  ${docs.length - droppedCount}`);
    console.log(`   Dropped: ${droppedCount}`);
  } catch (e) {
    console.error("Critical Error:", e);
  }
}

audit();
