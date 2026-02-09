import { prisma } from "@/lib/prisma";

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // 1. Fetch all movies for dynamic routes
  // (In a real massive app, you might limit this or paginate sitemaps)
  const movies = await prisma.movie.findMany({
    select: {
      archiveId: true,
      publicDate: true,
    },
    take: 1000, // Limit to top 1000 for now to keep it fast
  });

  const movieUrls = movies.map((movie) => ({
    url: `${baseUrl}/media/${movie.archiveId}`,
    lastModified: movie.publicDate || new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // 2. Define Static Routes
  const staticRoutes = [
    "",
    "/media",
    "/collections",
    "/about",
    "/privacy",
    "/terms",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));

  return [...staticRoutes, ...movieUrls];
}
