import Hero from "@/components/Hero";
import AppShowcase from "@/components/AppShowcase";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero
        backgroundImage="/Devistated-home-fire.jpg"
        headline="Protect What You Own — Digitally & Physically"
        bodyText={`Transform how you protect your valuable assets with our comprehensive digital and physical storage solution. From jewelry and electronics to seasonal items and important documents, MyAssetLocker provides security, detailed documentation, and professional valet storage services — all managed through one powerful app. Never lose track of what you own again, and ensure faster insurance claims with complete asset documentation.`}
        ctaButton={{
          enabled: true,
          text: "GET STARTED",
          href: "https://apps.apple.com/app/myassetlocker",
        }}
      />
      <div className="px-4 lg:px-40">
        {/* Value Pillars */}
        <section className="py-20 bg-background-secondary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Complete Asset Protection
              </h2>
              <p className="text-base text-text-secondary max-w-2xl mx-auto">
                Everything you need to secure, organize, and protect your
                valuable assets
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                  Digital Locker
                </h3>
                <p className="text-base text-text-secondary">
                  Secure digital inventory with photos, receipts, and reports
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
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Valet Storage
                </h3>
                <p className="text-base text-text-secondary">
                  Professional pickup, storage, and redelivery service
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Insurance-Ready
                </h3>
                <p className="text-base text-text-secondary">
                  Comprehensive documentation for faster claims processing
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-warning-100 dark:bg-warning-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-warning-600 dark:text-warning-400"
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
                  Secure
                </h3>
                <p className="text-base text-text-secondary">
                  Bank-level encryption and secure cloud storage
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                How It Works
              </h2>
              <p className="text-base text-text-secondary max-w-2xl mx-auto">
                Three simple steps to complete asset protection
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    1
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    Create Your Inventory
                  </h3>
                  <p className="text-base text-text-secondary">
                    Take photos, upload receipts, and organize your digital
                    assets
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    2
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    Schedule Storage
                  </h3>
                  <p className="text-base text-text-secondary">
                    Book pickup for physical items and choose storage options
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    3
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    Manage Everything
                  </h3>
                  <p className="text-base text-text-secondary">
                    Access your unified dashboard and manage everything in our
                    app
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Who We Serve */}
        <section className="py-20 bg-background-secondary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Who We Serve
              </h2>
              <p className="text-base text-text-secondary max-w-2xl mx-auto">
                Tailored solutions for different needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-lg">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-primary-600 dark:text-primary-400"
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
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Home Owners
                </h3>
                <p className="text-base text-text-secondary mb-4">
                  Complete household inventory management for faster insurance
                  claims
                </p>
                <ul className="text-sm text-text-secondary space-y-1 mb-6">
                  <li>• Digital asset cataloging</li>
                  <li>• Receipt and document storage</li>
                  <li>• Seasonal item storage</li>
                </ul>
                <a
                  href="https://apps.apple.com/app/myassetlocker"
                  className="w-full inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                >
                  Start Your Home Inventory
                </a>
              </div>

              <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-lg">
                <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-secondary-600 dark:text-secondary-400"
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
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Businesses
                </h3>
                <p className="text-base text-text-secondary mb-4">
                  Equipment ledger and overflow storage solutions
                </p>
                <ul className="text-sm text-text-secondary space-y-1 mb-6">
                  <li>• Multi-user access</li>
                  <li>• Compliance reporting</li>
                  <li>• Equipment tracking</li>
                </ul>
                <a
                  href="https://apps.apple.com/app/myassetlocker"
                  className="w-full inline-flex items-center justify-center px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors text-sm font-medium"
                >
                  Get Business Solution
                </a>
              </div>

              <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-lg">
                <div className="w-12 h-12 bg-success-100 dark:bg-success-900 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-success-600 dark:text-success-400"
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
                  Insurance Companies
                </h3>
                <p className="text-base text-text-secondary mb-4">
                  Streamlined claims processing and partnership opportunities
                </p>
                <ul className="text-sm text-text-secondary space-y-1 mb-6">
                  <li>• Faster claim verification</li>
                  <li>• Detailed asset reports</li>
                  <li>• Partnership programs</li>
                </ul>
                <a
                  href="https://apps.apple.com/app/myassetlocker"
                  className="w-full inline-flex items-center justify-center px-4 py-2 bg-success-600 text-white rounded-lg hover:bg-success-700 transition-colors text-sm font-medium"
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
                      {[...Array(5)].map((_, i) => (
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
                      {[...Array(5)].map((_, i) => (
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
                    "The valet storage service is incredible. They picked up my
                    seasonal items and delivered them right when I needed them."
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
                      {[...Array(5)].map((_, i) => (
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
                    "As an insurance agent, MyAssetLocker makes my job so much
                    easier. Claims are processed 3x faster with their detailed
                    reports."
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
