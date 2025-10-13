import Image from "next/image";
import Link from "next/link";

interface HeroProps {
  backgroundImage: string;
  headline: string;
  bodyText?: string;
  ctaButton?: {
    enabled: boolean;
    text?: string;
    href?: string;
  };
}

export default function Hero({
  backgroundImage,
  headline,
  bodyText,
  ctaButton,
}: HeroProps) {
  return (
    <section className="relative flex items-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
        }}
      />
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-[540px] relative ml-28 text-center py-16 px-8">
          {/* Dark Overlay - positioned behind content */}
          <div className="absolute inset-0 bg-black/60 -z-10" />

          {/* Logo */}
          <div className="mb-8 relative z-10">
            <Image
              src="/icon.png"
              alt="MyAssetLocker Logo"
              width={140}
              height={140}
              className="w-36 h-36 mx-auto"
            />
          </div>

          {/* Headline */}
          <h1 className="text-lg font-bold text-white mb-8 uppercase leading-tight relative z-10">
            {headline}
          </h1>

          {/* Body Text */}
          <p className="text-base md:text-lg text-white mb-10 leading-relaxed relative z-10">
            {bodyText}
          </p>

          {/* CTA Button */}
          {ctaButton?.enabled && (
            <Link
              href={ctaButton.href || "/"}
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-bold uppercase tracking-wide hover:bg-white hover:text-black transition-all duration-300 rounded-lg relative z-10"
            >
              {ctaButton?.text}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
