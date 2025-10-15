import Hero from "@/components/Hero";
import AppShowcase from "@/components/AppShowcase";

export default function DigitalLockerBusinesses() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero
        backgroundImage="/household-storage-service.webp"
        headline="Digital Locker for Businesses"
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
              Enterprise Asset Management
            </h2>
            <p className="text-lg sm:text-xl text-[#8e9293] max-w-3xl mx-auto leading-relaxed px-4">
              Our digital locker platform helps businesses maintain accurate
              asset records, ensure compliance with regulations, and optimize
              operational efficiency across all departments.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-[#f7f7f7] to-[#fef7ed] relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#4c4946] mb-12 sm:mb-16 text-center px-4">
              Business-Focused Features
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
              {/* Feature 1 */}
              <div className="text-center group p-4 sm:p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#f8992f] to-[#e8911f] rounded-2xl flex items-center justify-center">
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
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#4c4946] mb-4">
                  Asset Tracking
                </h3>
                <p className="text-[#8e9293] leading-relaxed">
                  Track equipment, inventory, and fixed assets with detailed
                  serial numbers, locations, and maintenance schedules.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="text-center group p-4 sm:p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#f8992f] to-[#e8911f] rounded-2xl flex items-center justify-center">
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
                <h3 className="text-xl sm:text-2xl font-bold text-[#4c4946] mb-4">
                  Compliance Management
                </h3>
                <p className="text-[#8e9293] leading-relaxed">
                  Maintain regulatory compliance with automated audit trails,
                  documentation requirements, and reporting features.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="text-center group p-4 sm:p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#f8992f] to-[#e8911f] rounded-2xl flex items-center justify-center">
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#4c4946] mb-4">
                  Team Collaboration
                </h3>
                <p className="text-[#8e9293] leading-relaxed">
                  Enable multiple team members to access and update asset
                  information with role-based permissions.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="text-center group p-4 sm:p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#f8992f] to-[#e8911f] rounded-2xl flex items-center justify-center">
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
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#4c4946] mb-4">
                  Financial Reporting
                </h3>
                <p className="text-[#8e9293] leading-relaxed">
                  Generate detailed financial reports for accounting, tax
                  purposes, and asset depreciation tracking.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="text-center group p-4 sm:p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#f8992f] to-[#e8911f] rounded-2xl flex items-center justify-center">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#4c4946] mb-4">
                  Maintenance Scheduling
                </h3>
                <p className="text-[#8e9293] leading-relaxed">
                  Schedule and track maintenance activities with automated
                  reminders and service history records.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="text-center group p-4 sm:p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#f8992f] to-[#e8911f] rounded-2xl flex items-center justify-center">
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#4c4946] mb-4">
                  Integration Ready
                </h3>
                <p className="text-[#8e9293] leading-relaxed">
                  Seamlessly integrate with existing ERP, CRM, and accounting
                  systems through our API.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Solutions */}
      <section className="py-16 sm:py-20 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#4c4946] mb-12 sm:mb-16 text-center px-4">
              Industry-Specific Solutions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
              {/* Manufacturing */}
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-[#f8992f] rounded-xl flex items-center justify-center mb-6">
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
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#4c4946] mb-4">
                  Manufacturing
                </h3>
                <p className="text-[#8e9293] mb-4">
                  Track production equipment, tools, and inventory with
                  maintenance schedules and compliance requirements.
                </p>
                <ul className="space-y-2 text-sm text-[#8e9293]">
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 text-[#f8992f] mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Equipment lifecycle management
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 text-[#f8992f] mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Safety compliance tracking
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 text-[#f8992f] mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Quality control documentation
                  </li>
                </ul>
              </div>

              {/* Retail */}
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-[#f8992f] rounded-xl flex items-center justify-center mb-6">
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
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#4c4946] mb-4">
                  Retail
                </h3>
                <p className="text-[#8e9293] mb-4">
                  Manage store fixtures, POS systems, and inventory with
                  real-time tracking and loss prevention.
                </p>
                <ul className="space-y-2 text-sm text-[#8e9293]">
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 text-[#f8992f] mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Multi-location inventory
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 text-[#f8992f] mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Asset depreciation tracking
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 text-[#f8992f] mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Store equipment maintenance
                  </li>
                </ul>
              </div>

              {/* Healthcare */}
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-[#f8992f] rounded-xl flex items-center justify-center mb-6">
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
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#4c4946] mb-4">
                  Healthcare
                </h3>
                <p className="text-[#8e9293] mb-4">
                  Track medical equipment, devices, and supplies with compliance
                  and calibration requirements.
                </p>
                <ul className="space-y-2 text-sm text-[#8e9293]">
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 text-[#f8992f] mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Medical device tracking
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 text-[#f8992f] mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Regulatory compliance
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 text-[#f8992f] mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Calibration scheduling
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
              Business Benefits
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16">
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#f8992f] rounded-full flex items-center justify-center">
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#4c4946] mb-2">
                      Cost Reduction
                    </h3>
                    <p className="text-[#8e9293]">
                      Reduce operational costs by up to 30% through better asset
                      utilization and maintenance scheduling.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#f8992f] rounded-full flex items-center justify-center">
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#4c4946] mb-2">
                      Improved Compliance
                    </h3>
                    <p className="text-[#8e9293]">
                      Maintain regulatory compliance with automated
                      documentation and audit trail features.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#f8992f] rounded-full flex items-center justify-center">
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#4c4946] mb-2">
                      Enhanced Productivity
                    </h3>
                    <p className="text-[#8e9293]">
                      Streamline asset management processes and reduce time
                      spent on manual inventory tasks.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#f8992f] rounded-full flex items-center justify-center">
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#4c4946] mb-2">
                      Better Decision Making
                    </h3>
                    <p className="text-[#8e9293]">
                      Access real-time data and analytics to make informed
                      decisions about asset investments.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#f8992f] rounded-full flex items-center justify-center">
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#4c4946] mb-2">
                      Risk Mitigation
                    </h3>
                    <p className="text-[#8e9293]">
                      Reduce business risks through proper asset documentation
                      and insurance claim support.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#f8992f] rounded-full flex items-center justify-center">
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#4c4946] mb-2">
                      Scalable Solution
                    </h3>
                    <p className="text-[#8e9293]">
                      Grow with your business - our platform scales from small
                      businesses to large enterprises.
                    </p>
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
              Transform Your Business Asset Management
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed">
              Join hundreds of businesses that have improved their asset
              management efficiency and reduced operational costs with our
              digital locker platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#f8992f] to-[#e8911f] hover:from-[#e8911f] hover:to-[#c2751a] text-white font-bold text-lg uppercase tracking-wide rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 min-h-[56px]"
              >
                Schedule Demo
                <svg
                  className="ml-3 w-5 h-5"
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
