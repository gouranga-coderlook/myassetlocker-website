"use client";

import { useEffect } from "react";
import Hero from "@/components/Hero";
import AppShowcase from "@/components/AppShowcase";
import { useAuth } from "@/lib/hooks/useAuth";

export default function Home() {
  const { openAuthPopup } = useAuth();

  useEffect(() => {
    // Check for auth popup flag from sessionStorage (set by 401 interceptor)
    // Also check URL parameters for backward compatibility
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const signin = urlParams.get("signin");
      const returnUrl = urlParams.get("returnUrl");
      const shouldOpenPopup = sessionStorage.getItem("openAuthPopup") === "true";
      
      // Check both sessionStorage flag and URL parameter for backward compatibility
      if (shouldOpenPopup || signin === "true") {
        // Store returnUrl in sessionStorage for redirect after login (if not already stored)
        if (returnUrl && !sessionStorage.getItem("authReturnUrl")) {
          sessionStorage.setItem("authReturnUrl", returnUrl);
        }
        
        // Clear the sessionStorage flag
        sessionStorage.removeItem("openAuthPopup");
        
        // Clean up URL parameters if present (for backward compatibility)
        if (signin === "true") {
          const cleanUrl = window.location.pathname;
          window.history.replaceState({}, "", cleanUrl);
        }
        
        // Open auth popup
        setTimeout(() => {
          openAuthPopup();
        }, 300); // Small delay to ensure page is fully loaded
      }
    }
  }, [openAuthPopup]);

  return (
    <div className="min-h-screen">
      <Hero
        backgroundImage="/Devistated-home-fire.jpg"
        headline="Protect What You Own Digitally & Physically"
        bodyText="Your assets, insured and secured — all managed in our app."
        ctaButton={{
          enabled: true,
          text: "GET STARTED",
          href: "https://apps.apple.com/app/myassetlocker",
          openInNewTab: true,
        }}
        isHomePage={true}
      />
      <div className="relative">
        {/* Value Pillars */}
        <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-[#f7f7f7] to-[#fef7ed] relative overflow-hidden group">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute top-0 left-0 w-full h-full"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234c4946' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            ></div>
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12 sm:mb-16 md:mb-20">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#4c4946] mb-4 sm:mb-6 px-4">
                Complete Asset Protection
              </h2>
              <p className="text-lg sm:text-xl text-[#8e9293] max-w-3xl mx-auto leading-relaxed px-4">
                Everything you need to secure, organize, and protect your
                valuable assets
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <div className="text-center group p-4 sm:p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#fef7ed] to-[#fbd7a5] rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <svg
                    className="w-8 h-8 sm:w-10 sm:h-10 text-[#f8992f]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#4c4946] mb-2 sm:mb-3">
                  Digital Locker
                </h3>
                <p className="text-base sm:text-lg text-[#8e9293] leading-relaxed">
                  Secure digital inventory with photos, receipts, and reports
                </p>
              </div>

              <div className="text-center group p-4 sm:p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#f7f7f7] to-[#e8e8e8] rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <svg
                    className="w-8 h-8 sm:w-10 sm:h-10 text-[#8e9293]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#4c4946] mb-2 sm:mb-3">
                  Valet Storage
                </h3>
                <p className="text-base sm:text-lg text-[#8e9293] leading-relaxed">
                  Professional pickup, storage, and redelivery service
                </p>
              </div>

              <div className="text-center group p-4 sm:p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7] rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <svg
                    className="w-8 h-8 sm:w-10 sm:h-10 text-[#22c55e]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#4c4946] mb-2 sm:mb-3">
                  Insurance-Ready
                </h3>
                <p className="text-base sm:text-lg text-[#8e9293] leading-relaxed">
                  Comprehensive documentation for faster claims processing
                </p>
              </div>

              <div className="text-center group p-4 sm:p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#f3e8ff] to-[#e9d5ff] rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <svg
                    className="w-8 h-8 sm:w-10 sm:h-10 text-[#a855f7]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#4c4946] mb-2 sm:mb-3">
                  Secure
                </h3>
                <p className="text-base sm:text-lg text-[#8e9293] leading-relaxed">
                  Bank-level encryption and secure cloud storage
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-white via-[#fef7ed]/30 to-[#f7f7f7]/50 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-gradient-to-br from-[#f8992f]/10 to-transparent rounded-full -translate-y-32 sm:-translate-y-40 md:-translate-y-48 translate-x-32 sm:translate-x-40 md:translate-x-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-gradient-to-tr from-[#8e9293]/10 to-transparent rounded-full translate-y-32 sm:translate-y-40 md:translate-y-48 -translate-x-32 sm:-translate-x-40 md:-translate-x-48"></div>
          
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute top-0 left-0 w-full h-full"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234c4946' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            ></div>
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12 sm:mb-16 md:mb-20">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#4c4946] mb-4 sm:mb-6 px-4">
                How It Works
              </h2>
              <p className="text-lg sm:text-xl text-[#8e9293] max-w-3xl mx-auto leading-relaxed px-4">
                Three simple steps to complete asset protection
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
                {/* Step 1 */}
                <div className="text-center group">
                  <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-[#e8e8e8]/50">
                    <h3 className="text-xl sm:text-2xl font-bold text-[#4c4946] mb-3 sm:mb-4">
                      Create Your Inventory
                    </h3>
                    <p className="text-base sm:text-lg text-[#8e9293] leading-relaxed">
                      Take photos, upload receipts, and organize your digital assets
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="text-center group">
                  <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-[#e8e8e8]/50">
                    <h3 className="text-xl sm:text-2xl font-bold text-[#4c4946] mb-3 sm:mb-4">
                    Schedule Storage
                  </h3>
                    <p className="text-base sm:text-lg text-[#8e9293] leading-relaxed">
                    Book pickup for physical items and choose storage options
                  </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="text-center group">
                  <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-[#e8e8e8]/50">
                    <h3 className="text-xl sm:text-2xl font-bold text-[#4c4946] mb-3 sm:mb-4">
                      Manage Everything
                    </h3>
                    <p className="text-base sm:text-lg text-[#8e9293] leading-relaxed">
                      Access your unified dashboard and manage everything in our app
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Bottom CTA */}
              <div className="text-center mt-12 sm:mt-16">
                <a
                  href="https://apps.apple.com/app/myassetlocker"
                  className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-[#f8992f] to-[#e8911f] hover:from-[#e8911f] hover:to-[#c2751a] text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <span>Start Protecting Your Assets</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Who We Serve */}
        <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-[#f7f7f7] to-[#fef7ed] relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute top-0 left-0 w-full h-full"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234c4946' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            ></div>
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12 sm:mb-16 md:mb-20">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#4c4946] mb-4 sm:mb-6 px-4">
                Who We Serve
              </h2>
              <p className="text-lg sm:text-xl text-[#8e9293] max-w-3xl mx-auto leading-relaxed px-4">
                Tailored solutions for different needs
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-[#e8e8e8]">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#fef7ed] to-[#fbd7a5] rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                  <svg
                    className="w-7 h-7 sm:w-8 sm:h-8 text-[#f8992f]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#4c4946] mb-3 sm:mb-4">
                  Home Owners
                </h3>
                <p className="text-base sm:text-lg text-[#8e9293] mb-4 sm:mb-6 leading-relaxed">
                  Complete household inventory management for faster insurance
                  claims
                </p>
                <ul className="text-sm sm:text-base text-[#8e9293] space-y-2 mb-6 sm:mb-8">
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-[#f8992f] mr-2 sm:mr-3 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Digital asset cataloging
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-[#f8992f] mr-2 sm:mr-3 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Receipt and document storage
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-[#f8992f] mr-2 sm:mr-3 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Seasonal item storage
                  </li>
                </ul>
                <a
                  href="https://apps.apple.com/app/myassetlocker"
                  className="w-full inline-flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-[#f8992f] to-[#e8911f] hover:from-[#e8911f] hover:to-[#c2751a] text-white rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 min-h-[48px]"
                >
                  Start Your Home Inventory
                </a>
              </div>

              <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-[#e8e8e8]">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#f7f7f7] to-[#e8e8e8] rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                  <svg
                    className="w-7 h-7 sm:w-8 sm:h-8 text-[#8e9293]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#4c4946] mb-3 sm:mb-4">
                  Businesses
                </h3>
                <p className="text-base sm:text-lg text-[#8e9293] mb-4 sm:mb-6 leading-relaxed">
                  Equipment ledger and overflow storage solutions
                </p>
                <ul className="text-sm sm:text-base text-[#8e9293] space-y-2 mb-6 sm:mb-8">
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-[#8e9293] mr-2 sm:mr-3 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Multi-user access
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-[#8e9293] mr-2 sm:mr-3 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Compliance reporting
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-[#8e9293] mr-2 sm:mr-3 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Equipment tracking
                  </li>
                </ul>
                <a
                  href="https://apps.apple.com/app/myassetlocker"
                  className="w-full inline-flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-[#8e9293] to-[#6b6b6b] hover:from-[#6b6b6b] hover:to-[#5a5a5a] text-white rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 min-h-[48px]"
                >
                  Get Business Solution
                </a>
              </div>

              <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-[#e8e8e8]">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7] rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                  <svg
                    className="w-7 h-7 sm:w-8 sm:h-8 text-[#22c55e]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#4c4946] mb-3 sm:mb-4">
                  Insurance Companies
                </h3>
                <p className="text-base sm:text-lg text-[#8e9293] mb-4 sm:mb-6 leading-relaxed">
                  Streamlined claims processing and partnership opportunities
                </p>
                <ul className="text-sm sm:text-base text-[#8e9293] space-y-2 mb-6 sm:mb-8">
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-[#22c55e] mr-2 sm:mr-3 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Faster claim verification
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-[#22c55e] mr-2 sm:mr-3 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Detailed asset reports
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-[#22c55e] mr-2 sm:mr-3 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Partnership programs
                  </li>
                </ul>
                <a
                  href="https://apps.apple.com/app/myassetlocker"
                  className="w-full inline-flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:from-[#16a34a] hover:to-[#15803d] text-white rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 min-h-[48px]"
                >
                  Partner With Us
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Trust & Security */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Trusted & Secure
              </h2>
              <p className="text-base text-text-secondary max-w-2xl mx-auto">
                Bank-level security with industry-leading encryption
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-primary-600 dark:text-primary-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  256-bit Encryption
                </h3>
                <p className="text-base text-text-secondary">
                  Military-grade security for all your data
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-secondary-100 dark:bg-secondary-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-secondary-600 dark:text-secondary-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  SOC 2 Compliant
                </h3>
                <p className="text-base text-text-secondary">
                  Audited security and compliance standards
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-success-100 dark:bg-success-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-success-600 dark:text-success-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  99.9% Uptime
                </h3>
                <p className="text-base text-text-secondary">
                  Reliable access to your assets anytime
                </p>
              </div>
            </div>

            {/* Testimonials */}
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {Array.from({ length: 5 }, (_, i) => (
                        <svg
                          key={`star-${i}`}
                          className="w-4 h-4 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-base text-text-secondary mb-4">
                    MyAssetLocker saved me thousands during my insurance claim.
                    Having everything documented made the process so much
                    faster.
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                      S
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary">
                        Sarah Johnson
                      </p>
                      <p className="text-sm text-text-secondary">
                        Homeowner • Verified Customer
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {Array.from({ length: 5 }, (_, i) => (
                        <svg
                          key={`star-${i}`}
                          className="w-4 h-4 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-base text-text-secondary mb-4">
                    &ldquo;The valet storage service is incredible. They picked
                    up my seasonal items and delivered them right when I needed
                    them.&rdquo;
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-secondary-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                      M
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary">
                        Mike Chen
                      </p>
                      <p className="text-sm text-text-secondary">
                        Business Owner • Verified Customer
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {Array.from({ length: 5 }, (_, i) => (
                        <svg
                          key={`star-${i}`}
                          className="w-4 h-4 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-base text-text-secondary mb-4">
                    &ldquo;As an insurance agent, MyAssetLocker makes my job so
                    much easier. Claims are processed 3x faster with their
                    detailed reports.&rdquo;
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-success-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                      L
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary">
                        Lisa Rodriguez
                      </p>
                      <p className="text-sm text-text-secondary">
                        Insurance Agent • Partner
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-12 text-center">
                <p className="text-sm text-text-tertiary mb-6">
                  Trusted by leading organizations
                </p>
                <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                  <div className="bg-white dark:bg-neutral-800 rounded-lg px-4 py-2 shadow-sm">
                    <span className="text-sm font-semibold text-text-primary">
                      SOC 2 Type II
                    </span>
                  </div>
                  <div className="bg-white dark:bg-neutral-800 rounded-lg px-4 py-2 shadow-sm">
                    <span className="text-sm font-semibold text-text-primary">
                      256-bit SSL
                    </span>
                  </div>
                  <div className="bg-white dark:bg-neutral-800 rounded-lg px-4 py-2 shadow-sm">
                    <span className="text-sm font-semibold text-text-primary">
                      GDPR Compliant
                    </span>
                  </div>
                  <div className="bg-white dark:bg-neutral-800 rounded-lg px-4 py-2 shadow-sm">
                    <span className="text-sm font-semibold text-text-primary">
                      ISO 27001
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* CTA Section */}
        <AppShowcase />
      </div>
    </div>
  );
}
