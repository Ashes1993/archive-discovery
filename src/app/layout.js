import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// 1. Modern Sans for Body Text
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// 2. Cinematic Serif for Headings
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

// 3. Tech Mono for Metadata
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  title: "Archive Discovery | The Neo-Noir Collection",
  description: "A digital preservation of classic cinema.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${jetbrains.variable}`}
    >
      {/* bg-noir: Sets the deep black background
         text-silver: Sets the default text color
         film-grain: Adds the texture overlay defined in globals.css
         selection: Custom highlight color 
      */}
      <body className="bg-noir text-silver antialiased selection:bg-gold selection:text-noir film-grain min-h-screen flex flex-col">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
