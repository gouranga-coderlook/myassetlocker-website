"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Prevent hydration mismatch by only showing active states after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Simple scroll handler
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = Math.min((scrollTop / docHeight) * 100, 100);
        
        setIsScrolled(scrollTop > 100);
        setScrollProgress(progress);
        setShowScrollTop(scrollTop > 300);
      }, 10); // Small delay to debounce
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Helper function to check if a link is active
  const isActive = (href: string) => {
    if (!mounted) return false;
    return pathname === href;
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white border-b border-gray-200 transition-shadow duration-300 ${
        isScrolled ? "shadow-md" : ""
      }`}
    >
      {/* Scroll Progress Bar - Top */}
      {isScrolled && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-200 z-10">
          <div
            className="h-full bg-gradient-to-r from-[#ea9637] to-[#FB9A2D] transition-all duration-150 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      )}

      <div
        className={`container mx-auto px-4 sm:px-6 lg:px-32 ${
          isScrolled ? "h-12" : "h-20"
        }`}
        style={{
          transition: 'height 0.3s ease-in-out',
        }}
      >
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Image
                src="/logo.png"
                alt="MyAssetLocker"
                width={isScrolled ? 100 : 180}
                height={isScrolled ? 100 : 180}
                style={{
                  transition: 'all 0.3s ease-in-out',
                }}
              />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-10 ml-auto font-bold">
            <Link
              href="/"
              className={`transition-colors ${
                isActive("/")
                  ? "text-primary-600 dark:text-primary-400 font-bold"
                  : "text-[#FB9A2D] dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400"
              }`}
            >
              Home
            </Link>            
            <Link
              href="/valet-storage"
              className={`transition-colors ${
                isActive("/valet-storage")
                  ? "text-primary-600 dark:text-primary-400 font-bold"
                  : "text-[#FB9A2D] dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400"
              }`}
            >
              Valet Storage
            </Link>
            <div className="relative group">
              <Link
                href="/digital-locker"
                className={`flex items-center space-x-1 transition-colors ${
                  isActive("/digital-locker")
                    ? "text-primary-600 dark:text-primary-400 font-bold"
                    : "text-[#FB9A2D] dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400"
                }`}
              >
                <span>Digital Locker</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </Link>
              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 mt-2 w-48 bg-gray-800 dark:bg-gray-900 rounded-lg shadow-lg border border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <Link
                    href="/digital-locker/home-owners"
                    className={`block px-4 py-3 text-sm font-bold transition-colors border-b border-gray-600 ${
                      isActive("/digital-locker/home-owners")
                        ? "text-primary-400 bg-primary-900/20"
                        : "text-[#FB9A2D] hover:text-primary-400 hover:bg-gray-700"
                    }`}
                  >
                    Home Owners
                  </Link>
                  <Link
                    href="/digital-locker/businesses"
                    className={`block px-4 py-3 text-sm font-bold transition-colors border-b border-gray-600 ${
                      isActive("/digital-locker/businesses")
                        ? "text-primary-400 bg-primary-900/20"
                        : "text-[#FB9A2D] hover:text-primary-400 hover:bg-gray-700"
                    }`}
                  >
                    Businesses
                  </Link>
                  <Link
                    href="/digital-locker/insurance-companies"
                    className={`block px-4 py-3 text-sm font-bold transition-colors ${
                      isActive("/digital-locker/insurance-companies")
                        ? "text-primary-400 bg-primary-900/20"
                        : "text-[#FB9A2D] hover:text-primary-400 hover:bg-gray-700"
                    }`}
                  >
                    Insurance Companies
                  </Link>
                </div>
              </div>
            </div>
            <Link
              href="/pricing"
              className={`transition-colors ${
                isActive("/pricing")
                  ? "text-primary-600 dark:text-primary-400 font-bold"
                  : "text-[#FB9A2D] dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400"
              }`}
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className={`transition-colors ${
                isActive("/about")
                  ? "text-primary-600 dark:text-primary-400 font-bold"
                  : "text-[#FB9A2D] dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400"
              }`}
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className={`transition-colors ${
                isActive("/contact")
                  ? "text-primary-600 dark:text-primary-400 font-bold"
                  : "text-[#FB9A2D] dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400"
              }`}
            >
              Contact Us
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-lg text-[#FB9A2D] dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-background-secondary transition-colors">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-[#ea9637] to-[#FB9A2D] hover:from-[#FB9A2D] hover:to-[#ea9637] text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#FB9A2D] focus:ring-opacity-50"
          aria-label="Scroll to top"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </header>
  );
}
