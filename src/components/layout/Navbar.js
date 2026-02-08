"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Discover", href: "/media" },
  { name: "Collections", href: "/collections" },
  { name: "About", href: "/about" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll to toggle styles
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 pointer-events-none">
      <nav
        className={cn(
          "pointer-events-auto mx-auto px-6 py-3 flex items-center justify-between transition-all duration-500 ease-in-out",
          // Base shape
          "rounded-full max-w-5xl",
          // CONDITION 1: Top of page (Transparent & Float)
          !scrolled && "bg-white/10 backdrop-blur-md border border-white/20",
          // CONDITION 2: Scrolled (Opaque & Solid)
          // We increase opacity to 85% and shadow to ensure text underneath is hidden
          scrolled &&
            "bg-white/85 backdrop-blur-xl border border-white/50 shadow-lg shadow-indigo-500/5 translate-y-[-4px]",
        )}
      >
        {/* Logo */}
        <Link
          href="/"
          className="font-bold text-xl tracking-tight bg-gradient-to-r from-slate-800 to-indigo-600 bg-clip-text text-transparent"
        >
          Archive<span className="font-light text-slate-500">.Disc</span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className="relative px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-indigo-500/10 rounded-full shadow-sm -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Action */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
            A
          </div>
        </div>
      </nav>
    </header>
  );
}
