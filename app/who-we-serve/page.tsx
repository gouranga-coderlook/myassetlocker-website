export default function WhoWeServe() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative gradient-hero py-20 lg:py-32 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full opacity-20 animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-200 rounded-full opacity-20 animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-100 rounded-full opacity-10 animate-pulse-slow"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow animate-fade-in-up">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-6 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <span className="text-gradient-primary">Who We Serve</span>
            </h1>
            <p className="text-base md:text-lg text-text-secondary mb-8 max-w-3xl mx-auto animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              Tailored solutions for every type of asset protection need
            </p>
          </div>
        </div>
      </section>

      {/* Home Owners */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                <span className="text-gradient-primary">Home Owners</span>
              </h2>
              <p className="text-base text-text-secondary max-w-2xl mx-auto">
                Protect your most valuable possessions with comprehensive digital and physical storage solutions
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div className="animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                <h3 className="text-xl md:text-2xl font-semibold text-text-primary mb-6">Why Home Owners Choose Us</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 gradient-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-glow">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-text-primary">Insurance Readiness</h4>
                      <p className="text-sm text-text-secondary">Complete digital inventory for faster claims processing</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 gradient-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-glow">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-text-primary">Space Optimization</h4>
                      <p className="text-sm text-text-secondary">Free up valuable home space with professional storage</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 gradient-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-glow">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-text-primary">Peace of Mind</h4>
                      <p className="text-sm text-text-secondary">Secure storage with 24/7 monitoring and insurance</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 gradient-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-glow">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-text-primary">Convenience</h4>
                      <p className="text-sm text-text-secondary">Easy pickup and delivery with flexible scheduling</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="card-modern p-8 hover-lift animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                <h4 className="text-lg font-semibold text-text-primary mb-4">Perfect For</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center shadow-glow">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <span className="text-base text-text-secondary">Jewelry and watches</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center shadow-glow">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-base text-text-secondary">Electronics and gadgets</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center shadow-glow">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-base text-text-secondary">Artwork and collectibles</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center shadow-glow">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <span className="text-base text-text-secondary">Important documents</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Home Owner Testimonial */}
            <div className="card-modern p-8 hover-lift">
              <div className="text-center">
                <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <blockquote className="text-base text-text-secondary mb-4 italic">
                  &ldquo;MyAssetLocker gave me peace of mind during our home renovation. Knowing our valuables were safely stored and digitally documented made the whole process stress-free.&rdquo;
                </blockquote>
                <div className="text-lg font-semibold text-text-primary">Sarah M.</div>
                <div className="text-sm text-text-secondary">Home Owner, San Francisco</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Businesses */}
      <section className="py-20 bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-950 dark:to-secondary-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <div className="w-20 h-20 gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow-secondary">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                <span className="text-gradient-secondary">Businesses</span>
              </h2>
              <p className="text-base text-text-secondary max-w-2xl mx-auto">
                Enterprise-grade asset management with multi-user access and compliance features
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div className="animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                <h3 className="text-xl md:text-2xl font-semibold text-text-primary mb-6">Business Benefits</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 gradient-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-glow-secondary">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-text-primary">Compliance & Auditing</h4>
                      <p className="text-sm text-text-secondary">Generate reports for insurance, audits, and regulatory compliance</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 gradient-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-glow-secondary">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-text-primary">Team Collaboration</h4>
                      <p className="text-sm text-text-secondary">Multi-user access with role-based permissions and workflows</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 gradient-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-glow-secondary">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-text-primary">Cost Reduction</h4>
                      <p className="text-sm text-text-secondary">Reduce insurance premiums and improve claim processing efficiency</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 gradient-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-glow-secondary">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-text-primary">Asset Tracking</h4>
                      <p className="text-sm text-text-secondary">Comprehensive tracking of equipment lifecycle and depreciation</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="card-modern p-8 hover-lift animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                <h4 className="text-lg font-semibold text-text-primary mb-4">Ideal For</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 gradient-secondary rounded-lg flex items-center justify-center shadow-glow-secondary">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <span className="text-base text-text-secondary">Office equipment</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 gradient-secondary rounded-lg flex items-center justify-center shadow-glow-secondary">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                      </svg>
                    </div>
                    <span className="text-base text-text-secondary">IT equipment</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 gradient-secondary rounded-lg flex items-center justify-center shadow-glow-secondary">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-base text-text-secondary">Artwork and decor</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 gradient-secondary rounded-lg flex items-center justify-center shadow-glow-secondary">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <span className="text-base text-text-secondary">Important documents</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Testimonial */}
            <div className="card-modern p-8 hover-lift">
              <div className="text-center">
                <div className="w-16 h-16 gradient-secondary rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow-secondary">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <blockquote className="text-base text-text-secondary mb-4 italic">
                  &ldquo;The compliance reporting features saved us hours during our annual audit. Having everything digitally documented and easily accessible was a game-changer.&rdquo;
                </blockquote>
                <div className="text-lg font-semibold text-text-primary">Michael R.</div>
                <div className="text-sm text-text-secondary">CFO, Tech Startup</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Insurance Companies */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <div className="w-20 h-20 gradient-success rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                <span className="text-gradient-success">Insurance Companies</span>
              </h2>
              <p className="text-base text-text-secondary max-w-2xl mx-auto">
                Streamline claims processing with comprehensive digital documentation and verification
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div className="animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                <h3 className="text-xl md:text-2xl font-semibold text-text-primary mb-6">Insurance Benefits</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 gradient-success rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-glow">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-text-primary">Faster Claims Processing</h4>
                      <p className="text-sm text-text-secondary">Detailed documentation reduces investigation time by 60%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 gradient-success rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-glow">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-text-primary">Fraud Prevention</h4>
                      <p className="text-sm text-text-secondary">Verified documentation with timestamps and metadata</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 gradient-success rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-glow">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-text-primary">Risk Assessment</h4>
                      <p className="text-sm text-text-secondary">Better underwriting with comprehensive asset visibility</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 gradient-success rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-glow">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-text-primary">Customer Satisfaction</h4>
                      <p className="text-sm text-text-secondary">Faster settlements improve customer experience and retention</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="card-modern p-8 hover-lift animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                <h4 className="text-lg font-semibold text-text-primary mb-4">Partnership Benefits</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 gradient-success rounded-lg flex items-center justify-center shadow-glow">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <span className="text-base text-text-secondary">API integration</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 gradient-success rounded-lg flex items-center justify-center shadow-glow">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-base text-text-secondary">White-label solutions</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 gradient-success rounded-lg flex items-center justify-center shadow-glow">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <span className="text-base text-text-secondary">Priority support</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 gradient-success rounded-lg flex items-center justify-center shadow-glow">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <span className="text-base text-text-secondary">Custom reporting</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Insurance Testimonial */}
            <div className="card-modern p-8 hover-lift">
              <div className="text-center">
                <div className="w-16 h-16 gradient-success rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <blockquote className="text-base text-text-secondary mb-4 italic">
                  &ldquo;Partnering with MyAssetLocker has revolutionized our claims process. The detailed documentation and verification features have reduced our investigation time significantly.&rdquo;
                </blockquote>
                <div className="text-lg font-semibold text-text-primary">Jennifer L.</div>
                <div className="text-sm text-text-secondary">Claims Manager, Regional Insurance</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-fade-in-up">
            Ready to Get Started?
          </h2>
          <p className="text-base text-white/90 mb-8 max-w-2xl mx-auto animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            Join thousands of satisfied customers who trust MyAssetLocker with their valuable assets
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <a
              href="https://apps.apple.com/app/myassetlocker"
              className="btn-modern hover-lift hover-glow inline-flex items-center justify-center px-6 py-3"
              aria-label="Download on the App Store"
              data-track-cta="who-we-serve-app-store"
            >
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="text-lg font-semibold">App Store</div>
                </div>
              </div>
            </a>
            
            <a
              href="https://play.google.com/store/apps/details?id=com.myassetlocker.app"
              className="btn-secondary hover-lift hover-glow inline-flex items-center justify-center px-6 py-3"
              aria-label="Get it on Google Play"
              data-track-cta="who-we-serve-google-play"
            >
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.609 1.814L13.792 12 3.609 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L12.5 12l5.199-3.491zM5.864 2.658L16.802 8.99l-2.302 2.302-8.636-8.634z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs">GET IT ON</div>
                  <div className="text-lg font-semibold">Google Play</div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
