import { PrismaClient } from "@prisma/client";
import * as xlsx from "xlsx";

const prisma = new PrismaClient();

async function exportMoviesToExcel() {
  console.log("📦 Querying the database for all movies...");

  try {
    // 1. Fetch every movie record from your database
    const movies = await prisma.movie.findMany({
      orderBy: {
        title: "asc", // Sorts them alphabetically to make the Excel file cleaner
      },
    });

    if (movies.length === 0) {
      console.log("⚠️ No movies found in the database.");
      return;
    }

    console.log(
      `✅ Retrieved ${movies.length} movies. Generating spreadsheet...`,
    );

    // 2. Format dates so Excel doesn't get confused by JavaScript Date objects
    const formattedMovies = movies.map((movie) => ({
      ...movie,
      publicDate: movie.publicDate
        ? movie.publicDate.toISOString().split("T")[0]
        : null,
      createdAt: movie.createdAt
        ? movie.createdAt.toISOString().split("T")[0]
        : null,
      updatedAt: movie.updatedAt
        ? movie.updatedAt.toISOString().split("T")[0]
        : null,
    }));

    // 3. Convert the JSON array into an Excel worksheet
    const worksheet = xlsx.utils.json_to_sheet(formattedMovies);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Vault Inventory");

    // 4. Save the file to your machine
    const fileName = "Vault_Database_Export.xlsx";
    xlsx.writeFile(workbook, fileName);

    console.log(
      `🎉 Success! Your database has been exported to "${fileName}".`,
    );
  } catch (error) {
    console.error("❌ Export Error:", error.message);
  } finally {
    // Always disconnect Prisma when the script finishes
    await prisma.$disconnect();
  }
}

exportMoviesToExcel();
