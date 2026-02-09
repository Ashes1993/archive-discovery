"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Library", href: "/media" },
  { name: "Collections", href: "/collections" },
  { name: "About", href: "/about" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

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
          "rounded-md max-w-5xl",

          // CONDITION 1: Top of page (Transparent)
          !scrolled && "bg-transparent border border-transparent",

          // CONDITION 2: Scrolled (Matte Dark Surface)
          // Uses bg-surface (Charcoal) with a subtle border
          scrolled &&
            "bg-surface/90 backdrop-blur-md border border-border-subtle shadow-2xl shadow-black/50 translate-y-[-4px]",
        )}
      >
        {/* LOGO: Typography Based */}
        <Link
          href="/"
          className="group flex items-center gap-2 font-serif font-bold text-lg tracking-wide text-silver hover:text-white transition-colors"
        >
          <span className="w-8 h-8 bg-silver text-noir flex items-center justify-center rounded-sm font-sans text-xs font-bold group-hover:bg-white transition-colors">
            AD
          </span>
          ARCHIVE
        </Link>

        {/* LINKS */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "relative px-4 py-2 rounded-md text-xs font-medium tracking-wide transition-colors uppercase",
                  isActive ? "text-white" : "text-pewter hover:text-silver",
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-border-subtle rounded-md -z-10 border border-white/5"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* ACTION / AVATAR */}
        <div className="flex items-center gap-2">
          {/* Simple Status Indicator instead of Avatar */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-noir border border-border-subtle">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
            </span>
            <span className="text-[10px] font-mono text-pewter uppercase tracking-wider">
              Live
            </span>
          </div>
        </div>
      </nav>
    </header>
  );
}
