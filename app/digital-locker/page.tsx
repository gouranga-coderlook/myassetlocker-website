export default function DigitalLocker() {
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-6 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <span className="text-gradient-primary">Digital Locker</span>
            </h1>
            <p className="text-base md:text-lg text-text-secondary mb-8 max-w-3xl mx-auto animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              Secure digital inventory management for insurance readiness and peace of mind
            </p>
          </div>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Why Digital Inventory <span className="text-gradient-primary">Matters</span>
              </h2>
              <p className="text-base text-text-secondary max-w-2xl mx-auto">
                Protect your assets and streamline insurance claims with comprehensive digital documentation
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
              <div className="animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                <h3 className="text-xl md:text-2xl font-semibold text-text-primary mb-4">Insurance Readiness</h3>
                <p className="text-base text-text-secondary mb-6">
                  When disaster strikes, having a complete digital inventory can mean the difference between 
                  a quick claim settlement and months of frustration. Our digital locker ensures you have 
                  everything documented and ready to submit.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 gradient-success rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-glow">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-base text-text-secondary">Faster claim processing with detailed documentation</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 gradient-success rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-glow">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-base text-text-secondary">Higher settlement amounts with proof of value</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 gradient-success rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-glow">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-base text-text-secondary">Reduced stress during difficult times</span>
                  </li>
                </ul>
              </div>
              
              <div className="card-modern p-8 hover-lift animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 gradient-success rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-text-primary mb-2">Peace of Mind</h4>
                </div>
                <p className="text-base text-text-secondary text-center">
                  Know that your valuable assets are documented, organized, and ready for any situation. 
                  Sleep better knowing you're prepared.
                </p>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="text-center card-modern p-6 hover-lift animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                <div className="text-4xl font-bold text-gradient-primary mb-2">3x</div>
                <p className="text-base text-text-secondary">Faster claim processing with digital inventory</p>
              </div>
              <div className="text-center card-modern p-6 hover-lift animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                <div className="text-4xl font-bold text-gradient-primary mb-2">40%</div>
                <p className="text-base text-text-secondary">Higher settlement amounts with proper documentation</p>
              </div>
              <div className="text-center card-modern p-6 hover-lift animate-fade-in-up" style={{animationDelay: '0.5s'}}>
                <div className="text-4xl font-bold text-gradient-primary mb-2">95%</div>
                <p className="text-base text-text-secondary">Of users feel more secure with digital inventory</p>
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
                Digital Locker <span className="text-gradient-primary">Features</span>
              </h2>
              <p className="text-base text-text-secondary max-w-2xl mx-auto">
                Everything you need to create and maintain a comprehensive digital inventory
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="card-modern p-6 hover-lift animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-4 shadow-glow">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">High-Resolution Photos</h3>
                <p className="text-base text-text-secondary">Capture detailed images with automatic metadata including date, location, and device info</p>
              </div>

              <div className="card-modern p-6 hover-lift animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-4 shadow-glow">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Receipt Storage</h3>
                <p className="text-base text-text-secondary">Upload and organize purchase receipts, warranties, and appraisals with OCR text recognition</p>
              </div>

              <div className="card-modern p-6 hover-lift animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-4 shadow-glow">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Smart Categories</h3>
                <p className="text-base text-text-secondary">Auto-categorize items by type, room, or value with AI-powered suggestions</p>
              </div>

              <div className="card-modern p-6 hover-lift animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-4 shadow-glow">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Insurance Reports</h3>
                <p className="text-base text-text-secondary">Generate comprehensive reports formatted for insurance claims with itemized lists and values</p>
              </div>

              <div className="card-modern p-6 hover-lift animate-fade-in-up" style={{animationDelay: '0.5s'}}>
                <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-4 shadow-glow">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Advanced Search</h3>
                <p className="text-base text-text-secondary">Find any item instantly with powerful search across photos, descriptions, and metadata</p>
              </div>

              <div className="card-modern p-6 hover-lift animate-fade-in-up" style={{animationDelay: '0.6s'}}>
                <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-4 shadow-glow">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Secure Storage</h3>
                <p className="text-base text-text-secondary">Bank-level encryption keeps your sensitive information safe and private</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Businesses */}
      <section className="py-20 bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-950 dark:to-secondary-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                For <span className="text-gradient-secondary">Businesses</span>
              </h2>
              <p className="text-base text-text-secondary max-w-2xl mx-auto">
                Enterprise-grade digital asset management with multi-user access and compliance features
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div className="animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                <h3 className="text-xl md:text-2xl font-semibold text-text-primary mb-6">Enterprise Features</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 gradient-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-glow">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-text-primary">Multi-User Access</h4>
                      <p className="text-sm text-text-secondary">Role-based permissions for team members and departments</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 gradient-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-glow">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-text-primary">Compliance Reporting</h4>
                      <p className="text-sm text-text-secondary">Generate reports for audits, insurance, and regulatory compliance</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 gradient-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-glow">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-text-primary">Equipment Tracking</h4>
                      <p className="text-sm text-text-secondary">Track equipment lifecycle, maintenance, and depreciation</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 gradient-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-glow">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-text-primary">API Integration</h4>
                      <p className="text-sm text-text-secondary">Connect with existing business systems and workflows</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="card-modern p-8 hover-lift animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                <h4 className="text-lg font-semibold text-text-primary mb-4">Business Benefits</h4>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 gradient-success rounded-lg flex items-center justify-center shadow-glow">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <span className="text-base text-text-secondary">Reduced insurance premiums</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 gradient-success rounded-lg flex items-center justify-center shadow-glow">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <span className="text-base text-text-secondary">Faster claim processing</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 gradient-success rounded-lg flex items-center justify-center shadow-glow">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-base text-text-secondary">Improved compliance</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 gradient-success rounded-lg flex items-center justify-center shadow-glow">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <span className="text-base text-text-secondary">Better asset visibility</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-fade-in-up">
            Start Your Digital Locker Today
          </h2>
          <p className="text-base text-white/90 mb-8 max-w-2xl mx-auto animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            Download the app and begin securing your digital assets with comprehensive inventory management
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <a
              href="https://apps.apple.com/app/myassetlocker"
              className="btn-modern hover-lift hover-glow inline-flex items-center justify-center px-6 py-3"
              aria-label="Download on the App Store"
              data-track-cta="digital-locker-app-store"
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
              data-track-cta="digital-locker-google-play"
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
