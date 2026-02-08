export function Footer() {
  return (
    <footer className="w-full py-12 mt-20 px-6">
      <div className="glass max-w-7xl mx-auto rounded-3xl p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h3 className="font-bold text-lg text-slate-800">
            Archive Discovery
          </h3>
          <p className="text-slate-500 text-sm mt-2 max-w-xs">
            Preserving culture through the public domain. Built with Next.js &
            Love.
          </p>
        </div>

        <div className="flex gap-6 text-sm text-slate-500 font-medium">
          <a href="#" className="hover:text-indigo-600 transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-indigo-600 transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-indigo-600 transition-colors">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
