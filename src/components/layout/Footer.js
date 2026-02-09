export function Footer() {
  return (
    <footer className="w-full py-12 mt-20 px-6">
      <div className="max-w-7xl mx-auto rounded-lg bg-surface border border-border-subtle p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl shadow-black/20">
        {/* Brand Section */}
        <div className="text-center md:text-left">
          <h3 className="font-serif font-bold text-xl text-silver tracking-wide">
            ARCHIVE DISCOVERY
          </h3>
          <p className="text-pewter text-sm mt-3 max-w-xs leading-relaxed font-sans">
            Preserving the history of cinema. A curated collection of public
            domain masterpieces.
          </p>
        </div>

        {/* Links Section */}
        <div className="flex gap-8 text-xs text-pewter font-medium uppercase tracking-wider">
          <a href="#" className="hover:text-gold transition-colors">
            Manifesto
          </a>
          <a href="#" className="hover:text-gold transition-colors">
            Public Domain
          </a>
          <a href="#" className="hover:text-gold transition-colors">
            GitHub
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto mt-8 text-center md:text-right px-4">
        <p className="text-[10px] text-zinc-600 font-mono">
          © {new Date().getFullYear()} ARCHIVE DISCOVERY PROJECT. POWERED BY
          ARCHIVE.ORG.
        </p>
      </div>
    </footer>
  );
}
