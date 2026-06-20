import type { Prisma } from "@prisma/client";

export type AdminMovieFilter =
  | "all"
  | "missing_poster"
  | "missing_year"
  | "missing_director"
  | "missing_runtime"
  | "missing_color"
  | "missing_description";

export type AdminMovieSearchParams = {
  page?: number;
  search?: string;
  filter?: AdminMovieFilter;
};

export type AdminMovieRow = Prisma.MovieGetPayload<{
  select: {
    id: true;
    archiveId: true;
    title: true;
    description: true;
    year: true;
    runtime: true;
    color: true;
    posterFile: true;
    videoFile: true;
    creator: true;
    isVerified: true;
    downloads: true;
  };
}>;

export type AdminMoviesResult = {
  movies: AdminMovieRow[];
  totalPages: number;
  totalMovies: number;
};

export type AdminMovieUpdateInput = {
  archiveId: string;
  title: FormDataEntryValue | null;
  description: FormDataEntryValue | null;
  year: FormDataEntryValue | null;
  runtime: FormDataEntryValue | null;
  color: FormDataEntryValue | null;
  posterFile: FormDataEntryValue | null;
  videoFile: FormDataEntryValue | null;
  creator: FormDataEntryValue | null;
  isVerified: boolean;
};

export type ActionResult =
  | { success: true }
  | { success: false; error: string };

export type UploadPosterResult =
  | { success: true; url: string }
  | { success: false; error: string };
