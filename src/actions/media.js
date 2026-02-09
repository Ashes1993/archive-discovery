"use server";

import { prisma } from "@/lib/prisma";

export async function getMovies({
  query = "",
  page = 1,
  limit = 20,
  sort = "popular",
  genre = "all",
} = {}) {
  try {
    const skip = (page - 1) * limit;

    // 1. Dynamic "Where" Clause
    const where = {};

    // Search Logic
    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ];
    }

    // Genre Logic (Relational Filtering)
    if (genre && genre !== "all") {
      where.categories = {
        some: {
          name: genre,
        },
      };
    }

    // 2. Dynamic "Order By"
    let orderBy = {};
    switch (sort) {
      case "newest":
        orderBy = { year: "desc" };
        break;
      case "oldest":
        orderBy = { year: "asc" };
        break;
      case "rating":
        orderBy = { rating: "desc" };
        break;
      case "popular":
      default:
        orderBy = { downloads: "desc" };
        break;
    }

    // 3. Fetch Data
    const [movies, total] = await Promise.all([
      prisma.movie.findMany({
        where,
        take: limit,
        skip,
        orderBy,
        include: { categories: true },
      }),
      prisma.movie.count({ where }),
    ]);

    return {
      data: movies,
      metadata: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("❌ Failed to fetch movies:", error);
    return { data: [], metadata: { total: 0, page: 1, totalPages: 0 } };
  }
}

export async function getMovie(archiveId) {
  try {
    // 1. Fetch the main movie
    const movie = await prisma.movie.findUnique({
      where: { archiveId },
      include: {
        categories: true,
        tags: true,
        reviews: { orderBy: { date: "desc" }, take: 10 },
      },
    });

    if (!movie) return null;

    // 2. Fetch "Related" movies (Same category, excluding current one)
    // We take the first category to find matches
    const primaryCategory = movie.categories[0]?.name;

    const related = await prisma.movie.findMany({
      where: {
        AND: [
          { archiveId: { not: archiveId } }, // Exclude current
          { categories: { some: { name: primaryCategory } } },
        ],
      },
      take: 6, // Show 6 suggestions
      orderBy: { downloads: "desc" },
      include: { categories: true },
    });

    // Fallback: If no related found (e.g. unique genre), just get popular ones
    if (related.length === 0) {
      const popular = await prisma.movie.findMany({
        where: { archiveId: { not: archiveId } },
        take: 6,
        orderBy: { downloads: "desc" },
      });
      return { movie, related: popular };
    }

    return { movie, related };
  } catch (error) {
    console.error("❌ Failed to fetch movie:", error);
    return null;
  }
}
