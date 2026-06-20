"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { GlassButton } from "@/components/ui/GlassButton";

export function Hero({ featuredMovies }) {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden pt-24 pb-12 lg:pt-20 lg:pb-0">
      {/* Background Spotlight Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-white/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-12 items-center">
        {/* CARDS ANIMATION */}
        <div className="relative h-[400px] sm:h-[450px] lg:h-[600px] flex items-center justify-center perspective-[1000px] order-1 lg:order-2 mt-4 lg:mt-0 z-20">
          {featuredMovies.slice(0, 3).map((movie, i) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 1, y: 50, rotateX: 10 }}
              animate={{ y: 0, rotateX: 0, rotateZ: (i - 1) * 8 }}
              transition={{
                delay: 0.2 + i * 0.15,
                duration: 1,
                type: "spring",
                stiffness: 50,
              }}
              className="absolute w-48 sm:w-56 lg:w-72 aspect-[2/3] rounded-sm overflow-hidden shadow-2xl bg-noir border border-border-subtle group"
              style={{
                zIndex: i,
                x: (i - 1) * 55,
                y: i === 1 ? -25 : 15,
              }}
            >
              {/* NEXT.JS IMAGE OPTIMIZATION */}
              {movie.posterFile && (
                <Image
                  src={movie.posterFile}
                  alt={movie.title}
                  fill
                  priority={true} // Crucial for LCP - preloads the Hero images
                  unoptimized={process.env.NODE_ENV === "development"}
                  sizes="(max-width: 640px) 192px, (max-width: 1024px) 224px, 288px"
                  className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700 grayscale-[20%] group-hover:grayscale-0"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-noir via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-0 inset-x-0 p-3 sm:p-5 border-t border-white/5 bg-noir/80 backdrop-blur-sm">
                <p className="text-silver font-serif font-bold text-sm sm:text-base lg:text-lg line-clamp-1">
                  {movie.title}
                </p>
                <div className="flex justify-between items-center mt-1 sm:mt-2">
                  <span className="text-[9px] sm:text-[10px] font-mono text-gold uppercase tracking-widest">
                    {movie.year || "Classic"}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* TEXT CONTENT */}
        <div className="space-y-6 md:space-y-8 text-center lg:text-left z-10 order-2 lg:order-1 pb-8 lg:pb-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 md:mb-6 border-l-2 border-gold pl-3">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-pewter">
                Public Domain Archive
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold text-silver leading-[1.1] tracking-tight">
              Cinema history, <br />
              <span className="text-gold italic">Restored.</span>
            </h1>

            <p className="text-base sm:text-lg text-pewter mt-4 md:mt-6 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
              Access a curated vault of culturally significant films,
              documentaries, and silent masterpieces.
              <span className="block mt-2 text-[10px] sm:text-sm font-mono text-zinc-400 uppercase tracking-wide">
                No Ads. No Subs. Pure Preservation.
              </span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start w-full sm:w-auto"
          >
            <Link href="/media" className="w-full sm:w-auto">
              <GlassButton className="w-full sm:w-auto px-8 py-4 text-base bg-silver text-noir hover:bg-white hover:border-white shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                Start Watching
              </GlassButton>
            </Link>
            <Link href="/collections" className="w-full sm:w-auto">
              <GlassButton
                variant="ghost"
                className="w-full sm:w-auto px-8 py-4 text-base"
              >
                Browse Vaults
              </GlassButton>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
