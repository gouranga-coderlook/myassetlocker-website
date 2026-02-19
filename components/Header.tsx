"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProfileIfNeeded } from "@/store/slices/profileSlice";
import { getAvatarUrl, fetchMediaBlob } from "@/lib/api/authService";
import UserMenu from "./UserMenu";

export default function Header() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.profile.profileData);
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDigitalLockerOpen, setIsDigitalLockerOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [mobileAvatarBlobUrl, setMobileAvatarBlobUrl] = useState<string | null>(null);
  const { isAuthenticated, authHydrated, user, openAuthPopup } = useAuth();

  useEffect(() => {
    if (user?.id) dispatch(fetchProfileIfNeeded());
  }, [user?.id, dispatch]);

  // Avatar for mobile profile section: same resolution as UserMenu (profile preferred, then user; blob for server media ID)
  const avatarFromProfile = profile?.avatar ?? (profile as { media?: string })?.media;
  const avatarFromUser = user?.avatar ?? (user as { media?: string })?.media;
  const avatarMediaId = avatarFromProfile ?? avatarFromUser;
  const avatarMediaIdStr = avatarMediaId != null ? String(avatarMediaId) : "";
  const isServerMediaId =
    avatarMediaIdStr &&
    !avatarMediaIdStr.startsWith("data:") &&
    !avatarMediaIdStr.startsWith("blob:") &&
    !avatarMediaIdStr.startsWith("http");
  useEffect(() => {
    const id = isServerMediaId ? avatarMediaIdStr : null;
    if (!id) {
      setMobileAvatarBlobUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      return;
    }
    let revoked = false;
    fetchMediaBlob(id)
      .then((blob) => {
        if (revoked) return;
        const url = URL.createObjectURL(blob);
        setMobileAvatarBlobUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
      })
      .catch(() => {
        if (!revoked) {
          setMobileAvatarBlobUrl(null);
        }
      });
    return () => {
      revoked = true;
      setMobileAvatarBlobUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    };
  }, [isServerMediaId, avatarMediaIdStr]);

  // Never use direct API URL for server media ID (img would send no auth -> 401). Use blob or null.
  const mobileAvatarUrl = isServerMediaId
    ? (mobileAvatarBlobUrl ?? null)
    : getAvatarUrl(avatarFromProfile ?? avatarFromUser);

  // Prevent hydration mismatch by only showing active states after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll handler with hysteresis so header does not "dance" near one threshold.
  // Shrink only when scrollY > 100; expand only when scrollY < 50. Between 50–100, state is unchanged.
  const SCROLL_SHRINK_THRESHOLD = 100;
  const SCROLL_EXPAND_THRESHOLD = 50;
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = Math.min((scrollTop / docHeight) * 100, 100);

        setIsScrolled((prev) => {
          if (scrollTop > SCROLL_SHRINK_THRESHOLD) return true;
          if (scrollTop < SCROLL_EXPAND_THRESHOLD) return false;
          return prev;
        });
        setScrollProgress(progress);
      }, 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
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
    setIsProfileMenuOpen(false);
  };

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.overflow = "hidden";
    } else {
      const scrollY = document.body.style.top ? parseInt(document.body.style.top, 10) * -1 : 0;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      if (scrollY) window.scrollTo(0, scrollY);
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Toggle Digital Locker submenu
  const toggleDigitalLocker = () => {
    setIsDigitalLockerOpen(!isDigitalLockerOpen);
  };

  // Toggle profile/account submenu (mobile)
  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
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
      {/* Scroll Progress Bar - 1px always reserved to avoid layout pop; track visible only when scrolled */}
      {mounted && (
        <div
          className={`absolute top-0 left-0 w-full h-1 z-10 transition-colors duration-200 ${
            isScrolled ? "bg-[#e8e8e8]" : "bg-transparent"
          }`}
        >
          <div
            className="h-full bg-gradient-to-r from-[#ea9637] to-[#FB9A2D] transition-all duration-150 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      )}

      {/* Height transitions smoothly (h-20 → h-16) so no abrupt "dancing" at threshold */}
      <div
        className={`container mx-auto px-4 sm:px-6 lg:px-8 transition-[height] duration-300 ease-in-out ${
          mounted && isScrolled ? "h-16" : "h-20"
        }`}
      >
        <div className="flex items-center justify-between h-full">
          {/* Logo - size transitions smoothly with header (180→100) to match previous behavior */}
          <div
            className={`flex items-center overflow-hidden transition-[width,height] duration-300 ease-in-out ${
              mounted && isScrolled ? "h-16 w-[100px]" : "h-20 w-[180px]"
            }`}
          >
            <Link href="/" className="hover:opacity-80 transition-opacity flex items-center h-full w-full">
              <Image
                src="/logo.png"
                alt="MyAssetLocker"
                width={180}
                height={180}
                className="h-full w-full object-contain object-left"
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
            {mounted && authHydrated && isAuthenticated ? (
              <div className="ml-4 pl-4 border-l border-gray-300">
                <UserMenu />
              </div>
            ) : (
              // Reserve space and prevent hydration mismatch: disabled/invisible until mounted and auth hydrated; then show Sign In
              <button
                disabled={!mounted || !authHydrated}
                onClick={mounted && authHydrated ? openAuthPopup : undefined}
                className={`ml-4 px-4 py-2 bg-gradient-to-r from-[#ea9637] to-[#FB9A2D] text-white font-semibold rounded-lg text-sm ${
                  !mounted || !authHydrated
                    ? "opacity-0 pointer-events-none"
                    : "hover:from-[#d8852a] hover:to-[#e88a25] transition-all duration-200"
                }`}
                aria-hidden={!mounted || !authHydrated}
                suppressHydrationWarning
              >
                Sign In
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-3 rounded-xl text-[#4c4946] hover:text-[#f8992f] hover:bg-[#f7f7f7] transition-all duration-300 min-h-[48px] min-w-[48px]"
            aria-label="Toggle mobile menu"
            suppressHydrationWarning
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
          <div
            className={`fixed inset-x-0 z-50 md:hidden bg-white h-screen animate-slide-in-right transition-[top] duration-300 ease-in-out ${
              mounted && isScrolled ? "top-16" : "top-20"
            }`}
          >
          {/* Profile section - top of mobile menu (authenticated only), dropdown like Digital Locker */}
          {mounted && authHydrated && isAuthenticated && user && (
            <div className="border-b border-[#e8e8e8]/50 bg-[#fef7ed]/50 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <button
                type="button"
                onClick={toggleProfileMenu}
                className="w-full flex items-center gap-4 p-6 pb-4 text-left transition-all duration-300 hover:bg-[#fef7ed]/70"
              >
                <div className="relative w-14 h-14 rounded-full bg-gradient-to-r from-[#ea9637] to-[#FB9A2D] flex items-center justify-center text-white font-semibold text-xl shrink-0 overflow-hidden">
                  {mobileAvatarUrl ? (
                    <Image
                      src={mobileAvatarUrl}
                      alt={profile?.firstName || user?.name?.split(" ")[0] || user?.email?.split("@")[0] || "User"}
                      fill
                      sizes="56px"
                      unoptimized
                      className="object-cover object-center rounded-full"
                    />
                  ) : (
                    (profile?.firstName || user?.name?.split(" ")[0] || user?.email?.split("@")[0] || "U").charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#4c4946] font-semibold text-lg truncate">
                    Hi, {profile?.firstName || user?.name?.split(" ")[0] || user?.email?.split("@")[0] || "User"}
                  </p>
                  <p className="text-[#8e9293] text-sm truncate">{profile?.email || user?.email}</p>
                </div>
                <svg
                  className={`w-5 h-5 text-[#f8992f] shrink-0 transition-all duration-500 ease-in-out ${isProfileMenuOpen ? "rotate-180 scale-110" : "rotate-0 scale-100"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isProfileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="px-6 pb-4 space-y-2">
                  <Link
                    href="/profile"
                    onClick={closeMobileMenu}
                    className={`block px-4 py-3 text-lg font-medium rounded-xl transition-all duration-300 ${
                      isActive("/profile")
                        ? "text-[#f8992f] bg-[#fef7ed] shadow-sm"
                        : "text-[#8e9293] hover:text-[#f8992f] hover:bg-[#f7f7f7]"
                    }`}
                  >
                    My profile
                  </Link>
                  <Link
                    href="/bookings"
                    onClick={closeMobileMenu}
                    className={`block px-4 py-3 text-lg font-medium rounded-xl transition-all duration-300 ${
                      isActive("/bookings")
                        ? "text-[#f8992f] bg-[#fef7ed] shadow-sm"
                        : "text-[#8e9293] hover:text-[#f8992f] hover:bg-[#f7f7f7]"
                    }`}
                  >
                    Bookings
                  </Link>
                  <Link
                    href="/cart"
                    onClick={closeMobileMenu}
                    className={`block px-4 py-3 text-lg font-medium rounded-xl transition-all duration-300 ${
                      isActive("/cart")
                        ? "text-[#f8992f] bg-[#fef7ed] shadow-sm"
                        : "text-[#8e9293] hover:text-[#f8992f] hover:bg-[#f7f7f7]"
                    }`}
                  >
                    Cart
                  </Link>
                </div>
              </div>
            </div>
          )}
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
            {(!mounted || !authHydrated || !isAuthenticated) ? (
              // Sign In when not authenticated; reserve space when not yet mounted/hydrated (prevents layout shift)
              <button
                disabled={!mounted || !authHydrated}
                onClick={mounted && authHydrated ? () => {
                  openAuthPopup();
                  closeMobileMenu();
                } : undefined}
                className={`mx-6 mt-4 px-6 py-5 bg-gradient-to-r from-[#ea9637] to-[#FB9A2D] text-white font-semibold rounded-2xl ${
                  !mounted || !authHydrated
                    ? "opacity-0 pointer-events-none"
                    : "hover:from-[#d8852a] hover:to-[#e88a25] transition-all duration-200 animate-fade-in-up"
                }`}
                style={mounted && authHydrated ? { animationDelay: "0.9s" } : undefined}
                aria-hidden={!mounted || !authHydrated}
                suppressHydrationWarning
              >
                Sign In
              </button>
            ) : null}
          </nav>
          </div>
        </>
      )}
    </header>
  );
}
