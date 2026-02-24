"use server";
import { prisma } from "@/lib/prisma";

export async function getCollections() {
  // 1. Fetch categories that contain AT LEAST ONE enriched movie (has an HTTP poster)
  const categories = await prisma.category.findMany({
    where: {
      movies: {
        some: {
          posterFile: { startsWith: "http" },
        },
      },
    },
    include: {
      // Get total count of movies in this category
      _count: {
        select: { movies: true },
      },
      // Fetch the MOST POPULAR enriched movie to use as the background cover
      movies: {
        where: {
          posterFile: { startsWith: "http" },
        },
        take: 1,
        orderBy: { downloads: "desc" },
        select: {
          posterFile: true,
        },
      },
    },
  });

  // 2. Clean and Sort
  const cleaned = categories
    .filter((c) => c._count.movies > 0 && c.movies.length > 0)
    .map((c) => ({
      id: c.id,
      name: c.name, // TMDB genres are already nicely capitalized (e.g., "Science Fiction")
      slug: c.name, // Keep exact name for URL routing
      count: c._count.movies,
      coverUrl: c.movies[0].posterFile, // Use the direct TMDB/Cloudinary URL
    }))
    .sort((a, b) => b.count - a.count); // Show largest collections first

  return cleaned;
}
