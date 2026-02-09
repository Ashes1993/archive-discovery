"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { GlassButton } from "@/components/ui/GlassButton";

export function Hero({ featuredMovies }) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: Text Content */}
        <div className="space-y-8 text-center lg:text-left z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 text-sm font-bold tracking-wide uppercase mb-4 inline-block">
              Public Domain Remastered
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-800 leading-tight">
              Cinema history, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Crystal Clear.
              </span>
            </h1>
            <p className="text-lg text-slate-600 mt-6 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Discover thousands of restored classic films, documentaries, and
              animations. No ads. No subscription. Just pure preservation.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <Link href="/media">
              <GlassButton className="bg-slate-900 text-white hover:bg-slate-800 shadow-xl hover:shadow-2xl px-8 py-4 text-lg">
                Start Watching
              </GlassButton>
            </Link>
            <Link href="/about">
              <GlassButton
                variant="ghost"
                className="px-8 py-4 text-lg border-slate-200"
              >
                Learn More
              </GlassButton>
            </Link>
          </motion.div>
        </div>

        {/* Right: Floating Cards Animation */}
        <div className="relative h-[600px] hidden lg:flex items-center justify-center perspective-1000">
          {featuredMovies.map((movie, i) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 100, rotate: 0 }}
              animate={{ opacity: 1, y: 0, rotate: (i - 1) * 6 }} // Fan out effect
              transition={{
                delay: 0.2 + i * 0.1,
                duration: 0.8,
                type: "spring",
              }}
              className="absolute w-64 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white"
              style={{
                zIndex: i,
                x: (i - 1) * 40, // Horizontal offset
                y: i === 1 ? -40 : 0, // Center card floats higher
              }}
            >
              <img
                src={`https://archive.org/download/${movie.archiveId}/${movie.posterFile}`}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <p className="text-white font-bold text-sm line-clamp-1">
                  {movie.title}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
