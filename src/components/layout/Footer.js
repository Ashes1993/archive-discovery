// @/src/components/layout/Footer.js
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full py-12 mt-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto rounded-lg bg-surface border border-border-subtle p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl shadow-black/20 relative overflow-hidden">
        {/* Subtle background glow for premium feel */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[80px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/4"></div>

        {/* Brand Section */}
        <div className="text-center md:text-left relative z-10">
          <h3 className="font-serif font-bold text-xl text-silver tracking-wide">
            ARCHIVE DISCOVERY
          </h3>
          <p className="text-pewter text-sm mt-3 max-w-sm leading-relaxed font-sans">
            Preserving the history of cinema. A curated collection of public
            domain masterpieces, restored and beautifully presented.
          </p>
        </div>

        {/* Links Section */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-xs text-pewter font-medium uppercase tracking-wider relative z-10">
          <Link href="/about" className="hover:text-gold transition-colors">
            About
          </Link>
          <Link href="/privacy" className="hover:text-gold transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-gold transition-colors">
            Terms of Use
          </Link>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto mt-8 flex flex-col md:flex-row justify-between items-center px-4 gap-4">
        <p className="text-[10px] text-zinc-400 font-mono tracking-widest text-center md:text-left">
          © {new Date().getFullYear()} ARCHIVE DISCOVERY PROJECT.
        </p>
        <p className="text-[10px] text-zinc-400 font-mono tracking-widest text-center md:text-right">
          POWERED BY ARCHIVE.ORG & TMDB.
        </p>
      </div>
    </footer>
  );
}
