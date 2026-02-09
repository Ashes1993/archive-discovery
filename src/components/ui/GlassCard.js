"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function GlassCard({
  children,
  className,
  hoverEffect = true,
  delay = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: delay, ease: "easeOut" }}
      className={cn(
        // BASE STYLES:
        "relative overflow-hidden",
        "bg-surface", // Matte Dark Grey
        "border border-border-subtle", // Thin, subtle border
        "rounded-md", // Sharper corners (was rounded-2xl)

        // HOVER STYLES:
        hoverEffect &&
          "group hover:border-border-active hover:bg-surface-hover transition-colors duration-300 cursor-pointer",

        className,
      )}
    >
      {/* Optional: Subtle Inner Glow on Hover (Top edge only) */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {children}
    </motion.div>
  );
}
