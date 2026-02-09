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
    params.set("page", "1"); // Reset pagination on change
    router.replace(`/media?${params.toString()}`);
  };

  const handleSearch = useDebouncedCallback((term) => {
    updateParam("q", term);
  }, 300);

  return (
    <div className="glass p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between w-full">
      {/* Search Input - Improved Design */}
      <div className="relative w-full md:w-96 group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
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
          placeholder="Search classics..."
          defaultValue={searchParams.get("q")?.toString()}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full bg-white/40 border border-white/20 text-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 block pl-10 p-2.5 outline-none transition-all placeholder:text-slate-400"
        />
      </div>

      {/* Filters Area */}
      <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
        {/* Genre Select */}
        <select
          onChange={(e) => updateParam("genre", e.target.value)}
          defaultValue={searchParams.get("genre") || "all"}
          className="bg-white/40 border border-white/20 text-slate-700 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none cursor-pointer hover:bg-white/60 transition-colors"
        >
          <option value="all">All Genres</option>
          {genres.map((g) => (
            <option key={g} value={g}>
              {g.replace(/_/g, " ")}
            </option>
          ))}
        </select>

        {/* Sort Select */}
        <select
          onChange={(e) => updateParam("sort", e.target.value)}
          defaultValue={searchParams.get("sort") || "popular"}
          className="bg-white/40 border border-white/20 text-slate-700 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none cursor-pointer hover:bg-white/60 transition-colors"
        >
          <option value="popular">Most Popular</option>
          <option value="rating">Highest Rated</option>
          <option value="newest">Newest Year</option>
          <option value="oldest">Oldest Year</option>
        </select>
      </div>
    </div>
  );
}
