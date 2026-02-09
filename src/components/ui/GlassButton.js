"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function GlassButton({
  children,
  onClick,
  className,
  variant = "primary",
  disabled = false,
}) {
  const variants = {
    // PRIMARY: Solid White/Silver text on Dark Surface with a thin border
    primary:
      "bg-surface text-silver border border-border-active hover:bg-border-subtle hover:text-white hover:border-silver shadow-md",

    // ACCENT: Gold Text (Use sparingly for 'Watch Now' etc)
    accent:
      "bg-gold/10 text-gold border border-gold/20 hover:bg-gold/20 hover:border-gold/40",

    // GHOST: Transparent with border (Wireframe)
    ghost:
      "bg-transparent text-pewter border border-border-subtle hover:text-silver hover:border-border-active",
  };

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        // BASE STYLES
        "px-6 py-3",
        "rounded-md", // Sharper corners
        "font-sans font-medium text-sm tracking-wide", // Clean typography
        "transition-all duration-300",
        "flex items-center gap-2 justify-center",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        className,
      )}
    >
      {children}
    </motion.button>
  );
}
