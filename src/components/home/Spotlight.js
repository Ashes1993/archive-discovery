import Link from "next/link";
import { GlassButton } from "@/components/ui/GlassButton";

export function Spotlight() {
  // We can hardcode a specific "Movie of the Month" here,
  // or pass it in as a prop later.
  // For now, let's use "Charade" or "Night of the Living Dead" as an example.

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Image with Heavy Fade */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-noir via-noir/90 to-noir/40 z-10" />
        <img
          src="https://archive.org/download/Charade1963_201804/Charade1963.thumbs/Charade1963_000030.jpg"
          alt="Spotlight Background"
          className="w-full h-full object-cover grayscale opacity-40"
        />
      </div>

      <div className="container mx-auto px-6 relative z-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Content */}
        <div className="space-y-6">
          <div className="inline-block px-3 py-1 border border-gold/30 rounded-sm bg-gold/5">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gold">
              Curator's Choice
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl font-serif font-bold text-white leading-none">
            Charade{" "}
            <span className="text-2xl text-pewter block mt-2 font-sans font-normal tracking-wide">
              (1963)
            </span>
          </h2>

          <p className="text-pewter text-lg leading-relaxed max-w-md">
            The best Hitchcock movie that Hitchcock never made. Cary Grant and
            Audrey Hepburn star in this stylish, suspenseful, and humorous
            Parisian whodunit.
          </p>

          <div className="flex flex-wrap gap-4 text-xs font-mono text-silver uppercase tracking-wider py-4">
            <span className="border border-border-subtle px-3 py-1 rounded-sm">
              Mystery
            </span>
            <span className="border border-border-subtle px-3 py-1 rounded-sm">
              Romance
            </span>
            <span className="border border-border-subtle px-3 py-1 rounded-sm">
              Technicolor
            </span>
          </div>

          <div className="flex gap-4 pt-4">
            <Link href="/media?q=Charade">
              <GlassButton className="border-silver hover:bg-silver hover:text-noir transition-colors">
                Watch Feature
              </GlassButton>
            </Link>
          </div>
        </div>

        {/* Visual Poster Card */}
        <div className="hidden lg:block justify-self-center relative group">
          <div className="absolute -inset-2 bg-gold/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <img
            src="https://archive.org/download/Charade1963_201804/Charade1963.thumbs/Charade1963_002850.jpg"
            alt="Charade Poster"
            className="relative w-80 aspect-[2/3] object-cover rounded-sm shadow-2xl border border-white/10 rotate-3 group-hover:rotate-0 transition-transform duration-700"
          />
        </div>
      </div>
    </section>
  );
}
