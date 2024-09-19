import { Analytics } from '@vercel/analytics/react';
import Header from "@/components/header";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import '@/app/globals.css'

const inter = Inter({ subsets: ["latin"] });
const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas-neue',
});

export const metadata: Metadata = {
  title: "Help I'm fine | Digital Collage & AI Art",
  description: "Explore Thomas's unique blend of digital collage and AI-generated art. Discover playful human-created compositions and AI-curated visual experiences.",
  keywords: ["digital collage", "AI art", "visual artist", "Thomas", "creative process", "human-AI collaboration"],
  openGraph: {
    title: "Help I'm fine | Digital Collage & AI Art",
    description: "Explore Thomas's journey in digital collage and AI-generated art",
    images: [
      {
        url: "https://res.cloudinary.com/dsbsn3nap/image/upload/v1726000825/Lushuous_Landscape_ghgau1.png",
        width: 1200,
        height: 630,
        alt: "Help, I'm fine - Digital Collage & AI Art",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Help I'm fine | Digital Collage & AI Art",
    description: "Discover Thomas's unique blend of human creativity and AI curation",
    images: ["https://res.cloudinary.com/dsbsn3nap/image/upload/v1726000825/Lushuous_Landscape_ghgau1.png"],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} ${bebasNeue.variable}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex flex-col min-h-screen mx-auto">
              <Header />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
            <Toaster />
          </ThemeProvider>
          <Analytics />
        </body>
      </html>
  );
}
