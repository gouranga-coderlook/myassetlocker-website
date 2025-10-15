import React from 'react'

const Footer = () => {
  return (
        <footer className="bg-gradient-to-r from-[#4c4946] via-[#3d3d3d] to-[#2a2a2a] text-white pb-20 md:pb-0 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>
              </div>
              
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
                  {/* Brand */}
                  <div className="col-span-1 sm:col-span-2 lg:col-span-2">
                    <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-[#f8992f] to-[#e8911f] bg-clip-text text-transparent">
                      MyAssetLocker
                    </h3>
                    <p className="text-[#8e9293] mb-6 sm:mb-8 max-w-md text-base sm:text-lg leading-relaxed">
                      Secure, manage, and organize your digital assets with
                      enterprise-grade security and intuitive design.
                    </p>
                  </div>

                  {/* Quick Links */}
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6">
                      Product
                    </h4>
                    <ul className="space-y-3 sm:space-y-4">
                      <li>
                        <a
                          href="/how-it-works"
                          className="text-[#8e9293] hover:text-[#f8992f] transition-colors duration-300 text-sm sm:text-base"
                        >
                          How It Works
                        </a>
                      </li>
                      <li>
                        <a
                          href="/digital-locker"
                          className="text-[#8e9293] hover:text-[#f8992f] transition-colors duration-300 text-sm sm:text-base"
                        >
                          Digital Locker
                        </a>
                      </li>
                      <li>
                        <a
                          href="/valet-storage"
                          className="text-[#8e9293] hover:text-[#f8992f] transition-colors duration-300 text-sm sm:text-base"
                        >
                          Valet Storage
                        </a>
                      </li>
                      <li>
                        <a
                          href="/pricing"
                          className="text-[#8e9293] hover:text-[#f8992f] transition-colors duration-300 text-sm sm:text-base"
                        >
                          Pricing
                        </a>
                      </li>
                    </ul>
                  </div>

                  {/* Support */}
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6">
                      Support
                    </h4>
                    <ul className="space-y-3 sm:space-y-4">
                      <li>
                        <a
                          href="#help"
                          className="text-[#8e9293] hover:text-[#f8992f] transition-colors duration-300 text-sm sm:text-base"
                        >
                          Help Center
                        </a>
                      </li>
                      <li>
                        <a
                          href="#docs"
                          className="text-[#8e9293] hover:text-[#f8992f] transition-colors duration-300 text-sm sm:text-base"
                        >
                          Documentation
                        </a>
                      </li>
                      <li>
                        <a
                          href="#contact"
                          className="text-[#8e9293] hover:text-[#f8992f] transition-colors duration-300 text-sm sm:text-base"
                        >
                          Contact Us
                        </a>
                      </li>
                      <li>
                        <a
                          href="#status"
                          className="text-[#8e9293] hover:text-[#f8992f] transition-colors duration-300 text-sm sm:text-base"
                        >
                          Status
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-[#8e9293]/30">
                  <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                    <p className="text-[#8e9293] text-sm sm:text-base text-center sm:text-left">
                      © 2024 MyAssetLocker, LLC. All rights reserved.
                    </p>
                    <div className="flex space-x-6 sm:space-x-8">
                      <a
                        href="#privacy"
                        className="text-[#8e9293] hover:text-[#f8992f] transition-colors duration-300 text-sm sm:text-base"
                      >
                        Privacy Policy
                      </a>
                      <a
                        href="#terms"
                        className="text-[#8e9293] hover:text-[#f8992f] transition-colors duration-300 text-sm sm:text-base"
                      >
                        Terms of Service
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </footer>
  )
}

export default Footer