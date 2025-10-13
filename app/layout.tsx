import { Analytics } from "@/components/Analytics";
import Header from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeProvider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppStoreButtons from "@/components/AppStoreButtons";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <ThemeProvider defaultTheme="light" storageKey="myassetlocker-theme">
          <Analytics />
          <div className="min-h-screen flex flex-col bg-background-primary text-text-primary">
            {/* Header */}
            <Header />

            {/* Main Content */}
            <main className="flex-1">{children}</main>

            {/* Sticky Mobile Footer */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-neutral-800 border-t border-border-primary md:hidden">
              <div className="flex items-center justify-center space-x-4 p-4">
                <a
                  href="https://apps.apple.com/app/myassetlocker"
                  className="flex items-center space-x-2 px-3 py-2 bg-black text-white rounded-lg text-xs"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <span>App Store</span>
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=com.myassetlocker.app"
                  className="flex items-center space-x-2 px-3 py-2 bg-black text-white rounded-lg text-xs"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M3.609 1.814L13.792 12 3.609 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L12.5 12l5.199-3.491zM5.864 2.658L16.802 8.99l-2.302 2.302-8.636-8.634z" />
                  </svg>
                  <span>Google Play</span>
                </a>
              </div>
            </div>

            {/* Footer */}
            <footer className="bg-background-secondary border-t border-border-primary pb-20 md:pb-0">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {/* Brand */}
                  <div className="col-span-1 md:col-span-2">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">
                      MyAssetLocker
                    </h3>
                    <p className="text-text-secondary mb-6 max-w-md">
                      Secure, manage, and organize your digital assets with
                      enterprise-grade security and intuitive design.
                    </p>
                    {/* App Store Badges */}
                    <AppStoreButtons />
                  </div>

                  {/* Quick Links */}
                  <div>
                    <h4 className="text-sm font-semibold text-text-primary mb-4">
                      Product
                    </h4>
                    <ul className="space-y-2">
                      <li>
                        <a
                          href="/how-it-works"
                          className="text-text-secondary hover:text-text-primary transition-colors"
                        >
                          How It Works
                        </a>
                      </li>
                      <li>
                        <a
                          href="/digital-locker"
                          className="text-text-secondary hover:text-text-primary transition-colors"
                        >
                          Digital Locker
                        </a>
                      </li>
                      <li>
                        <a
                          href="/valet-storage"
                          className="text-text-secondary hover:text-text-primary transition-colors"
                        >
                          Valet Storage
                        </a>
                      </li>
                      <li>
                        <a
                          href="/pricing"
                          className="text-text-secondary hover:text-text-primary transition-colors"
                        >
                          Pricing
                        </a>
                      </li>
                    </ul>
                  </div>

                  {/* Support */}
                  <div>
                    <h4 className="text-sm font-semibold text-text-primary mb-4">
                      Support
                    </h4>
                    <ul className="space-y-2">
                      <li>
                        <a
                          href="#help"
                          className="text-text-secondary hover:text-text-primary transition-colors"
                        >
                          Help Center
                        </a>
                      </li>
                      <li>
                        <a
                          href="#docs"
                          className="text-text-secondary hover:text-text-primary transition-colors"
                        >
                          Documentation
                        </a>
                      </li>
                      <li>
                        <a
                          href="#contact"
                          className="text-text-secondary hover:text-text-primary transition-colors"
                        >
                          Contact Us
                        </a>
                      </li>
                      <li>
                        <a
                          href="#status"
                          className="text-text-secondary hover:text-text-primary transition-colors"
                        >
                          Status
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 pt-8 border-t border-border-primary">
                  <div className="flex flex-col md:flex-row justify-between items-center">
                    <p className="text-text-tertiary text-sm">
                      © 2024 MyAssetLocker, LLC. All rights reserved.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                      <a
                        href="#privacy"
                        className="text-text-tertiary hover:text-text-primary transition-colors text-sm"
                      >
                        Privacy Policy
                      </a>
                      <a
                        href="#terms"
                        className="text-text-tertiary hover:text-text-primary transition-colors text-sm"
                      >
                        Terms of Service
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
