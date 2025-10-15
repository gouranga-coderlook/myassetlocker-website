import Image from "next/image";
import Link from "next/link";
import AppStoreButtons from "./AppStoreButtons";

interface HeroProps {
  readonly backgroundImage: string;
  readonly headline: string;
  readonly bodyText?: string;
  readonly ctaButton?: {
    readonly enabled: boolean;
    readonly text?: string;
    readonly href?: string;
  };
  readonly isHomePage?: boolean;
  readonly appStoreButtons?: boolean;
}

export default function Hero({
  backgroundImage,
  headline,
  bodyText,
  ctaButton,
  isHomePage = false,
  appStoreButtons = false
}: Readonly<HeroProps>) {
  return (
    <section
      className={`relative flex items-center ${
        isHomePage ? "" : "h-[60vh]"
      } overflow-hidden`}
    >
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
        }}
      />

      {/* Professional Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#4c4946]/90 via-[#4c4946]/70 to-transparent" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center py-12 sm:py-16 md:py-20">
          {/* Logo */}
          {isHomePage && (
            <div className="mb-8 sm:mb-12">
              <Image
                src="/icon.png"
                alt="MyAssetLocker Logo"
                width={120}
                height={120}
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 mx-auto drop-shadow-lg"
              />
            </div>
          )}

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 sm:mb-8 leading-tight px-4">
            {headline}
          </h1>

          {/* Body Text */}
          <div className="text-base sm:text-lg md:text-xl text-gray-200 mb-4 sm:mb-12 leading-relaxed max-w-3xl mx-auto px-4">
            {bodyText}
          </div>

          {/* CTA Button */}
          {ctaButton?.enabled && (
            <div className="px-4">
              <Link
                href={ctaButton.href || "/"}
                className="inline-flex items-center justify-center px-6 sm:px-8 md:px-10 py-4 sm:py-5 bg-gradient-to-r from-[#f8992f] to-[#e8911f] hover:from-[#e8911f] hover:to-[#c2751a] text-white font-bold text-base sm:text-lg uppercase tracking-wide rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 min-h-[48px] sm:min-h-[56px] w-full sm:w-auto"
              >
                {ctaButton?.text}
                <svg
                  className="ml-2 sm:ml-3 w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>
          )}
          {appStoreButtons && (
              <AppStoreButtons className="mx-auto" />
          )}
        </div>
      </div>
    </section>
  );
}
