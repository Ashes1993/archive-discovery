import type { Prisma } from "@prisma/client";

export type MovieSort =
  | "popular"
  | "newest"
  | "oldest"
  | "rating"
  | "downloads";

export type MovieSearchParams = {
  query?: string;
  page?: number;
  limit?: number;
  sort?: MovieSort;
  genre?: string;
};

export type PaginationMetadata = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type MovieWithCategories = Prisma.MovieGetPayload<{
  include: {
    categories: true;
  };
}>;

export type MovieDetails = Prisma.MovieGetPayload<{
  include: {
    categories: true;
    tags: true;
    reviews: {
      orderBy: {
        date: "desc";
      };
      take: 10;
    };
  };
}>;

export type RelatedMovie = Prisma.MovieGetPayload<{
  include: {
    categories: true;
  };
}>;

export type MovieListResult = {
  data: MovieWithCategories[];
  metadata: PaginationMetadata;
};

export type MovieDetailsResult = {
  movie: MovieDetails;
  related: RelatedMovie[];
};

export type CollectionSummary = {
  id: string;
  name: string;
  slug: string;
  count: number;
  coverUrl: string | null;
};
