"use client";
import { useState, useEffect, memo } from "react";
import Image from "next/image";
import AppStoreButtons from "./AppStoreButtons";

const AppShowcase = memo(function AppShowcase() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Static data - no longer props
  const logo = {
    src: "/icon.png",
    alt: "MyAssetLocker Logo",
    width: 150,
    height: 150,
  };

  const headline = "DOWNLOAD THE APP TODAY!";

  const screenshots = [
    "/carousel/screen1.png",
    "/carousel/screen2.png",
    "/carousel/screen3.png",
    "/carousel/screen4.png",
    "/carousel/screen5.png",
    "/carousel/screen6.png",
    "/carousel/screen7.png",
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % screenshots.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, screenshots.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % screenshots.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + screenshots.length) % screenshots.length);
    setIsAutoPlaying(false);
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column - App Download Section */}
          <div className="lg:col-span-4 text-center lg:text-left">
            {/* Logo */}
            <div className="mb-8">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width || 150}
                height={logo.height || 150}
                className="mx-auto"
              />
            </div>

            {/* Headline */}
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-8 uppercase text-center">
              {headline}
            </h2>

            {/* App Store Buttons */}
            <AppStoreButtons className="mx-auto" />
          </div>

          {/* Right Column - Screenshot Carousel */}
          <div className="lg:col-span-8">
            <div className="relative">
              {/* Carousel Container */}
              <div className="overflow-hidden rounded-2xl bg-white">
                <div
                  className="flex transition-transform duration-500 ease-in-out bg-transparent my-8"
                  style={{
                    transform: `translateX(-${currentSlide * (100 / 3)}%)`,
                  }}
                >
                  {screenshots.map((screenshot, index) => (
                    <div key={index} className="w-1/3 flex-shrink-0 px-2">
                      <div className="relative">
                        <Image
                          src={screenshot}
                          alt={`App screenshot ${index + 1}`}
                          width={200}
                          height={400}
                          className="w-full h-auto mx-auto"
                        />
                        {/* Phone frame effect */}
                        <div className="absolute inset-0 pointer-events-none"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 z-10"
                aria-label="Previous screenshot"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 z-10"
                aria-label="Next screenshot"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* Carousel Indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {screenshots.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentSlide
                      ? "bg-primary-500 scale-125"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default AppShowcase;
