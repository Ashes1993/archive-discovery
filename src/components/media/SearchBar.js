"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce"; // You'll need to install this: npm install use-debounce

export function SearchBar({ initialQuery }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("q", term);
      params.set("page", "1"); // Reset to page 1 on new search
    } else {
      params.delete("q");
    }
    router.replace(`/media?${params.toString()}`);
  }, 300); // 300ms delay to prevent spamming the server

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search for a classic..."
        defaultValue={initialQuery}
        onChange={(e) => handleSearch(e.target.value)}
        className="glass-input w-full md:w-80 px-4 py-3 rounded-full pl-10"
      />
      <svg
        className="w-5 h-5 text-slate-400 absolute left-3 top-3.5 pointer-events-none"
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
  );
}
