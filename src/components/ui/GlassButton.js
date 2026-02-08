"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function GlassButton({
  children,
  onClick,
  className,
  variant = "primary",
}) {
  const variants = {
    primary:
      "bg-slate-800 text-white hover:bg-slate-700 border-transparent shadow-lg",
    glass: "glass-button hover:bg-white/40 text-slate-800",
    ghost:
      "bg-transparent hover:bg-white/20 text-slate-700 border-transparent shadow-none",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "px-6 py-3 rounded-full font-medium transition-all duration-300 border flex items-center gap-2 justify-center",
        variants[variant],
        className,
      )}
    >
      {children}
    </motion.button>
  );
}
