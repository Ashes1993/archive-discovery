import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Archive Discovery",
  description: "A curated window into the public domain.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-slate-800`}
      >
        {/* Fixed Background - Stronger Colors for Glass Effect */}
        <div className="fixed inset-0 -z-10 bg-[#e0e7ff]">
          {" "}
          {/* Lighter Indigo Base */}
          {/* Deep Purple Blob - Essential for contrast behind glass */}
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-400/40 blur-[100px] animate-blob" />
          {/* Cyan/Blue Blob */}
          <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-300/40 blur-[100px] animate-blob animation-delay-2000" />
          {/* Pink/Magenta Blob - Adds warmth */}
          <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[50%] rounded-full bg-pink-300/40 blur-[100px] animate-blob animation-delay-4000" />
        </div>

        <Navbar />

        <main className="relative min-h-screen">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
