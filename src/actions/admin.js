"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. Fetch Movies for the Admin Table
export async function getAdminMovies({
  page = 1,
  search = "",
  filter = "all",
}) {
  const limit = 50;
  const skip = (page - 1) * limit;

  const where = {};

  if (search) {
    where.title = { contains: search, mode: "insensitive" };
  }

  // --- NEW FILTERS INTEGRATED ---
  if (filter === "missing_poster") where.posterFile = null;
  else if (filter === "missing_year") where.year = null;
  else if (filter === "missing_director") where.creator = null;
  else if (filter === "missing_runtime") where.runtime = null;
  else if (filter === "missing_color") where.color = null;
  else if (filter === "missing_description") where.description = null;

  const [movies, total] = await Promise.all([
    prisma.movie.findMany({
      where,
      select: {
        id: true,
        archiveId: true,
        title: true,
        description: true, // <-- ADDED DESCRIPTION
        year: true,
        runtime: true,
        color: true,
        posterFile: true,
        videoFile: true,
        creator: true,
        isVerified: true,
        downloads: true,
      },
      orderBy: [{ isVerified: "asc" }, { downloads: "desc" }],
      skip,
      take: limit,
    }),
    prisma.movie.count({ where }),
  ]);

  return {
    movies,
    totalPages: Math.ceil(total / limit),
    totalMovies: total,
  };
}

// 2. Save Corrections
export async function updateMovieAdmin(id, data) {
  try {
    await prisma.movie.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description, // <-- ADDED DESCRIPTION
        year: data.year ? parseInt(data.year) : null,
        runtime: data.runtime ? parseInt(data.runtime) : null,
        color: data.color,
        posterFile: data.posterFile,
        videoFile: data.videoFile,
        creator: data.creator,
        isVerified: data.isVerified,
      },
    });

    revalidatePath("/");
    revalidatePath("/media");
    revalidatePath(`/media/${data.archiveId}`);
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Admin Update Error:", error);
    return { success: false, error: "Failed to update movie." };
  }
}

// 3. Delete Movie (NEW)
export async function deleteMovieAdmin(id) {
  try {
    await prisma.movie.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/media");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Admin Delete Error:", error);
    return { success: false, error: "Failed to delete movie." };
  }
}
