"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils"; // We'll create this utility helper in a second

export function GlassCard({
  children,
  className,
  hoverEffect = true,
  delay = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay }}
      className={cn(
        "glass rounded-2xl p-6 relative overflow-hidden",
        hoverEffect && "glass-hover cursor-pointer group",
        className,
      )}
    >
      {/* Subtle sheen animation container */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {children}
    </motion.div>
  );
}
