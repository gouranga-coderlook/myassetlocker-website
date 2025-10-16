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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDigitalLockerOpen, setIsDigitalLockerOpen] = useState(false);

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
      }, 10); // Small delay to debounce
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);


  // Mobile menu toggle
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when clicking outside or on a link
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsDigitalLockerOpen(false);
  };

  // Toggle Digital Locker submenu
  const toggleDigitalLocker = () => {
    setIsDigitalLockerOpen(!isDigitalLockerOpen);
  };

  // Helper function to check if a link is active
  const isActive = (href: string) => {
    if (!mounted) return false;
    return pathname === href;
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#e8e8e8]/50 transition-all duration-300 ${
        isScrolled ? "shadow-lg shadow-[#4c4946]/10" : ""
      }`}
    >
      {/* Scroll Progress Bar - Top */}
      {isScrolled && (
        <div className="absolute top-0 left-0 w-full h-1 bg-[#e8e8e8] z-10">
          <div
            className="h-full bg-gradient-to-r from-[#ea9637] to-[#FB9A2D] transition-all duration-150 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      )}

      <div
        className={`container mx-auto px-4 sm:px-6 lg:px-8 ${
          isScrolled ? "h-16" : "h-20"
        }`}
        style={{
          transition: "height 0.3s ease-in-out",
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
                  transition: "all 0.3s ease-in-out",
                }}
              />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8 ml-auto">
            <Link
              href="/"
              className={`transition-all duration-300 font-semibold text-sm lg:text-base ${
                isActive("/")
                  ? "text-[#f8992f] font-bold"
                  : "text-[#4c4946] hover:text-[#f8992f]"
              }`}
            >
              Home
            </Link>
            <Link
              href="/valet-storage"
              className={`transition-all duration-300 font-semibold text-sm lg:text-base ${
                isActive("/valet-storage")
                  ? "text-[#f8992f] font-bold"
                  : "text-[#4c4946] hover:text-[#f8992f]"
              }`}
            >
              Valet Storage
            </Link>
            <div className="relative group">
              <Link
                href="/digital-locker"
                className={`flex items-center space-x-1 transition-all duration-300 font-semibold text-sm lg:text-base ${
                  isActive("/digital-locker")
                    ? "text-[#f8992f] font-bold"
                    : "text-[#4c4946] hover:text-[#f8992f]"
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
              <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#e8e8e8] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="py-3">
                  <Link
                    href="/digital-locker/home-owners"
                    className={`block px-6 py-3 text-sm font-semibold transition-colors border-b border-[#e8e8e8] ${
                      isActive("/digital-locker/home-owners")
                        ? "text-[#f8992f] bg-[#fef7ed]"
                        : "text-[#4c4946] hover:text-[#f8992f] hover:bg-[#f7f7f7]"
                    }`}
                  >
                    Home Owners
                  </Link>
                  <Link
                    href="/digital-locker/businesses"
                    className={`block px-6 py-3 text-sm font-semibold transition-colors border-b border-[#e8e8e8] ${
                      isActive("/digital-locker/businesses")
                        ? "text-[#f8992f] bg-[#fef7ed]"
                        : "text-[#4c4946] hover:text-[#f8992f] hover:bg-[#f7f7f7]"
                    }`}
                  >
                    Businesses
                  </Link>
                  <Link
                    href="/digital-locker/insurance-companies"
                    className={`block px-6 py-3 text-sm font-semibold transition-colors ${
                      isActive("/digital-locker/insurance-companies")
                        ? "text-[#f8992f] bg-[#fef7ed]"
                        : "text-[#4c4946] hover:text-[#f8992f] hover:bg-[#f7f7f7]"
                    }`}
                  >
                    Insurance Companies
                  </Link>
                </div>
              </div>
            </div>
            <Link
              href="/pricing"
              className={`transition-all duration-300 font-semibold text-sm lg:text-base ${
                isActive("/pricing")
                  ? "text-[#f8992f] font-bold"
                  : "text-[#4c4946] hover:text-[#f8992f]"
              }`}
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className={`transition-all duration-300 font-semibold text-sm lg:text-base ${
                isActive("/about")
                  ? "text-[#f8992f] font-bold"
                  : "text-[#4c4946] hover:text-[#f8992f]"
              }`}
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className={`transition-all duration-300 font-semibold text-sm lg:text-base ${
                isActive("/contact")
                  ? "text-[#f8992f] font-bold"
                  : "text-[#4c4946] hover:text-[#f8992f]"
              }`}
            >
              Contact Us
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-3 rounded-xl text-[#4c4946] hover:text-[#f8992f] hover:bg-[#f7f7f7] transition-all duration-300 min-h-[48px] min-w-[48px]"
            aria-label="Toggle mobile menu"
          >
            <svg
              className={`w-6 h-6 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40 md:hidden animate-fade-in"
            onClick={closeMobileMenu}
          />
          
          {/* Menu Panel */}
          <div className={`fixed inset-x-0 ${isScrolled ? 'top-16' : 'top-20'} z-50 md:hidden bg-white h-screen animate-slide-in-right`}>
          {/* Mobile Menu Links */}
          <nav className="flex-1 p-6 space-y-4 bg-white animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <Link
              href="/"
              onClick={closeMobileMenu}
              className={`block px-6 py-5 text-xl font-semibold rounded-2xl transition-all duration-300 animate-fade-in-up ${
                isActive("/")
                  ? "text-[#f8992f] bg-[#fef7ed] shadow-sm"
                  : "text-[#4c4946] hover:text-[#f8992f] hover:bg-[#f7f7f7]"
              }`}
              style={{animationDelay: '0.3s'}}
            >
              Home
            </Link>
            <Link
              href="/valet-storage"
              onClick={closeMobileMenu}
              className={`block px-6 py-5 text-xl font-semibold rounded-2xl transition-all duration-300 animate-fade-in-up ${
                isActive("/valet-storage")
                  ? "text-[#f8992f] bg-[#fef7ed] shadow-sm"
                  : "text-[#4c4946] hover:text-[#f8992f] hover:bg-[#f7f7f7]"
              }`}
              style={{animationDelay: '0.4s'}}
            >
              Valet Storage
            </Link>
            <div className="animate-fade-in-up" style={{animationDelay: '0.5s'}}>
              {/* Digital Locker Toggle Button */}
              <button
                onClick={toggleDigitalLocker}
                className={`w-full flex items-center justify-between px-6 py-5 text-xl font-semibold rounded-2xl transition-all duration-500 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] ${
                  isActive("/digital-locker") || isActive("/digital-locker/home-owners") || isActive("/digital-locker/businesses") || isActive("/digital-locker/insurance-companies")
                    ? "text-[#f8992f] bg-[#fef7ed] shadow-sm"
                    : "text-[#4c4946] hover:text-[#f8992f] hover:bg-[#f7f7f7]"
                }`}
              >
                <span className="transition-all duration-300">Digital Locker</span>
                <svg
                  className={`w-5 h-5 transition-all duration-500 ease-in-out ${isDigitalLockerOpen ? 'rotate-180 scale-110' : 'rotate-0 scale-100'}`}
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
              </button>
              
              {/* Digital Locker Submenu */}
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                isDigitalLockerOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="ml-6 space-y-2 mt-2 pb-2">
                  <Link
                    href="/digital-locker/home-owners"
                    onClick={closeMobileMenu}
                    className={`block px-4 py-3 text-lg font-medium rounded-xl transition-all duration-300 animate-fade-in-stagger ${
                      isActive("/digital-locker/home-owners")
                        ? "text-[#f8992f] bg-[#fef7ed] shadow-sm"
                        : "text-[#8e9293] hover:text-[#f8992f] hover:bg-[#f7f7f7]"
                    }`}
                    style={{animationDelay: isDigitalLockerOpen ? '0.1s' : '0s'}}
                  >
                    Home Owners
                  </Link>
                  <Link
                    href="/digital-locker/businesses"
                    onClick={closeMobileMenu}
                    className={`block px-4 py-3 text-lg font-medium rounded-xl transition-all duration-300 animate-fade-in-stagger ${
                      isActive("/digital-locker/businesses")
                        ? "text-[#f8992f] bg-[#fef7ed] shadow-sm"
                        : "text-[#8e9293] hover:text-[#f8992f] hover:bg-[#f7f7f7]"
                    }`}
                    style={{animationDelay: isDigitalLockerOpen ? '0.2s' : '0s'}}
                  >
                    Businesses
                  </Link>
                  <Link
                    href="/digital-locker/insurance-companies"
                    onClick={closeMobileMenu}
                    className={`block px-4 py-3 text-lg font-medium rounded-xl transition-all duration-300 animate-fade-in-stagger ${
                      isActive("/digital-locker/insurance-companies")
                        ? "text-[#f8992f] bg-[#fef7ed] shadow-sm"
                        : "text-[#8e9293] hover:text-[#f8992f] hover:bg-[#f7f7f7]"
                    }`}
                    style={{animationDelay: isDigitalLockerOpen ? '0.3s' : '0s'}}
                  >
                    Insurance Companies
                  </Link>
                </div>
              </div>
            </div>
            <Link
              href="/pricing"
              onClick={closeMobileMenu}
              className={`block px-6 py-5 text-xl font-semibold rounded-2xl transition-all duration-300 animate-fade-in-up ${
                isActive("/pricing")
                  ? "text-[#f8992f] bg-[#fef7ed] shadow-sm"
                  : "text-[#4c4946] hover:text-[#f8992f] hover:bg-[#f7f7f7]"
              }`}
              style={{animationDelay: '0.6s'}}
            >
              Pricing
            </Link>
            <Link
              href="/about"
              onClick={closeMobileMenu}
              className={`block px-6 py-5 text-xl font-semibold rounded-2xl transition-all duration-300 animate-fade-in-up ${
                isActive("/about")
                  ? "text-[#f8992f] bg-[#fef7ed] shadow-sm"
                  : "text-[#4c4946] hover:text-[#f8992f] hover:bg-[#f7f7f7]"
              }`}
              style={{animationDelay: '0.7s'}}
            >
              About Us
            </Link>
            <Link
              href="/contact"
              onClick={closeMobileMenu}
              className={`block px-6 py-5 text-xl font-semibold rounded-2xl transition-all duration-300 animate-fade-in-up ${
                isActive("/contact")
                  ? "text-[#f8992f] bg-[#fef7ed] shadow-sm"
                  : "text-[#4c4946] hover:text-[#f8992f] hover:bg-[#f7f7f7]"
              }`}
              style={{animationDelay: '0.8s'}}
            >
              Contact Us
            </Link>
          </nav>
          </div>
        </>
      )}
    </header>
  );
}
