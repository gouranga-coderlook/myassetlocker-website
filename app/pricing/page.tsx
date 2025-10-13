'use client';

import { useState } from 'react';

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState('digital-locker');
  const [storageSize, setStorageSize] = useState('small');
  const [addOns, setAddOns] = useState<string[]>([]);
  const [serviceZone, setServiceZone] = useState('zone-1');

  const plans = {
    'digital-locker': {
      name: 'Digital Locker',
      price: 9.99,
      description: 'Digital inventory management only',
      features: [
        'Unlimited photo storage',
        'Receipt organization',
        'Smart categorization',
        'Insurance reports',
        'Advanced search',
        'Secure cloud storage'
      ]
    },
    'valet-storage': {
      name: 'Valet Storage',
      price: 29.99,
      description: 'Physical storage with pickup & delivery',
      features: [
        'Climate-controlled storage',
        'Professional pickup & delivery',
        'Comprehensive insurance',
        '24/7 security monitoring',
        'Inventory management',
        'Condition reports'
      ]
    },
    'unified': {
      name: 'Unified Plan',
      price: 34.99,
      description: 'Both digital locker and valet storage',
      features: [
        'All Digital Locker features',
        'All Valet Storage features',
        'Unified dashboard',
        'Priority support',
        'Advanced analytics',
        'Custom reporting'
      ]
    }
  };

  const storageSizes = {
    'small': { name: 'Small Items', multiplier: 1.0 },
    'medium': { name: 'Medium Items', multiplier: 1.5 },
    'large': { name: 'Large Items', multiplier: 2.0 }
  };

  const serviceZones = {
    'zone-1': { name: 'Zone 1 (Same Day)', multiplier: 1.0 },
    'zone-2': { name: 'Zone 2 (Next Day)', multiplier: 0.8 },
    'zone-3': { name: 'Zone 3 (Scheduled)', multiplier: 0.6 }
  };

  const addOnServices = {
    'insurance': { name: 'Enhanced Insurance', price: 5.99 },
    'climate': { name: 'Premium Climate Control', price: 7.99 },
    'inventory': { name: 'Professional Inventory', price: 9.99 },
    'rotation': { name: 'Item Rotation Service', price: 4.99 },
    'reports': { name: 'Monthly Condition Reports', price: 3.99 },
    'priority': { name: 'Priority Access', price: 12.99 }
  };

  const calculatePrice = () => {
    let basePrice = plans[selectedPlan as keyof typeof plans].price;
    
    if (selectedPlan === 'valet-storage' || selectedPlan === 'unified') {
      basePrice *= storageSizes[storageSize as keyof typeof storageSizes].multiplier;
      basePrice *= serviceZones[serviceZone as keyof typeof serviceZones].multiplier;
    }
    
    const addOnPrice = addOns.reduce((total, addOn) => {
      return total + addOnServices[addOn as keyof typeof addOnServices].price;
    }, 0);
    
    return basePrice + addOnPrice;
  };

  const toggleAddOn = (addOn: string) => {
    setAddOns(prev => 
      prev.includes(addOn) 
        ? prev.filter(item => item !== addOn)
        : [...prev, addOn]
    );
  };

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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-6 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <span className="text-gradient-primary">Pricing</span>
            </h1>
            <p className="text-base md:text-lg text-text-secondary mb-8 max-w-3xl mx-auto animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              Choose the perfect plan for your asset protection needs
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Pricing Configurator */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Interactive <span className="text-gradient-primary">Pricing Configurator</span>
              </h2>
              <p className="text-base text-text-secondary max-w-2xl mx-auto">
                Customize your plan and see real-time pricing updates
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Configuration Panel */}
              <div className="space-y-8">
                {/* Plan Selection */}
                <div className="card-modern p-6 hover-lift">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">Choose Your Plan</h3>
                  <div className="space-y-3">
                    {Object.entries(plans).map(([key, plan]) => (
                      <label key={key} className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="plan"
                          value={key}
                          checked={selectedPlan === key}
                          onChange={(e) => setSelectedPlan(e.target.value)}
                          className="mt-1 w-4 h-4 text-primary-600"
                        />
                        <div className="flex-1">
                          <div className="text-lg font-semibold text-text-primary">{plan.name}</div>
                          <div className="text-sm text-text-secondary">{plan.description}</div>
                          <div className="text-lg font-bold text-gradient-primary">${plan.price}/month</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Storage Size (only for valet storage) */}
                {(selectedPlan === 'valet-storage' || selectedPlan === 'unified') && (
                  <div className="card-modern p-6 hover-lift">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">Storage Size</h3>
                    <div className="space-y-3">
                      {Object.entries(storageSizes).map(([key, size]) => (
                        <label key={key} className="flex items-start space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="storageSize"
                            value={key}
                            checked={storageSize === key}
                            onChange={(e) => setStorageSize(e.target.value)}
                            className="mt-1 w-4 h-4 text-primary-600"
                          />
                          <div className="flex-1">
                            <div className="text-lg font-semibold text-text-primary">{size.name}</div>
                            <div className="text-sm text-text-secondary">
                              {size.multiplier === 1.0 ? 'Standard pricing' : 
                               size.multiplier === 1.5 ? '1.5x pricing' : '2x pricing'}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Service Zone (only for valet storage) */}
                {(selectedPlan === 'valet-storage' || selectedPlan === 'unified') && (
                  <div className="card-modern p-6 hover-lift">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">Service Zone</h3>
                    <div className="space-y-3">
                      {Object.entries(serviceZones).map(([key, zone]) => (
                        <label key={key} className="flex items-start space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="serviceZone"
                            value={key}
                            checked={serviceZone === key}
                            onChange={(e) => setServiceZone(e.target.value)}
                            className="mt-1 w-4 h-4 text-primary-600"
                          />
                          <div className="flex-1">
                            <div className="text-lg font-semibold text-text-primary">{zone.name}</div>
                            <div className="text-sm text-text-secondary">
                              {zone.multiplier === 1.0 ? 'Standard pricing' : 
                               zone.multiplier === 0.8 ? '20% discount' : '40% discount'}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add-on Services */}
                <div className="card-modern p-6 hover-lift">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">Add-on Services</h3>
                  <div className="space-y-3">
                    {Object.entries(addOnServices).map(([key, service]) => (
                      <label key={key} className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={addOns.includes(key)}
                          onChange={() => toggleAddOn(key)}
                          className="mt-1 w-4 h-4 text-primary-600"
                        />
                        <div className="flex-1">
                          <div className="text-lg font-semibold text-text-primary">{service.name}</div>
                          <div className="text-sm text-text-secondary">+${service.price}/month</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price Summary */}
              <div className="card-modern p-8 hover-lift">
                <h3 className="text-xl md:text-2xl font-semibold text-text-primary mb-6 text-center text-gradient-primary">
                  Your Custom Plan
                </h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-base text-text-secondary">Base Plan:</span>
                    <span className="text-lg font-semibold text-text-primary">
                      {plans[selectedPlan as keyof typeof plans].name}
                    </span>
                  </div>
                  
                  {(selectedPlan === 'valet-storage' || selectedPlan === 'unified') && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-base text-text-secondary">Storage Size:</span>
                        <span className="text-lg font-semibold text-text-primary">
                          {storageSizes[storageSize as keyof typeof storageSizes].name}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-base text-text-secondary">Service Zone:</span>
                        <span className="text-lg font-semibold text-text-primary">
                          {serviceZones[serviceZone as keyof typeof serviceZones].name}
                        </span>
                      </div>
                    </>
                  )}
                  
                  {addOns.length > 0 && (
                    <div className="border-t border-border-primary pt-4">
                      <div className="text-base text-text-secondary mb-2">Add-ons:</div>
                      {addOns.map(addOn => (
                        <div key={addOn} className="flex justify-between items-center text-sm">
                          <span className="text-base text-text-secondary">
                            {addOnServices[addOn as keyof typeof addOnServices].name}
                          </span>
                          <span className="text-lg font-semibold text-text-primary">
                            +${addOnServices[addOn as keyof typeof addOnServices].price}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-t border-border-primary pt-6">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-semibold text-text-primary">Monthly Total:</span>
                    <span className="text-3xl font-bold text-gradient-primary">
                      ${calculatePrice().toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="text-center text-sm text-text-secondary mb-6">
                    Billed monthly • Cancel anytime • No setup fees
                  </div>
                  
                  <div className="space-y-3">
                    <a
                      href="https://apps.apple.com/app/myassetlocker"
                      className="btn-modern hover-lift hover-glow w-full inline-flex items-center justify-center px-6 py-3"
                      data-track-cta="pricing-app-store"
                    >
                      <div className="flex items-center space-x-3">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                        </svg>
                        <div className="text-left">
                          <div className="text-xs">Download on the</div>
                          <div className="text-sm font-semibold">App Store</div>
                        </div>
                      </div>
                    </a>
                    
                    <a
                      href="https://play.google.com/store/apps/details?id=com.myassetlocker.app"
                      className="btn-secondary hover-lift hover-glow w-full inline-flex items-center justify-center px-6 py-3"
                      data-track-cta="pricing-google-play"
                    >
                      <div className="flex items-center space-x-3">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M3.609 1.814L13.792 12 3.609 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L12.5 12l5.199-3.491zM5.864 2.658L16.802 8.99l-2.302 2.302-8.636-8.634z"/>
                        </svg>
                        <div className="text-left">
                          <div className="text-xs">GET IT ON</div>
                          <div className="text-sm font-semibold">Google Play</div>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plan Comparison */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-950 dark:to-primary-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Plan <span className="text-gradient-primary">Comparison</span>
              </h2>
              <p className="text-base text-text-secondary max-w-2xl mx-auto">
                Compare all our plans to find the perfect fit for your needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Object.entries(plans).map(([key, plan], index) => (
                <div key={key} className={`card-modern p-6 hover-lift animate-fade-in-up ${index === 1 ? 'ring-2 ring-primary-500' : ''}`} style={{animationDelay: `${0.1 * index}s`}}>
                  {index === 1 && (
                    <div className="text-center mb-4">
                      <span className="bg-gradient-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <h3 className="text-xl md:text-2xl font-semibold text-text-primary mb-2">{plan.name}</h3>
                    <div className="text-4xl font-bold text-gradient-primary mb-2">${plan.price}</div>
                    <div className="text-base text-text-secondary">per month</div>
                    <p className="text-sm text-text-secondary mt-2">{plan.description}</p>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <div className="w-5 h-5 gradient-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-glow">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-sm text-text-secondary">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <a
                    href="https://apps.apple.com/app/myassetlocker"
                    className={`w-full inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all ${
                      index === 1 
                        ? 'btn-modern hover-lift hover-glow' 
                        : 'btn-secondary hover-lift hover-glow'
                    }`}
                    data-track-cta={`plan-${key}-app-store`}
                  >
                    Get Started
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Pricing <span className="text-gradient-primary">FAQ</span>
              </h2>
              <p className="text-base text-text-secondary max-w-2xl mx-auto">
                Common questions about our pricing and billing
              </p>
            </div>

            <div className="space-y-6">
              <div className="card-modern p-6 hover-lift">
                <h3 className="text-lg font-semibold text-text-primary mb-2">Can I change my plan anytime?</h3>
                <p className="text-base text-text-secondary">Yes, you can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.</p>
              </div>
              
              <div className="card-modern p-6 hover-lift">
                <h3 className="text-lg font-semibold text-text-primary mb-2">Are there any setup fees?</h3>
                <p className="text-base text-text-secondary">No setup fees! You only pay the monthly subscription fee for your chosen plan.</p>
              </div>
              
              <div className="card-modern p-6 hover-lift">
                <h3 className="text-lg font-semibold text-text-primary mb-2">What happens if I cancel?</h3>
                <p className="text-base text-text-secondary">You can cancel anytime. Your service will continue until the end of your current billing period.</p>
              </div>
              
              <div className="card-modern p-6 hover-lift">
                <h3 className="text-lg font-semibold text-text-primary mb-2">Do you offer annual discounts?</h3>
                <p className="text-base text-text-secondary">Yes! Save 20% when you pay annually. Contact our support team for more information.</p>
              </div>
              
              <div className="card-modern p-6 hover-lift">
                <h3 className="text-lg font-semibold text-text-primary mb-2">Is there a free trial?</h3>
                <p className="text-base text-text-secondary">We offer a 14-day free trial for all new users. No credit card required to start.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 gradient-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-fade-in-up">
            Ready to Protect Your Assets?
          </h2>
          <p className="text-base text-white/90 mb-8 max-w-2xl mx-auto animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            Start your free trial today and experience the peace of mind that comes with comprehensive asset protection
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <a
              href="https://apps.apple.com/app/myassetlocker"
              className="btn-modern hover-lift hover-glow inline-flex items-center justify-center px-6 py-3"
              aria-label="Download on the App Store"
              data-track-cta="pricing-final-app-store"
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
              data-track-cta="pricing-final-google-play"
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
