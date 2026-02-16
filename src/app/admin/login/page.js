"use client";

import { useState, useTransition } from "react";
import { loginAdmin } from "@/actions/auth";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";

export default function AdminLoginPage() {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.target);

    startTransition(async () => {
      const res = await loginAdmin(formData);
      if (res?.error) {
        setError(res.error);
      }
    });
  };

  return (
    <div className="min-h-screen bg-noir flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Cinematic Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

      <GlassCard className="w-full max-w-md p-8 md:p-12 relative z-10 border-border-subtle bg-surface/80 backdrop-blur-xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-red-500/30 rounded-sm bg-red-500/5">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-red-500/80">
              Restricted Access
            </span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-silver mb-2">
            Archivist Login
          </h1>
          <p className="text-sm font-mono text-pewter">
            Enter master passcode to access the vault.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <input
              type="password"
              name="passcode"
              placeholder="••••••••••••"
              required
              className="w-full bg-noir border border-border-subtle text-silver px-4 py-4 text-center text-lg tracking-widest focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all placeholder:text-zinc-700 font-mono"
            />
          </div>

          {error && (
            <p className="text-xs font-mono text-red-400 text-center bg-red-500/10 py-2 border border-red-500/20 rounded-sm">
              {error}
            </p>
          )}

          <GlassButton
            type="submit"
            disabled={isPending}
            className="w-full py-4 text-base border-border-subtle hover:border-gold disabled:opacity-50"
          >
            {isPending ? "Decrypting..." : "Unlock Vault"}
          </GlassButton>
        </form>
      </GlassCard>
    </div>
  );
}
