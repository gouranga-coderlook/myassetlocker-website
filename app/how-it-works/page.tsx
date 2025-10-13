export default function HowItWorks() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative gradient-hero py-20 lg:py-32 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full opacity-20 animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-200 rounded-full opacity-20 animate-float" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-6 animate-fade-in-up">
              How <span className="text-gradient">MyAssetLocker</span> Works
            </h1>
            <p className="text-base md:text-lg text-text-secondary mb-8 max-w-3xl mx-auto animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              Two powerful tracks working together to protect your assets completely
            </p>
          </div>
        </div>
      </section>

      {/* Digital Locker Track */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-950 dark:to-primary-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Track 1: <span className="text-gradient-primary">Digital Locker</span>
              </h2>
              <p className="text-base text-text-secondary max-w-2xl mx-auto">
                Secure digital inventory management for all your valuable assets
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="text-center card-modern p-6 hover-lift animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                <div className="w-16 h-16 gradient-primary text-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-glow">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Inventory</h3>
                <p className="text-base text-text-secondary">Take photos, upload receipts, and catalog all your valuable items</p>
              </div>
              
              <div className="text-center card-modern p-6 hover-lift animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                <div className="w-16 h-16 gradient-primary text-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-glow">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Organize</h3>
                <p className="text-base text-text-secondary">Categorize by room, value, or type with smart tagging and search</p>
              </div>
              
              <div className="text-center card-modern p-6 hover-lift animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                <div className="w-16 h-16 gradient-primary text-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-glow">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Export Reports</h3>
                <p className="text-base text-text-secondary">Generate comprehensive reports for insurance claims and documentation</p>
              </div>
            </div>

            {/* Digital Locker Features */}
            <div className="card-modern p-8 hover-lift">
              <h3 className="text-xl md:text-2xl font-semibold text-text-primary mb-6 text-center text-gradient-primary">Digital Locker Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 gradient-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-text-primary">High-Resolution Photos</h4>
                    <p className="text-sm text-text-secondary">Capture detailed images with automatic metadata</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 gradient-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-text-primary">Receipt Storage</h4>
                    <p className="text-sm text-text-secondary">Upload and organize purchase receipts and warranties</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 gradient-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-text-primary">Smart Categories</h4>
                    <p className="text-sm text-text-secondary">Auto-categorize items by type, room, or value</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 gradient-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-text-primary">Insurance Reports</h4>
                    <p className="text-sm text-text-secondary">Generate detailed reports for claims processing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valet Storage Track */}
      <section className="py-20 bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-950 dark:to-secondary-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <div className="w-20 h-20 gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow-secondary">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Track 2: <span className="text-gradient-secondary">Valet Storage</span>
              </h2>
              <p className="text-base text-text-secondary max-w-2xl mx-auto">
                Professional pickup, storage, and redelivery service for your physical items
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="text-center card-modern p-6 hover-lift animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                <div className="w-16 h-16 gradient-secondary text-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-glow-secondary">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Pickup</h3>
                <p className="text-base text-text-secondary">Schedule convenient pickup at your location</p>
              </div>
              
              <div className="text-center card-modern p-6 hover-lift animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                <div className="w-16 h-16 gradient-secondary text-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-glow-secondary">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Store</h3>
                <p className="text-base text-text-secondary">Secure climate-controlled storage with inventory tracking</p>
              </div>
              
              <div className="text-center card-modern p-6 hover-lift animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                <div className="w-16 h-16 gradient-secondary text-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-glow-secondary">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Redeliver</h3>
                <p className="text-base text-text-secondary">On-demand delivery when you need your items back</p>
              </div>
            </div>

            {/* What We Store */}
            <div className="card-modern p-8 mb-8 hover-lift">
              <h3 className="text-xl md:text-2xl font-semibold text-text-primary mb-6 text-center text-gradient-secondary">What We Store</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 gradient-secondary rounded-lg flex items-center justify-center mx-auto mb-3 shadow-glow-secondary">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-text-primary mb-2">Storage Bins</h4>
                  <p className="text-sm text-text-secondary">Small to medium items in secure containers</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 gradient-secondary rounded-lg flex items-center justify-center mx-auto mb-3 shadow-glow-secondary">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-text-primary mb-2">Bulky Items</h4>
                  <p className="text-sm text-text-secondary">Furniture, appliances, and large equipment</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 gradient-secondary rounded-lg flex items-center justify-center mx-auto mb-3 shadow-glow-secondary">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-text-primary mb-2">Seasonal Gear</h4>
                  <p className="text-sm text-text-secondary">Holiday decorations, sports equipment, seasonal clothing</p>
                </div>
              </div>
            </div>

            {/* Zones & Delivery */}
            <div className="card-modern p-8 mb-8 hover-lift">
              <h3 className="text-xl md:text-2xl font-semibold text-text-primary mb-6 text-center text-gradient-secondary">Zones & Delivery Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-text-primary mb-4">Service Zones</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 gradient-primary rounded-full"></div>
                      <span className="text-base text-text-secondary">Zone 1: Downtown Core (Same-day pickup)</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 gradient-secondary rounded-full"></div>
                      <span className="text-base text-text-secondary">Zone 2: Suburban Areas (Next-day pickup)</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 gradient-success rounded-full"></div>
                      <span className="text-base text-text-secondary">Zone 3: Extended Areas (2-day pickup)</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-text-primary mb-4">Delivery Options</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gradient-to-br from-warning-500 to-warning-600 rounded-full"></div>
                      <span className="text-base text-text-secondary">Standard: 3-5 business days</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 gradient-primary rounded-full"></div>
                      <span className="text-base text-text-secondary">Express: 1-2 business days</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 gradient-success rounded-full"></div>
                      <span className="text-base text-text-secondary">Scheduled: Choose your date</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Add-ons */}
            <div className="card-modern p-8 hover-lift">
              <h3 className="text-xl md:text-2xl font-semibold text-text-primary mb-6 text-center text-gradient-secondary">Add-on Services</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 gradient-success rounded-lg flex items-center justify-center mx-auto mb-3 shadow-glow">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-text-primary mb-2">Climate Control</h4>
                  <p className="text-sm text-text-secondary">Temperature and humidity controlled storage</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-warning-500 to-warning-600 rounded-lg flex items-center justify-center mx-auto mb-3 shadow-glow">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-text-primary mb-2">Protection</h4>
                  <p className="text-sm text-text-secondary">Insurance coverage and damage protection</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mx-auto mb-3 shadow-glow">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-text-primary mb-2">Barcode/Photo</h4>
                  <p className="text-sm text-text-secondary">Item tracking with barcodes and photos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Unified Dashboard */}
      <section className="py-20 bg-gradient-to-br from-neutral-50 to-primary-50 dark:from-neutral-900 dark:to-primary-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 gradient-success rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow animate-fade-in-up">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <span className="text-gradient-success">Unified Dashboard</span>
            </h2>
            <p className="text-base text-text-secondary mb-8 max-w-2xl mx-auto animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              Manage both your digital inventory and physical storage from one powerful dashboard inside our app
            </p>
            
            {/* Dashboard Preview */}
            <div className="card-modern p-8 mb-8 hover-lift animate-fade-in-up" style={{animationDelay: '0.6s'}}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="gradient-primary rounded-lg p-4 text-white">
                  <h3 className="text-lg font-semibold mb-2">Digital Assets</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="opacity-90">Total Items</span>
                      <span className="font-semibold">247</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="opacity-90">Total Value</span>
                      <span className="font-semibold">$45,230</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="opacity-90">Last Updated</span>
                      <span className="font-semibold">2 days ago</span>
                    </div>
                  </div>
                </div>
                
                <div className="gradient-secondary rounded-lg p-4 text-white">
                  <h3 className="text-lg font-semibold mb-2">Storage Items</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="opacity-90">Active Storage</span>
                      <span className="font-semibold">12 bins</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="opacity-90">Monthly Cost</span>
                      <span className="font-semibold">$89</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="opacity-90">Next Delivery</span>
                      <span className="font-semibold">Dec 15</span>
                    </div>
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
            Get Started in the App
          </h2>
          <p className="text-base text-white/90 mb-8 max-w-2xl mx-auto animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            Download the app and start protecting your assets today
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <a
              href="https://apps.apple.com/app/myassetlocker"
              className="btn-modern hover-lift hover-glow inline-flex items-center justify-center px-6 py-3 bg-white text-primary-600"
              aria-label="Download on the App Store"
              data-track-cta="how-it-works-app-store"
            >
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs opacity-75">Download on the</div>
                  <div className="text-lg font-semibold">App Store</div>
                </div>
              </div>
            </a>
            
            <a
              href="https://play.google.com/store/apps/details?id=com.myassetlocker.app"
              className="btn-secondary hover-lift hover-glow inline-flex items-center justify-center px-6 py-3 bg-white text-secondary-600"
              aria-label="Get it on Google Play"
              data-track-cta="how-it-works-google-play"
            >
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.609 1.814L13.792 12 3.609 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L12.5 12l5.199-3.491zM5.864 2.658L16.802 8.99l-2.302 2.302-8.636-8.634z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs opacity-75">GET IT ON</div>
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
