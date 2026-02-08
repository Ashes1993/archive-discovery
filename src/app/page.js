export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8">
      {/* Hero Card */}
      <div className="glass p-12 rounded-3xl max-w-2xl text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
          Archive Discovery
        </h1>
        <p className="text-lg text-slate-600 mb-8 font-medium">
          A curated window into the public domain. Beautifully preserved.
        </p>

        <div className="flex gap-4 justify-center">
          <button className="px-6 py-3 rounded-full bg-slate-800 text-white font-medium hover:bg-slate-700 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5">
            Start Watching
          </button>
          <button className="glass-button">Browse Collection</button>
        </div>
      </div>

      {/* Grid Example */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="glass glass-hover p-6 rounded-2xl h-48 flex flex-col justify-between cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center text-slate-700 group-hover:scale-110 transition-transform">
              ✦
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                Feature {i}
              </h3>
              <p className="text-sm text-slate-600">
                Notice how the background color subtly shifts as you hover.
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
