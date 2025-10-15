import Hero from "@/components/Hero";
import AppShowcase from "@/components/AppShowcase";

export default function DigitalLockerInsuranceCompanies() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero
        backgroundImage="/household-storage-service.webp"
        headline="Digital Locker for Insurance Companies"
        ctaButton={{
          enabled: false,
          text: "GET STARTED",
          href: "/contact",
        }}
        isHomePage={false}
      />

      {/* Overview */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#4c4946] mb-4 sm:mb-6 px-4">
              Revolutionize Claims Processing
            </h2>
            <p className="text-lg sm:text-xl text-[#8e9293] max-w-3xl mx-auto leading-relaxed px-4">
              Our digital locker platform helps insurance companies process claims faster, 
              reduce fraudulent claims, and provide better customer service through comprehensive asset documentation.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-[#f7f7f7] to-[#fef7ed] relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#4c4946] mb-12 sm:mb-16 text-center px-4">
              Insurance-Focused Features
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
              {/* Feature 1 */}
              <div className="text-center group p-4 sm:p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#f8992f] to-[#e8911f] rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#4c4946] mb-4">
                  Fraud Detection
                </h3>
                <p className="text-[#8e9293] leading-relaxed">
                  Advanced algorithms analyze asset documentation to identify potential fraudulent claims and inconsistencies.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="text-center group p-4 sm:p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#f8992f] to-[#e8911f] rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#4c4946] mb-4">
                  Fast Claims Processing
                </h3>
                <p className="text-[#8e9293] leading-relaxed">
                  Reduce claims processing time by up to 80% with pre-verified asset documentation and automated workflows.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="text-center group p-4 sm:p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#f8992f] to-[#e8911f] rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#4c4946] mb-4">
                  Accurate Valuations
                </h3>
                <p className="text-[#8e9293] leading-relaxed">
                  Access real-time market data and professional appraisals for accurate asset valuations and settlements.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="text-center group p-4 sm:p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#f8992f] to-[#e8911f] rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#4c4946] mb-4">
                  Comprehensive Reports
                </h3>
                <p className="text-[#8e9293] leading-relaxed">
                  Generate detailed reports for adjusters, underwriters, and legal teams with complete asset documentation.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="text-center group p-4 sm:p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#f8992f] to-[#e8911f] rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#4c4946] mb-4">
                  Secure Data Management
                </h3>
                <p className="text-[#8e9293] leading-relaxed">
                  Bank-level security and compliance with industry regulations for sensitive customer data protection.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="text-center group p-4 sm:p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#f8992f] to-[#e8911f] rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#4c4946] mb-4">
                  Team Collaboration
                </h3>
                <p className="text-[#8e9293] leading-relaxed">
                  Enable seamless collaboration between adjusters, underwriters, and legal teams with shared access controls.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Insurance Types */}
      <section className="py-16 sm:py-20 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#4c4946] mb-12 sm:mb-16 text-center px-4">
              Insurance Coverage Types
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
              {/* Homeowners Insurance */}
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-[#f8992f] rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#4c4946] mb-4">Homeowners Insurance</h3>
                <p className="text-[#8e9293] mb-4">Comprehensive documentation for personal property, electronics, jewelry, and household items.</p>
                <ul className="space-y-2 text-sm text-[#8e9293]">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#f8992f] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Personal property inventory
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#f8992f] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    High-value item tracking
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#f8992f] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Replacement cost estimates
                  </li>
                </ul>
              </div>

              {/* Commercial Insurance */}
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-[#f8992f] rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#4c4946] mb-4">Commercial Insurance</h3>
                <p className="text-[#8e9293] mb-4">Business equipment, inventory, and property documentation for commercial policies.</p>
                <ul className="space-y-2 text-sm text-[#8e9293]">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#f8992f] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Business equipment tracking
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#f8992f] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Inventory management
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#f8992f] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Business interruption coverage
                  </li>
                </ul>
              </div>

              {/* Specialty Insurance */}
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-[#f8992f] rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#4c4946] mb-4">Specialty Insurance</h3>
                <p className="text-[#8e9293] mb-4">High-value collections, art, antiques, and specialty items requiring expert documentation.</p>
                <ul className="space-y-2 text-sm text-[#8e9293]">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#f8992f] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Art and collectibles
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#f8992f] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Professional appraisals
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#f8992f] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Authentication records
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-[#f7f7f7] to-[#fef7ed]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#4c4946] mb-12 sm:mb-16 text-center px-4">
              Insurance Company Benefits
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16">
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#f8992f] rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#4c4946] mb-2">Reduced Claims Costs</h3>
                    <p className="text-[#8e9293]">Lower claims costs by up to 40% through faster processing and reduced fraudulent claims.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#f8992f] rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#4c4946] mb-2">Improved Customer Satisfaction</h3>
                    <p className="text-[#8e9293]">Faster claims processing leads to higher customer satisfaction and retention rates.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#f8992f] rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#4c4946] mb-2">Enhanced Risk Assessment</h3>
                    <p className="text-[#8e9293]">Better underwriting decisions with comprehensive asset documentation and risk analysis.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#f8992f] rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#4c4946] mb-2">Operational Efficiency</h3>
                    <p className="text-[#8e9293]">Streamline claims workflows and reduce manual processing time by up to 80%.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#f8992f] rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#4c4946] mb-2">Regulatory Compliance</h3>
                    <p className="text-[#8e9293]">Maintain compliance with insurance regulations and audit requirements.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#f8992f] rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#4c4946] mb-2">Competitive Advantage</h3>
                    <p className="text-[#8e9293]">Differentiate your services with innovative digital asset management capabilities.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-r from-[#4c4946] via-[#3d3d3d] to-[#2a2a2a] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8">
              Transform Your Claims Processing
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed">
              Join leading insurance companies that have revolutionized their claims processing 
              and improved customer satisfaction with our digital locker platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#f8992f] to-[#e8911f] hover:from-[#e8911f] hover:to-[#c2751a] text-white font-bold text-lg uppercase tracking-wide rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 min-h-[56px]"
              >
                Request Demo
                <svg className="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a
                href="/pricing"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-[#4c4946] font-bold text-lg uppercase tracking-wide rounded-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 min-h-[56px]"
              >
                View Pricing
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* App Showcase */}
      <AppShowcase />
    </div>
  );
}
