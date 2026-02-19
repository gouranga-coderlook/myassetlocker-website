"use client";

import Hero from "@/components/Hero";

type AuthLoadingViewProps = {
  /** Hero headline (e.g. "My Bookings", "My Profile") */
  headline?: string;
  /** Hero body text */
  bodyText?: string;
  /** Hero background image path */
  backgroundImage?: string;
  /** Message in the loading card (e.g. "Loading...", "Loading bookings...") */
  loadingMessage?: string;
};

/**
 * Full-page loading view shown while auth state is being restored from storage.
 * Card matches the bookings page loading design exactly.
 */
export default function AuthLoadingView({
  headline = "Loading",
  bodyText = "Please wait...",
  backgroundImage = "/products-1.png",
  loadingMessage = "Loading...",
}: AuthLoadingViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f7f7] to-[#fef7ed]">
      <Hero
        backgroundImage={backgroundImage}
        headline={headline}
        bodyText={bodyText}
        height="compact"
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f8992f] mx-auto"></div>
          <p className="mt-4 text-gray-600">{loadingMessage}</p>
        </div>
      </div>
    </div>
  );
}
