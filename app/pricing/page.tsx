import Hero from "@/components/Hero";

export default function Pricing() {

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero
        backgroundImage="/household-storage-service.webp"
        headline="Valet Storage Pricing"
        bodyText={`Professional pickup, secure storage, and delivery service for your valuable items. Transparent pricing with no hidden fees.`}
        ctaButton={{
          enabled: false,
        }}
        appStoreButtons={true}
      />

      {/* Storage Pricing */}
      <section className="py-16 sm:py-20 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#4c4946] mb-4 sm:mb-6 px-4">
                Storage Pricing
              </h2>
              <p className="text-lg sm:text-xl text-[#8e9293] max-w-3xl mx-auto leading-relaxed px-4">
                Transparent monthly pricing with no hidden fees
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-[#4c4946] mb-4">Standard Storage</h3>
                  <ul className="space-y-3 text-[#8e9293]">
                    <li className="flex justify-between items-center">
                      <span>Per-bin (27–32 gal, ≤40 lb)</span>
                      <span className="font-bold text-[#f8992f]">$7.50/mo</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Climate-controlled add-on</span>
                      <span className="font-bold text-[#f8992f]">+20%</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#4c4946] mb-4">Bulky Items</h3>
                  <ul className="space-y-3 text-[#8e9293]">
                    <li className="flex justify-between items-center">
                      <span>Skis/Board</span>
                      <span className="font-bold text-[#f8992f]">$6/mo</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Bicycle</span>
                      <span className="font-bold text-[#f8992f]">$12/mo</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>E-bike</span>
                      <span className="font-bold text-[#f8992f]">$15/mo</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Luggage</span>
                      <span className="font-bold text-[#f8992f]">$6–$8/mo</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Seasonal tire set (4)</span>
                      <span className="font-bold text-[#f8992f]">$18/mo</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-[#e8e8e8]">
                <h3 className="text-xl font-bold text-[#4c4946] mb-4">Commitment Discounts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between items-center p-4 bg-[#fef7ed] rounded-xl">
                    <span className="text-[#8e9293]">6-month commitment</span>
                    <span className="font-bold text-[#f8992f]">–10%</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-[#fef7ed] rounded-xl">
                    <span className="text-[#8e9293]">12-month prepaid</span>
                    <span className="font-bold text-[#f8992f]">–15%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bundles */}
      <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-[#f7f7f7] to-[#fef7ed]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#4c4946] mb-4 sm:mb-6 px-4">
                Student & Seasonal Bundles
              </h2>
              <p className="text-lg sm:text-xl text-[#8e9293] max-w-3xl mx-auto leading-relaxed px-4">
                Prepaid packages designed for students and seasonal storage needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#4c4946]">Summer Student</h3>
                  <span className="text-2xl font-bold text-[#f8992f]">$229</span>
                </div>
                <p className="text-[#8e9293] mb-4">May–August prepaid package</p>
                <ul className="space-y-3 text-[#8e9293]">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#f8992f] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Pickup + one return (group windows)
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#f8992f] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    5 bins + 1 bulky (bike or skis)
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#f8992f] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Extras: $25/bin, $49/bulky for term
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#4c4946]">Ski Season Stash</h3>
                  <span className="text-2xl font-bold text-[#f8992f]">$149</span>
                </div>
                <p className="text-[#8e9293] mb-4">November–April prepaid package</p>
                <ul className="space-y-3 text-[#8e9293]">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#f8992f] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Pickup + one spring return
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#f8992f] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    2 bins + 1 bulky (skis/board)
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#f8992f] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Add seasonal tire storage: +$99 for term
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Delivery Pricing */}
      <section className="py-16 sm:py-20 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#4c4946] mb-4 sm:mb-6 px-4">
                Pickup & Delivery Pricing
              </h2>
              <p className="text-lg sm:text-xl text-[#8e9293] max-w-3xl mx-auto leading-relaxed px-4">
                Flexible delivery options based on your location and timing needs
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                <h3 className="text-xl font-bold text-[#4c4946] mb-6">Service Zones</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-[#fef7ed] rounded-xl">
                    <div>
                      <div className="font-semibold text-[#4c4946]">Zone A</div>
                      <div className="text-sm text-[#8e9293]">0–7 miles</div>
                    </div>
                    <span className="text-2xl font-bold text-[#f8992f]">$39</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-[#fef7ed] rounded-xl">
                    <div>
                      <div className="font-semibold text-[#4c4946]">Zone B</div>
                      <div className="text-sm text-[#8e9293]">7.1–15 miles</div>
                    </div>
                    <span className="text-2xl font-bold text-[#f8992f]">$59</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-[#fef7ed] rounded-xl">
                    <div>
                      <div className="font-semibold text-[#4c4946]">Zone C</div>
                      <div className="text-sm text-[#8e9293]">15.1–25 miles</div>
                    </div>
                    <span className="text-2xl font-bold text-[#f8992f]">$89</span>
                  </div>
                </div>
                <p className="text-sm text-[#8e9293] mt-4">Beyond 25 miles: custom quote</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                <h3 className="text-xl font-bold text-[#4c4946] mb-6">Timing Options</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-[#4c4946] mb-3">Delivery Windows</h4>
                    <ul className="space-y-2 text-[#8e9293]">
                      <li className="flex justify-between">
                        <span>Exact 1-hour window</span>
                        <span className="font-bold text-[#f8992f]">+$20</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Same-day delivery</span>
                        <span className="font-bold text-[#f8992f]">+$35</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Flexible window discount</span>
                        <span className="font-bold text-[#f8992f]">–$10</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-[#4c4946] mb-3">Additional Services</h4>
                    <ul className="space-y-2 text-[#8e9293]">
                      <li className="flex justify-between">
                        <span>On-site handling (20+ min)</span>
                        <span className="font-bold text-[#f8992f]">$1/min</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Stairs 3+ floors</span>
                        <span className="font-bold text-[#f8992f]">+$15</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Partial return pull</span>
                        <span className="font-bold text-[#f8992f]">$5/item</span>
                      </li>
                      <li className="flex justify-between">
                        <span>No-show/late cancel</span>
                        <span className="font-bold text-[#f8992f]">$25</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Plans */}
      <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-[#f7f7f7] to-[#fef7ed]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#4c4946] mb-4 sm:mb-6 px-4">
                Service Plans
              </h2>
              <p className="text-lg sm:text-xl text-[#8e9293] max-w-3xl mx-auto leading-relaxed px-4">
                Choose the plan that best fits your storage needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#4c4946]">Starter</h3>
                  <span className="text-2xl font-bold text-[#f8992f]">$24/mo</span>
                </div>
                <p className="text-[#8e9293] mb-4">Apartment Closet</p>
                <ul className="space-y-3 text-[#8e9293]">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#f8992f] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Up to 4 bins (then $7.50/bin)
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#f8992f] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Zone A pickup –$39 with 4+ bins
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#f8992f] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    1 free partial pull/mo
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ring-2 ring-[#f8992f]">
                <div className="text-center mb-4">
                  <span className="bg-[#f8992f] text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#4c4946]">Gear Plus</h3>
                  <span className="text-2xl font-bold text-[#f8992f]">$39/mo</span>
                </div>
                <p className="text-[#8e9293] mb-4">Homeowner</p>
                <ul className="space-y-3 text-[#8e9293]">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#f8992f] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    4 bins + 1 bulky included
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#f8992f] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    –$10 on every delivery
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#f8992f] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    +20% off tire storage
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#4c4946]">Student Summer</h3>
                  <span className="text-2xl font-bold text-[#f8992f]">$229</span>
                </div>
                <p className="text-[#8e9293] mb-4">Prepaid</p>
                <ul className="space-y-3 text-[#8e9293]">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#f8992f] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Pickup + one return
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#f8992f] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    5 bins + 1 bulky included
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#f8992f] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Extras billed per term
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-16 sm:py-20 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#4c4946] mb-4 sm:mb-6 px-4">
                Optional Add-ons
              </h2>
              <p className="text-lg sm:text-xl text-[#8e9293] max-w-3xl mx-auto leading-relaxed px-4">
                Enhance your storage experience with these optional services
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#f8992f] to-[#e8911f] rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#4c4946] mb-4">Photo Inventory</h3>
                  <p className="text-[#8e9293] mb-4">Professional photo documentation with barcodes</p>
                  <div className="text-2xl font-bold text-[#f8992f]">$1/item</div>
                  <p className="text-sm text-[#8e9293] mt-2">One-time fee</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#f8992f] to-[#e8911f] rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#4c4946] mb-4">Protection Plans</h3>
                  <p className="text-[#8e9293] mb-4">Enhanced insurance coverage for your items</p>
                  <div className="space-y-2">
                    <div className="text-lg font-bold text-[#f8992f]">$3/mo</div>
                    <p className="text-sm text-[#8e9293]">$500 limit</p>
                    <div className="text-lg font-bold text-[#f8992f]">$6/mo</div>
                    <p className="text-sm text-[#8e9293]">$1,500 limit</p>
                  </div>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#f8992f] to-[#e8911f] rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#4c4946] mb-4">Packing Materials</h3>
                  <p className="text-[#8e9293] mb-4">Professional packing supplies and containers</p>
                  <div className="space-y-2 text-sm text-[#8e9293]">
                    <div className="flex justify-between">
                      <span>Tote rental</span>
                      <span className="font-bold text-[#f8992f]">$2/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tote purchase</span>
                      <span className="font-bold text-[#f8992f]">$25</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Wardrobe box</span>
                      <span className="font-bold text-[#f8992f]">$12 + $8/mo</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-[#f7f7f7] to-[#fef7ed]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#4c4946] mb-4 sm:mb-6 px-4">
                Service Area Zones
              </h2>
              <p className="text-lg sm:text-xl text-[#8e9293] max-w-3xl mx-auto leading-relaxed px-4">
                We serve the greater Colorado Springs area with transparent zone-based pricing
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-[#4c4946]">Zone A</h3>
                  <span className="text-sm text-[#8e9293]">0–7 miles</span>
                </div>
                <p className="text-[#8e9293] mb-4">Downtown/Colorado College, Old North End, UCCS, Old Colorado City, Ivywild, Broadmoor, central Powers corridor.</p>
                <div className="text-2xl font-bold text-[#f8992f]">$39</div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-[#4c4946]">Zone B</h3>
                  <span className="text-sm text-[#8e9293]">7.1–15 miles</span>
                </div>
                <p className="text-[#8e9293] mb-4">Briargate, Rockrimmon, Cimarron Hills, Peterson area, Northgate.</p>
                <div className="text-2xl font-bold text-[#f8992f]">$59</div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-[#4c4946]">Zone C</h3>
                  <span className="text-sm text-[#8e9293]">15.1–25 miles</span>
                </div>
                <p className="text-[#8e9293] mb-4">Monument/Palmer Lake, Falcon/Peyton, Fountain/Security-Widefield, Manitou Springs, Woodland Park.</p>
                <div className="text-2xl font-bold text-[#f8992f]">$89</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-r from-[#f8992f] via-[#e8911f] to-[#c2751a] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8">
              Ready to Get Started?
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed">
              Contact us today to schedule your pickup and experience the convenience of valet storage
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#f8992f] to-[#e8911f] hover:from-[#e8911f] hover:to-[#c2751a] text-white font-bold text-lg uppercase tracking-wide rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 min-h-[56px]"
              >
                Get Started Today
                <svg className="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a
                href="/valet-storage"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-[#4c4946] font-bold text-lg uppercase tracking-wide rounded-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 min-h-[56px]"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
