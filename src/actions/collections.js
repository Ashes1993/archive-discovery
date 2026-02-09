"use server";
import { prisma } from "@/lib/prisma";

export async function getCollections() {
  // 1. Fetch all categories with their movie count
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { movies: true },
      },
      // Fetch the MOST POPULAR movie in this category to use as the cover
      movies: {
        take: 1,
        orderBy: { downloads: "desc" },
        select: {
          posterFile: true,
          archiveId: true,
          color: true, // We can use this to add a B&W badge to the collection too!
        },
      },
    },
  });

  // 2. Filter & Clean
  // We exclude generic technical tags and tiny collections
  const BANNED_COLLECTIONS = [
    "feature_films",
    "moviesandfilms",
    "archive_films",
    "uncategorized",
  ];

  const cleaned = categories
    .filter(
      (c) =>
        c._count.movies > 0 && // Must have movies
        !BANNED_COLLECTIONS.includes(c.name.toLowerCase()),
    )
    .map((c) => ({
      id: c.id,
      name: formatName(c.name),
      slug: c.name, // Keep original for URL
      count: c._count.movies,
      cover: c.movies[0]
        ? {
            url: `https://archive.org/download/${c.movies[0].archiveId}/${c.movies[0].posterFile}`,
            color: c.movies[0].color,
          }
        : null,
    }))
    .sort((a, b) => b.count - a.count); // Show biggest collections first

  return cleaned;
}

// Helper: "sci_fi_horror" -> "Sci-Fi Horror"
function formatName(str) {
  return str
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
