import AppShowcase from "@/components/AppShowcase";
import Hero from "@/components/Hero";

export default function DigitalLocker() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero
        backgroundImage="/products-1.png"
        headline="MyAsset Locker is there when you need it  most."
        ctaButton={{
          enabled: false,
        }}
      />

      {/* How MyAsset Locker Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              How MyAsset Locker Works
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Most people will remember their big ticket and higher value items like televisions, computers, major appliances, fine art, and jewelry. However the small items are often forgotten. If you do not have proof of the item, insurance companies often times will not consider compensating you for the loss.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
            <a
              href="/who-we-serve"
              className="w-full sm:w-auto bg-gradient-to-r from-[#ea9637] to-[#FB9A2D] text-white font-semibold py-3 px-8 rounded-lg hover:from-[#FB9A2D] hover:to-[#ea9637] transition-all duration-300 shadow-lg hover:shadow-xl text-center uppercase tracking-wide"
            >
              Homeowners
            </a>
            <a
              href="/who-we-serve"
              className="w-full sm:w-auto bg-gradient-to-r from-[#ea9637] to-[#FB9A2D] text-white font-semibold py-3 px-8 rounded-lg hover:from-[#FB9A2D] hover:to-[#ea9637] transition-all duration-300 shadow-lg hover:shadow-xl text-center uppercase tracking-wide"
            >
              Business
            </a>
            <a
              href="/who-we-serve"
              className="w-full sm:w-auto bg-gradient-to-r from-[#ea9637] to-[#FB9A2D] text-white font-semibold py-3 px-8 rounded-lg hover:from-[#FB9A2D] hover:to-[#ea9637] transition-all duration-300 shadow-lg hover:shadow-xl text-center uppercase tracking-wide"
            >
              Insurance Companies
            </a>
          </div>
        </div>
      </section>
      {/* Why It Matters */}
      <section className="">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Why Digital Inventory{" "}
                <span className="text-gradient-primary">Matters</span>
              </h2>
              <p className="text-base text-text-secondary max-w-2xl mx-auto">
                Protect your assets and streamline insurance claims with
                comprehensive digital documentation
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
              <div
                className="animate-fade-in-up"
                style={{ animationDelay: "0.1s" }}
              >
                <h3 className="text-xl md:text-2xl font-semibold text-text-primary mb-4">
                  Insurance Readiness
                </h3>
                <p className="text-base text-text-secondary mb-6">
                  When disaster strikes, having a complete digital inventory can
                  mean the difference between a quick claim settlement and
                  months of frustration. Our digital locker ensures you have
                  everything documented and ready to submit.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 gradient-success rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-glow">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-base text-text-secondary">
                      Faster claim processing with detailed documentation
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 gradient-success rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-glow">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-base text-text-secondary">
                      Higher settlement amounts with proof of value
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 gradient-success rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-glow">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-base text-text-secondary">
                      Reduced stress during difficult times
                    </span>
                  </li>
                </ul>
              </div>

              <div
                className="card-modern p-8 hover-lift animate-fade-in-up"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 gradient-success rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
                    <svg
                      className="w-8 h-8 text-white"
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
                  <h4 className="text-lg font-semibold text-text-primary mb-2">
                    Peace of Mind
                  </h4>
                </div>
                <p className="text-base text-text-secondary text-center">
                  Know that your valuable assets are documented, organized, and
                  ready for any situation. Sleep better knowing you&apos;re prepared.
                </p>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div
                className="text-center card-modern p-6 hover-lift animate-fade-in-up"
                style={{ animationDelay: "0.3s" }}
              >
                <div className="text-4xl font-bold text-gradient-primary mb-2">
                  3x
                </div>
                <p className="text-base text-text-secondary">
                  Faster claim processing with digital inventory
                </p>
              </div>
              <div
                className="text-center card-modern p-6 hover-lift animate-fade-in-up"
                style={{ animationDelay: "0.4s" }}
              >
                <div className="text-4xl font-bold text-gradient-primary mb-2">
                  40%
                </div>
                <p className="text-base text-text-secondary">
                  Higher settlement amounts with proper documentation
                </p>
              </div>
              <div
                className="text-center card-modern p-6 hover-lift animate-fade-in-up"
                style={{ animationDelay: "0.5s" }}
              >
                <div className="text-4xl font-bold text-gradient-primary mb-2">
                  95%
                </div>
                <p className="text-base text-text-secondary">
                  Of users feel more secure with digital inventory
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-950 dark:to-primary-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Digital Locker{" "}
                <span className="text-gradient-primary">Features</span>
              </h2>
              <p className="text-base text-text-secondary max-w-2xl mx-auto">
                Everything you need to create and maintain a comprehensive
                digital inventory
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div
                className="card-modern p-6 hover-lift animate-fade-in-up"
                style={{ animationDelay: "0.1s" }}
              >
                <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-4 shadow-glow">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  High-Resolution Photos
                </h3>
                <p className="text-base text-text-secondary">
                  Capture detailed images with automatic metadata including
                  date, location, and device info
                </p>
              </div>

              <div
                className="card-modern p-6 hover-lift animate-fade-in-up"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-4 shadow-glow">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Receipt Storage
                </h3>
                <p className="text-base text-text-secondary">
                  Upload and organize purchase receipts, warranties, and
                  appraisals with OCR text recognition
                </p>
              </div>

              <div
                className="card-modern p-6 hover-lift animate-fade-in-up"
                style={{ animationDelay: "0.3s" }}
              >
                <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-4 shadow-glow">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Smart Categories
                </h3>
                <p className="text-base text-text-secondary">
                  Auto-categorize items by type, room, or value with AI-powered
                  suggestions
                </p>
              </div>

              <div
                className="card-modern p-6 hover-lift animate-fade-in-up"
                style={{ animationDelay: "0.4s" }}
              >
                <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-4 shadow-glow">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Insurance Reports
                </h3>
                <p className="text-base text-text-secondary">
                  Generate comprehensive reports formatted for insurance claims
                  with itemized lists and values
                </p>
              </div>

              <div
                className="card-modern p-6 hover-lift animate-fade-in-up"
                style={{ animationDelay: "0.5s" }}
              >
                <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-4 shadow-glow">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Advanced Search
                </h3>
                <p className="text-base text-text-secondary">
                  Find any item instantly with powerful search across photos,
                  descriptions, and metadata
                </p>
              </div>

              <div
                className="card-modern p-6 hover-lift animate-fade-in-up"
                style={{ animationDelay: "0.6s" }}
              >
                <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-4 shadow-glow">
                  <svg
                    className="w-6 h-6 text-white"
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
                  Secure Storage
                </h3>
                <p className="text-base text-text-secondary">
                  Bank-level encryption keeps your sensitive information safe
                  and private
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Businesses */}
      <section className="bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-950 dark:to-secondary-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                For <span className="text-gradient-secondary">Businesses</span>
              </h2>
              <p className="text-base text-text-secondary max-w-2xl mx-auto">
                Enterprise-grade digital asset management with multi-user access
                and compliance features
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div
                className="animate-fade-in-up"
                style={{ animationDelay: "0.1s" }}
              >
                <h3 className="text-xl md:text-2xl font-semibold text-text-primary mb-6">
                  Enterprise Features
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 gradient-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-glow">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-text-primary">
                        Multi-User Access
                      </h4>
                      <p className="text-sm text-text-secondary">
                        Role-based permissions for team members and departments
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 gradient-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-glow">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-text-primary">
                        Compliance Reporting
                      </h4>
                      <p className="text-sm text-text-secondary">
                        Generate reports for audits, insurance, and regulatory
                        compliance
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 gradient-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-glow">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-text-primary">
                        Equipment Tracking
                      </h4>
                      <p className="text-sm text-text-secondary">
                        Track equipment lifecycle, maintenance, and depreciation
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 gradient-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-glow">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-text-primary">
                        API Integration
                      </h4>
                      <p className="text-sm text-text-secondary">
                        Connect with existing business systems and workflows
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="card-modern p-8 hover-lift animate-fade-in-up"
                style={{ animationDelay: "0.2s" }}
              >
                <h4 className="text-lg font-semibold text-text-primary mb-4">
                  Business Benefits
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 gradient-success rounded-lg flex items-center justify-center shadow-glow">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                    </div>
                    <span className="text-base text-text-secondary">
                      Reduced insurance premiums
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 gradient-success rounded-lg flex items-center justify-center shadow-glow">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <span className="text-base text-text-secondary">
                      Faster claim processing
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 gradient-success rounded-lg flex items-center justify-center shadow-glow">
                      <svg
                        className="w-4 h-4 text-white"
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
                    <span className="text-base text-text-secondary">
                      Improved compliance
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 gradient-success rounded-lg flex items-center justify-center shadow-glow">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                    <span className="text-base text-text-secondary">
                      Better asset visibility
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <AppShowcase />
    </div>
  );
}
