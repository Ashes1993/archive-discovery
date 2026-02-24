import axios from "axios";
import * as xlsx from "xlsx";
import { SocksProxyAgent } from "socks-proxy-agent";

// 1. Define your proxy URL
const httpsAgent = new SocksProxyAgent("socks5://127.0.0.1:10808");

async function scrapeArchiveProperties() {
  console.log("🎬 Step 1: Fetching the first 50 movie identifiers...");

  try {
    const searchUrl = "https://archive.org/advancedsearch.php";
    const searchParams = {
      q: "mediatype:movies",
      "fl[]": "identifier",
      rows: 50,
      page: 1,
      output: "json",
    };

    // 2. Inject the proxy agent into the initial search request
    const searchRes = await axios.get(searchUrl, {
      params: searchParams,
      httpsAgent,
      proxy: false, // Forces Axios to use the httpsAgent
    });

    const movies = searchRes.data.response.docs;
    const allMoviesData = [];

    console.log(
      "🕵️‍♂️ Step 2: Fetching deep metadata and files for each movie...",
    );

    for (let i = 0; i < movies.length; i++) {
      const id = movies[i].identifier;
      process.stdout.write(
        `\rFetching details for movie ${i + 1}/50: ${id}...`.padEnd(80),
      );

      try {
        // 3. Inject the proxy agent into the metadata requests
        const metaRes = await axios.get(`https://archive.org/metadata/${id}`, {
          httpsAgent,
          proxy: false,
        });

        const metadata = metaRes.data.metadata;
        const files = metaRes.data.files; // <-- Grab the physical files array!

        // Flatten the JSON for Excel
        const flatMetadata = {};
        for (const key in metadata) {
          if (Array.isArray(metadata[key])) {
            flatMetadata[key] = metadata[key].join(" | ");
          } else if (
            typeof metadata[key] === "object" &&
            metadata[key] !== null
          ) {
            flatMetadata[key] = JSON.stringify(metadata[key]);
          } else {
            flatMetadata[key] = metadata[key];
          }
        }

        // --- NEW: EXTRACT ALL VIDEOS ---
        const videoLinks = [];

        if (files && Array.isArray(files)) {
          files.forEach((file) => {
            const fileName = (file.name || "").toLowerCase();
            const format = (file.format || "").toLowerCase();

            // Check if the file is a standard video format
            const isVideo =
              fileName.endsWith(".mp4") ||
              fileName.endsWith(".mkv") ||
              fileName.endsWith(".avi") ||
              fileName.endsWith(".mov") ||
              fileName.endsWith(".webm") ||
              fileName.endsWith(".ogv") ||
              format.includes("mpeg4") ||
              format.includes("h.264") ||
              format.includes("ogg video");

            if (isVideo) {
              const fileUrl = `https://archive.org/download/${id}/${file.name}`;
              // Format it nicely: [Format] URL
              videoLinks.push(
                `[${file.format || "Unknown Format"}] ${fileUrl}`,
              );
            }
          });
        }

        // Add the video data to our Excel row
        flatMetadata["Total_Videos_Found"] = videoLinks.length;
        flatMetadata["All_Video_Links"] =
          videoLinks.length > 0
            ? videoLinks.join("  ||  ") // Separate multiple videos with a double pipe
            : "No videos found";

        allMoviesData.push(flatMetadata);
      } catch (err) {
        console.error(
          `\n❌ Failed to fetch deep metadata for ${id}:`,
          err.message,
        );
      }

      // Be polite to the API
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    console.log("\n\n📊 Step 3: Compiling the Excel file...");

    const worksheet = xlsx.utils.json_to_sheet(allMoviesData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Raw Movie Data");

    const fileName = "Archive_Raw_Properties.xlsx";
    xlsx.writeFile(workbook, fileName);

    console.log(
      `✅ Success! Open "${fileName}" to inspect all available API properties.`,
    );
  } catch (error) {
    console.error("\nCritical Script Error:", error.message);
  }
}

scrapeArchiveProperties();
