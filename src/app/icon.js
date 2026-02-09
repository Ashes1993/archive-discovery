import { ImageResponse } from "next/og";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        background: "#050505", // bg-noir
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "6px", // Slight rounded corners for the favicon box
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#C5A059" // text-gold
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* 1. The Main Reel (Shifted slightly up-left to make room for the tail) */}
        <circle cx="10" cy="10" r="7" />

        {/* 2. The Center Hub (Solid) */}
        <circle cx="10" cy="10" r="2" fill="#C5A059" stroke="none" />

        {/* 3. The "Spokes" (3 Circles that define the reel look) */}
        <circle cx="10" cy="5.5" r="1" fill="#C5A059" stroke="none" />
        <circle cx="13.9" cy="12.2" r="1" fill="#C5A059" stroke="none" />
        <circle cx="6.1" cy="12.2" r="1" fill="#C5A059" stroke="none" />

        {/* 4. The "Loose" Film Strip (Unspooling) */}
        {/* A curve starting from the right side of the reel and flowing down */}
        <path d="M17 10 C19 10 21 12 22 16" />

        {/* 5. Optional: Sprocket holes on the loose strip (Dots) */}
        <circle cx="20" cy="13" r="0.5" fill="#C5A059" stroke="none" />
      </svg>
    </div>,
    {
      ...size,
    },
  );
}
