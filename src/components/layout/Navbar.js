"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Library", href: "/media" },
  { name: "Collections", href: "/collections" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Handle Scroll state for the glass effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync state during render if the route has changed
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4 pointer-events-none">
      <nav
        className={cn(
          "relative pointer-events-auto mx-auto px-4 sm:px-6 py-3 flex items-center justify-between transition-all duration-500 ease-in-out z-50",
          "rounded-md max-w-5xl",
          !scrolled && "bg-transparent border border-transparent",
          scrolled &&
            "bg-surface/90 backdrop-blur-md border border-border-subtle shadow-2xl shadow-black/50 translate-y-[-4px]",
        )}
      >
        {/* LOGO */}
        <Link
          href="/"
          className="group flex items-center gap-2 font-serif font-bold text-lg tracking-wide text-silver hover:text-white transition-colors z-10"
        >
          <span className="w-8 h-8 bg-silver text-noir flex items-center justify-center rounded-sm font-sans text-xs font-bold group-hover:bg-white transition-colors">
            AD
          </span>
          ARCHIVE
        </Link>

        {/* DESKTOP LINKS (Perfectly Centered) */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-1">
          {navLinks.map((link) => {
            // Strict match for Home ("/"), partial match for others ("/media/123" keeps "Library" active)
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

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
                    className="absolute inset-0 bg-border-subtle rounded-md -z-10 border border-white/5 shadow-inner"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* RIGHT SIDE / MOBILE MENU TOGGLE */}
        <div className="flex items-center justify-end z-10">
          <button
            className="md:hidden p-2 text-pewter hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* MOBILE MENU DROPDOWN */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-4 right-4 mt-2 p-2 bg-surface/95 backdrop-blur-xl border border-border-subtle rounded-md shadow-2xl md:hidden pointer-events-auto"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "px-4 py-3 rounded-md text-xs font-medium tracking-wide uppercase transition-all",
                      isActive
                        ? "bg-border-subtle text-white shadow-inner border border-white/5"
                        : "text-pewter hover:bg-white/5 hover:text-silver",
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
