import type React from "react"
import type { Metadata } from "next"
import { Inter, Outfit } from "next/font/google"
import { SubscriptionProvider } from "@/contexts/subscription-context"
import { AuthProvider } from "@/contexts/auth-context"
import { SpotifyProvider } from "@/contexts/spotify-context"
import { Footer } from "@/components/footer"
import { Toaster } from "sonner"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" })

export const metadata: Metadata = {
  title: "Sonalysis — Discover Your Music Personality",
  description: "Connect your Spotify and unlock a deep personality analysis based on your listening habits. Get your archetype, mood spectrum, alter ego, and a shareable personality card.",
  keywords: ["spotify", "music personality", "listening archetype", "genre DNA", "music analysis", "spotify wrapped"],
  openGraph: {
    title: "Sonalysis — Discover Your Music Personality",
    description: "What does your music taste say about you? Find out with AI-powered personality analysis.",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png" },
      { url: "/favicon-16x16.png", sizes: "16x16" },
    ],
    apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased flex flex-col min-h-screen`}>
        <AuthProvider>
          <SubscriptionProvider>
            <SpotifyProvider>
              <div className="flex-1 flex flex-col">
                {children}
              </div>
              <Footer />
            </SpotifyProvider>
          </SubscriptionProvider>
        </AuthProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
