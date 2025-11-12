import { Analytics } from "@/components/Analytics";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { ThemeProvider } from "@/components/ThemeProvider";
import Providers from "./providers";
import { getSessionLikeData } from "@/lib/api/serverAuth";
import { getServerPricingData } from "@/lib/api/serverPricing";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MyAssetLocker - Secure Asset Management",
  description:
    "The ultimate solution for managing and securing your digital assets with enterprise-grade security.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  // Option A: fetch server-side data to hydrate Redux (optional)
  // e.g., get user session, initial product list, pricing data, etc.
  const session = await getSessionLikeData(); // returns e.g. { auth: { user, token } }
  const pricingData = await getServerPricingData(); // fetch pricing data server-side

  // Build a preloadedState object matching your store shape
  const preloadedState = {
    auth: {
      token: session?.token ?? undefined,
      user: session?.user ?? null,
    },
    pricing: {
      data: pricingData,
      loading: false,
      error: null,
    },
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {/* Pass preloadedState into client Providers */}
        <Providers preloadedState={preloadedState}>
          <ThemeProvider defaultTheme="light" storageKey="myassetlocker-theme">
            <Analytics />
            <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f7f7f7] via-white to-[#fef7ed] text-[#4c4946]">
              {/* Header */}
              <Header />

              {/* Main Content */}
              <main className="flex-1 relative">{children}</main>

              {/* Sticky Mobile Footer */}
              <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#e8e8e8] md:hidden shadow-lg">
                <div className="flex items-center justify-center space-x-3 sm:space-x-4 p-3 sm:p-4">
                  <a
                    href="https://apps.apple.com/app/myassetlocker"
                    className="flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 bg-black text-white rounded-lg text-xs sm:text-sm font-semibold min-h-[44px] transition-all duration-300 hover:scale-105"
                  >
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                    <span>App Store</span>
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.myassetlocker.app"
                    className="flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 bg-black text-white rounded-lg text-xs sm:text-sm font-semibold min-h-[44px] transition-all duration-300 hover:scale-105"
                  >
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M3.609 1.814L13.792 12 3.609 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L12.5 12l5.199-3.491zM5.864 2.658L16.802 8.99l-2.302 2.302-8.636-8.634z" />
                    </svg>
                    <span>Google Play</span>
                  </a>
                </div>
              </div>
              <Footer />
              <ScrollToTop />
            </div>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
