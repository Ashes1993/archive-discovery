"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

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
  }, 300);

  return (
    <div className="relative group">
      <input
        type="text"
        placeholder="Search archive..."
        defaultValue={initialQuery}
        onChange={(e) => handleSearch(e.target.value)}
        className="
          w-full md:w-80 
          bg-surface 
          text-silver 
          placeholder:text-pewter/50
          border border-border-subtle 
          focus:border-silver focus:ring-1 focus:ring-silver/20
          rounded-md 
          px-4 py-2.5 pl-10 
          outline-none 
          transition-all duration-300
          font-mono text-sm tracking-wide
        "
      />
      <svg
        className="w-4 h-4 text-pewter absolute left-3 top-3.5 pointer-events-none group-focus-within:text-gold transition-colors duration-300"
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
