import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";

export const metadata = {
  title: "Manifesto | Archive Discovery",
  description: "Our mission to preserve digital culture.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-6 min-h-screen pt-32 pb-20">
      {/* SECTION 1: THE OPENING */}
      <div className="max-w-3xl mx-auto text-center mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-gold/30 rounded-full bg-gold/5">
          <span className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gold">
            Est. 2025
          </span>
        </div>

        <h1 className="text-5xl md:text-6xl font-serif font-bold text-silver mb-8 leading-tight">
          Cinema belongs <br />
          <span className="text-gold italic">to the public.</span>
        </h1>

        <p className="text-lg md:text-xl text-pewter font-sans leading-relaxed">
          We are a digital preservation initiative dedicated to restoring access
          to the public domain. In an era of streaming fragmentation, we believe
          culture should remain free, open, and accessible forever.
        </p>
      </div>

      {/* SECTION 2: THE VALUES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        <ValueCard
          title="Preservation First"
          icon="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          desc="We prioritize the highest quality digital masters available. No compression artifacts, no watermarks, just the raw film history."
        />
        <ValueCard
          title="Public Domain"
          icon="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.131A8 8 0 008 8m0 0a8 8 0 00-8 8c0 2.472.345 4.865.99 7.131M8 8a8 8 0 0016 0c0-2.472-.345-4.865-.99-7.131M16 12V6m0 0L8 6m8 0zm-8 0v6"
          desc="Every frame on this platform is free of copyright restrictions. You can remix, reuse, and share these films without legal barriers."
        />
        <ValueCard
          title="Open Architecture"
          icon="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          desc="Powered by the Internet Archive API. We build modern interfaces for timeless content, ensuring it remains discoverable for new generations."
        />
      </div>

      {/* SECTION 3: THE ORIGIN STORY */}
      <GlassCard className="max-w-4xl mx-auto p-8 md:p-12 border-border-subtle bg-surface/50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-serif font-bold text-silver mb-4">
              The Archive Protocol
            </h3>
            <div className="space-y-4 text-pewter font-sans text-sm leading-relaxed">
              <p>
                The internet was promised as a library of Alexandria, yet much
                of our shared history is locked behind paywalls or lost to link
                rot.
              </p>
              <p>
                <strong className="text-silver">Archive Discovery</strong> was
                built to solve the "Discovery Problem." The files exist, but
                finding them is hard. We index, categorize, and beautify the
                metadata to make browsing history feel as seamless as a modern
                streaming service.
              </p>
            </div>

            <div className="mt-8 flex gap-4">
              <Link href="/media">
                <GlassButton>Explore Library</GlassButton>
              </Link>
              <a href="https://archive.org" target="_blank" rel="noreferrer">
                <GlassButton variant="ghost">Source Data</GlassButton>
              </a>
            </div>
          </div>

          {/* Visual Decoration */}
          <div className="relative h-64 w-full bg-noir rounded-sm overflow-hidden border border-border-subtle">
            <div className="absolute inset-0 bg-[url('https://archive.org/download/Night_of_the_Living_Dead_1968/Night_of_the_Living_Dead_1968.thumbs/Night_of_the_Living_Dead_1968_002820.jpg')] bg-cover bg-center opacity-40 grayscale" />
            <div className="absolute inset-0 bg-gradient-to-t from-noir via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4">
              <p className="font-mono text-xs text-gold uppercase tracking-wider">
                Fig 01. Restoration
              </p>
              <p className="font-serif text-silver text-lg">
                Night of the Living Dead (1968)
              </p>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

function ValueCard({ title, icon, desc }) {
  return (
    <div className="p-6 border border-border-subtle rounded-md bg-surface hover:border-gold/30 transition-colors group">
      <div className="w-10 h-10 mb-4 text-pewter group-hover:text-gold transition-colors">
        <svg
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
        </svg>
      </div>
      <h3 className="text-lg font-serif font-bold text-silver mb-2">{title}</h3>
      <p className="text-sm text-pewter leading-relaxed">{desc}</p>
    </div>
  );
}
