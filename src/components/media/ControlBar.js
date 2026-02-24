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
    <div className="bg-surface/80 backdrop-blur-md border border-border-subtle p-3 sm:p-4 rounded-md flex flex-col lg:flex-row gap-4 items-center justify-between w-full shadow-lg shadow-black/40">
      {/* SEARCH INPUT */}
      <div className="relative w-full lg:max-w-md group">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
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
          className="w-full bg-noir border border-border-subtle text-silver text-sm rounded-sm focus:ring-1 focus:ring-gold/30 focus:border-gold/50 block pl-10 p-2.5 outline-none transition-all placeholder:text-zinc-600 font-sans tracking-wide shadow-inner shadow-black/50"
        />
      </div>

      {/* FILTERS AREA */}
      <div className="grid grid-cols-2 lg:flex gap-3 w-full lg:w-auto">
        {/* Genre Select */}
        <div className="relative w-full lg:w-48">
          <select
            onChange={(e) => updateParam("genre", e.target.value)}
            defaultValue={searchParams.get("genre") || "all"}
            className="appearance-none bg-noir border border-border-subtle text-pewter text-sm rounded-sm focus:ring-1 focus:ring-gold/30 focus:border-gold/50 block w-full p-2.5 pr-8 outline-none cursor-pointer hover:border-gold/50 transition-colors font-sans uppercase tracking-wider shadow-inner shadow-black/50"
          >
            <option value="all">All Genres</option>
            {genres.map((g) => {
              // Gracefully handle if genres are passed as strings or objects {name, slug}
              const value = typeof g === "object" ? g.slug || g.name : g;
              const label = typeof g === "object" ? g.name : g;

              return (
                <option key={value} value={value}>
                  {label}
                </option>
              );
            })}
          </select>
          {/* Custom Dropdown Arrow */}
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-pewter">
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
              />
            </svg>
          </div>
        </div>

        {/* Sort Select */}
        <div className="relative w-full lg:w-48">
          <select
            onChange={(e) => updateParam("sort", e.target.value)}
            defaultValue={searchParams.get("sort") || "popular"}
            className="appearance-none bg-noir border border-border-subtle text-pewter text-sm rounded-sm focus:ring-1 focus:ring-gold/30 focus:border-gold/50 block w-full p-2.5 pr-8 outline-none cursor-pointer hover:border-gold/50 transition-colors font-sans uppercase tracking-wider shadow-inner shadow-black/50"
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest Year</option>
            <option value="oldest">Oldest Year</option>
          </select>
          {/* Custom Dropdown Arrow */}
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-pewter">
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
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
