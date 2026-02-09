"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export function ControlBar({ genres = [] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Helper to update URL params
  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1"); // Reset pagination
    router.replace(`/media?${params.toString()}`);
  };

  const handleSearch = useDebouncedCallback((term) => {
    updateParam("q", term);
  }, 300);

  return (
    <div className="bg-surface border border-border-subtle p-4 rounded-md flex flex-col md:flex-row gap-4 items-center justify-between w-full shadow-lg shadow-black/20">
      {/* SEARCH INPUT */}
      <div className="relative w-full md:w-96 group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-4 w-4 text-pewter group-focus-within:text-gold transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search the archive..."
          defaultValue={searchParams.get("q")?.toString()}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full bg-noir border border-border-subtle text-silver text-sm rounded-sm focus:ring-1 focus:ring-gold/20 focus:border-gold/50 block pl-10 p-2.5 outline-none transition-all placeholder:text-zinc-700 font-sans tracking-wide"
        />
      </div>

      {/* FILTERS AREA */}
      <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
        {/* Genre Select */}
        <div className="relative">
          <select
            onChange={(e) => updateParam("genre", e.target.value)}
            defaultValue={searchParams.get("genre") || "all"}
            className="appearance-none bg-noir border border-border-subtle text-pewter text-sm rounded-sm focus:ring-1 focus:ring-gold/20 focus:border-gold/50 block w-full p-2.5 pr-8 outline-none cursor-pointer hover:border-border-active transition-colors font-sans uppercase tracking-wider"
          >
            <option value="all">All Genres</option>
            {genres.map((g) => (
              <option key={g} value={g}>
                {g.replace(/_/g, " ")}
              </option>
            ))}
          </select>
          {/* Custom Dropdown Arrow (Since we used appearance-none) */}
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-pewter">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>
        </div>

        {/* Sort Select */}
        <div className="relative">
          <select
            onChange={(e) => updateParam("sort", e.target.value)}
            defaultValue={searchParams.get("sort") || "popular"}
            className="appearance-none bg-noir border border-border-subtle text-pewter text-sm rounded-sm focus:ring-1 focus:ring-gold/20 focus:border-gold/50 block w-full p-2.5 pr-8 outline-none cursor-pointer hover:border-border-active transition-colors font-sans uppercase tracking-wider"
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest Year</option>
            <option value="oldest">Oldest Year</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-pewter">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
