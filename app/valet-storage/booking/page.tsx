"use client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from '@/components/ui/Input';

interface BookingFormValues {
  // Step 2 requirement: must select storage duration (bins optional)
  months: number | null;
  // Step 4 requirement: contact fields
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

interface BookingData {
  planType: 'prepaid' | 'monthly';
  bundleType: 'summer' | 'ski' | 'custom' | null;
  months: number | null;
  bins: number;
  addons: string[];
  addonsBaseTotal: number;
  addonsDeliveryTotal: number;
  climateControlCost: number;
  basePrice: number;
  deliveryFee: number;
  totalPrice: number;
  savings: number;
  // User contact information
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
}

const ValetStorageBooking = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    planType: 'prepaid',
    bundleType: null,
    months: null,
    bins: 0,
    addons: [],
    addonsBaseTotal: 0,
    addonsDeliveryTotal: 0,
    climateControlCost: 0,
    basePrice: 0,
    deliveryFee: 0,
    totalPrice: 0,
    savings: 0,
    // User contact information
    email: '',
    phoneNumber: '',
    firstName: '',
    lastName: ''
  });

  const {
    register,
    trigger,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BookingFormValues>({
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      months: null,
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
    },
  });

  // Pricing matrices - used for calculating storage costs
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const prepaidPricing: { [key: number]: { [key: number]: number } } = {
    1: { 1: 46.50, 4: 60, 10: 95, 15: 122.50, 20: 150 },
    3: { 1: 52.50, 4: 110, 10: 235, 15: 337.50, 20: 420 },
    6: { 1: 65, 4: 190, 10: 450, 15: 652.50, 20: 810 },
    9: { 1: 77.50, 4: 270, 10: 652.50, 15: 945, 20: 1170 },
    12: { 1: 90, 4: 360, 10: 810, 15: 1170, 20: 1440 }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const monthlyPricing: { [key: number]: { [key: number]: number } } = {
    1: { 1: 46.50, 4: 69, 10: 114, 15: 151.50, 20: 189 },
    3: { 1: 61.50, 4: 129, 10: 264, 15: 376.50, 20: 489 },
    6: { 1: 84, 4: 219, 10: 489, 15: 714, 20: 939 },
    9: { 1: 106.50, 4: 309, 10: 714, 15: 1051.50, 20: 1389 },
    12: { 1: 129, 4: 399, 10: 939, 15: 1350, 20: 1839 }
  };

  const getDeliveryFeePerItem = () => {
    if (bookingData.planType === 'monthly') {
      return 39;
    } else {
      if (!bookingData.months) return 39;
      if (bookingData.months >= 12) return 0;
      if (bookingData.months >= 9) return 10;
      if (bookingData.months >= 6) return 20;
      if (bookingData.months >= 3) return 30;
      return 39;
    }
  };

  const updatePlanType = (planType: 'prepaid' | 'monthly') => {
    setBookingData(prev => ({ ...prev, planType }));
  };

  const selectBundle = (type: 'summer' | 'ski' | 'custom') => {
    setBookingData(prev => ({ ...prev, bundleType: type }));
    
    if (type === 'summer') {
      setBookingData(prev => ({
        ...prev,
        months: 4,
        bins: 5,
        totalPrice: 229,
        basePrice: 229,
        deliveryFee: 0,
        savings: 0
      }));
      setValue('months', 4, { shouldValidate: true, shouldDirty: true });
      setCurrentStep(4);
    } else if (type === 'ski') {
      setBookingData(prev => ({
        ...prev,
        months: 6,
        bins: 2,
        totalPrice: 149,
        basePrice: 149,
        deliveryFee: 0,
        savings: 0
      }));
      setValue('months', 6, { shouldValidate: true, shouldDirty: true });
      setCurrentStep(4);
    }
  };

  const selectMonths = (months: number) => {
    setBookingData(prev => ({ ...prev, months }));
    setValue('months', months, { shouldValidate: true, shouldDirty: true });
  };

  const selectBins = (bins: number) => {
    setBookingData(prev => ({ ...prev, bins }));
  };

  const nextStep = () => {
    void (async () => {
      if (await validateCurrentStep()) {
      setCurrentStep(prev => Math.min(4, prev + 1));
      }
    })();
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const validateCurrentStep = async () => {
    if (currentStep === 2) {
      return await trigger('months');
    }
    if (currentStep === 4) {
      return await trigger(['firstName', 'lastName', 'email', 'phoneNumber']);
    }
    return true;
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Choose Your Storage Plan</h2>
        <p className="text-gray-600">Select the plan that works best for you</p>
      </div>

      {/* Plan Selection */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div
          className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
            bookingData.planType === 'prepaid'
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => updatePlanType('prepaid')}
        >
          <div className="flex items-center mb-3">
            <input
              type="radio"
              name="planType"
              value="prepaid"
              checked={bookingData.planType === 'prepaid'}
              onChange={() => updatePlanType('prepaid')}
              className="w-5 h-5 text-primary-600"
            />
            <h3 className="text-lg font-semibold text-gray-900 ml-3">Prepaid Plan</h3>
          </div>
          <p className="text-gray-600 text-sm mb-3">Pay upfront and save up to 30%</p>
          <div className="flex items-center text-green-600 font-medium">
            <span className="text-sm">💰 Save money with advance payment</span>
          </div>
        </div>

        <div
          className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
            bookingData.planType === 'monthly'
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => updatePlanType('monthly')}
        >
          <div className="flex items-center mb-3">
            <input
              type="radio"
              name="planType"
              value="monthly"
              checked={bookingData.planType === 'monthly'}
              onChange={() => updatePlanType('monthly')}
              className="w-5 h-5 text-primary-600"
            />
            <h3 className="text-lg font-semibold text-gray-900 ml-3">Monthly Plan</h3>
          </div>
          <p className="text-gray-600 text-sm mb-3">Pay monthly for flexibility</p>
          <div className="flex items-center text-blue-600 font-medium">
            <span className="text-sm">🔄 Maximum flexibility</span>
          </div>
        </div>
      </div>

      {/* Special Offers */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-xl border border-orange-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Special Offers</h3>
        <div className="space-y-4">
          <div
            className={`p-4 bg-white rounded-lg cursor-pointer transition-all border-2 ${
              bookingData.bundleType === 'summer' 
                ? 'border-orange-400 bg-orange-50' 
                : 'border-gray-200 hover:border-orange-300'
            }`}
            onClick={() => selectBundle('summer')}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-gray-900">🎓 Summer Student Bundle</h4>
                <p className="text-gray-600 text-sm">Perfect for students (May-Aug)</p>
                <p className="text-gray-500 text-xs mt-1">5 bins + 1 bulky item included</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-orange-600">$229</div>
                <div className="text-xs text-gray-500">for 4 months</div>
              </div>
            </div>
          </div>

          <div
            className={`p-4 bg-white rounded-lg cursor-pointer transition-all border-2 ${
              bookingData.bundleType === 'ski' 
                ? 'border-orange-400 bg-orange-50' 
                : 'border-gray-200 hover:border-orange-300'
            }`}
            onClick={() => selectBundle('ski')}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-gray-900">⛷️ Ski Season Bundle</h4>
                <p className="text-gray-600 text-sm">Winter storage (Nov-Apr)</p>
                <p className="text-gray-500 text-xs mt-1">2 bins + 1 bulky item included</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-orange-600">$149</div>
                <div className="text-xs text-gray-500">for 6 months</div>
              </div>
            </div>
          </div>

          <div
            className={`p-4 bg-white rounded-lg cursor-pointer transition-all border-2 ${
              bookingData.bundleType === 'custom' 
                ? 'border-orange-400 bg-orange-50' 
                : 'border-gray-200 hover:border-orange-300'
            }`}
            onClick={() => selectBundle('custom')}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-gray-900">📦 Custom Plan</h4>
                <p className="text-gray-600 text-sm">Build your own storage plan</p>
                <p className="text-gray-500 text-xs mt-1">Choose duration and items</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-600">Flexible</div>
                <div className="text-xs text-gray-500">pricing</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">How Long Do You Need Storage?</h2>
        <p className="text-gray-600">Choose your storage duration and number of bins</p>
      </div>

      {/* Duration Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Storage Duration</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {/* Registered field for step 2 validation (months must be selected). */}
          <input type="hidden" {...register('months', { required: 'Please select a storage duration.' })} />
          {[
            { months: 1, label: '1 Month', popular: false },
            { months: 3, label: '3 Months', popular: false },
            { months: 6, label: '6 Months', popular: true, discount: '10% off' },
            { months: 9, label: '9 Months', popular: false },
            { months: 12, label: '12 Months', popular: true, discount: '15% off' }
          ].map((option) => (
            <div
              key={option.months}
              className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all text-center ${
                bookingData.months === option.months
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
              onClick={() => selectMonths(option.months)}
            >
              {option.popular && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    {option.discount}
                  </span>
                </div>
              )}
              <div className="text-2xl font-bold text-gray-900 mb-1">{option.months}</div>
              <div className="text-sm text-gray-600">{option.label}</div>
            </div>
          ))}
        </div>

        {errors.months?.message && (
          <p className="mt-3 text-sm text-red-600" role="alert">
            {errors.months.message}
          </p>
        )}
      </div>

      {/* Bin Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Storage Bins (Optional)</h3>
        <p className="text-gray-600 text-sm mb-4">Choose how many bins you need, or skip to select only bulky items</p>
        
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { bins: 0, label: 'No Bins', desc: 'Bulky items only' },
            { bins: 1, label: '1 Bin', desc: 'Small items' },
            { bins: 4, label: '4 Bins', desc: 'Room items' },
            { bins: 10, label: '10 Bins', desc: 'Apartment' },
            { bins: 15, label: '15 Bins', desc: 'House' },
            { bins: 20, label: '20 Bins', desc: 'Large house' }
          ].map((option) => (
            <div
              key={option.bins}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all text-center ${
                bookingData.bins === option.bins
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
              onClick={() => selectBins(option.bins)}
            >
              <div className="text-xl font-bold text-gray-900 mb-1">{option.bins}</div>
              <div className="text-sm text-gray-600 mb-1">{option.label}</div>
              <div className="text-xs text-gray-500">{option.desc}</div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start">
            <span className="text-blue-500 mr-2">💡</span>
            <div>
              <p className="text-sm text-blue-800 font-medium">Need help choosing?</p>
              <p className="text-xs text-blue-700 mt-1">
                Each bin holds about 1.5 cubic feet. You can always add more bins later or select bulky items on the next step.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Add Extra Items</h2>
        <p className="text-gray-600">Select any additional items you&apos;d like to store</p>
      </div>

      {/* Info Box */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <span className="text-yellow-600 mr-2">ℹ️</span>
          <div>
            <p className="text-sm text-yellow-800 font-medium">Delivery Information</p>
            <p className="text-xs text-yellow-700 mt-1">
              Each bulky item includes pickup and delivery. Prepaid plans get discounted delivery rates.
            </p>
          </div>
        </div>
      </div>

      {/* Bulky Items */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bulky Items</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { id: 'skis', name: 'Skis/Snowboard', price: 6, icon: '🎿', desc: 'Winter sports equipment' },
            { id: 'bike', name: 'Bicycle', price: 12, icon: '🚲', desc: 'Regular bike storage' },
            { id: 'ebike', name: 'E-Bike', price: 15, icon: '⚡', desc: 'Electric bicycle' },
            { id: 'tires', name: 'Tire Set (4)', price: 18, icon: '🛞', desc: 'Seasonal tire storage' },
            { id: 'luggage', name: 'Luggage', price: 7, icon: '🧳', desc: 'Suitcases & bags' }
          ].map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {getDeliveryFeePerItem() > 0 ? `+ $${getDeliveryFeePerItem()} delivery` : 'FREE delivery'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary-600">${item.price}</div>
                  <div className="text-xs text-gray-500">per month</div>
                  <input
                    type="checkbox"
                    className="mt-2 w-5 h-5 text-primary-600"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setBookingData(prev => ({
                          ...prev,
                          addons: [...prev.addons, item.name]
                        }));
                      } else {
                        setBookingData(prev => ({
                          ...prev,
                          addons: prev.addons.filter(addon => addon !== item.name)
                        }));
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Premium Features */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Premium Features</h3>
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🌡️</span>
              <div>
                <h4 className="font-semibold text-gray-900">Climate-Controlled Storage</h4>
                <p className="text-sm text-gray-600">Temperature and humidity controlled environment</p>
                <p className="text-xs text-gray-500 mt-1">Perfect for sensitive items</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-primary-600">+20%</div>
              <div className="text-xs text-gray-500">of total cost</div>
              <input
                type="checkbox"
                className="mt-2 w-5 h-5 text-primary-600"
                onChange={(e) => {
                  const totalStorageCost = bookingData.basePrice + bookingData.addonsBaseTotal;
                  setBookingData(prev => ({
                    ...prev,
                    climateControlCost: e.target.checked ? totalStorageCost * 0.2 : 0
                  }));
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => {
    const finalTotal = bookingData.totalPrice + bookingData.addonsBaseTotal + bookingData.addonsDeliveryTotal + bookingData.climateControlCost;
    
    return (
      <div className="space-y-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Review Your Booking</h2>
          <p className="text-gray-600">Please review your selections and provide your contact information</p>
        </div>

        {/* User Information Form */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
          <p className="text-sm text-gray-600 mb-6">We need your contact details to schedule pickup and delivery</p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Input
                label="First Name"
                placeholder="Enter your first name"
                required
                type="text"
                error={errors.firstName?.message}
                {...register('firstName', {
                  required: 'First name is required.',
                  validate: (v) => v.trim().length > 0 || 'First name is required.',
                })}
              />
            </div>
            
            <div>
              <Input
                label="Last Name"
                placeholder="Enter your last name"
                required
                type="text"
                error={errors.lastName?.message}
                {...register('lastName', {
                  required: 'Last name is required.',
                  validate: (v) => v.trim().length > 0 || 'Last name is required.',
                })}
              />
            </div>
            
            <div>
              <Input
                label="Email Address"
                placeholder="Enter your email address"
                required
                type="email"
                error={errors.email?.message}
                {...register('email', {
                  required: 'Email is required.',
                  validate: (v) => {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    return emailRegex.test(v) || 'Please enter a valid email address.';
                  },
                })}
              />
            </div>
            
            <div>
              <Input
                label="Phone Number"
                placeholder="(555) 123-4567"
                required
                type="tel"
                error={errors.phoneNumber?.message}
                {...register('phoneNumber', {
                  required: 'Phone number is required.',
                  validate: (v) => {
                    const cleanPhone = v.replace(/\D/g, '');
                    return cleanPhone.length >= 10 || 'Please enter a valid phone number (at least 10 digits).';
                  },
                })}
              />
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <span className="text-blue-600 mr-2">🔒</span>
              <div>
                <p className="text-sm text-blue-800 font-medium">Your information is secure</p>
                <p className="text-xs text-blue-700 mt-1">
                  We only use your contact information to schedule pickup and delivery. We never share your data with third parties.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
          
          <div className="space-y-4">
            {/* Plan Type */}
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <div>
                <span className="text-gray-700 font-medium">Storage Plan</span>
                <p className="text-sm text-gray-500">
                  {bookingData.planType === 'prepaid' ? 'Prepaid (Save up to 30%)' : 'Monthly (Flexible)'}
                </p>
              </div>
              <span className="text-gray-900 font-semibold">
                {bookingData.planType === 'prepaid' ? 'Prepaid' : 'Monthly'}
              </span>
            </div>

            {/* Duration */}
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <div>
                <span className="text-gray-700 font-medium">Storage Duration</span>
                <p className="text-sm text-gray-500">How long you need storage</p>
              </div>
              <span className="text-gray-900 font-semibold">
                {bookingData.months ? `${bookingData.months} month${bookingData.months > 1 ? 's' : ''}` : 'Not selected'}
              </span>
            </div>

            {/* Storage Items */}
            <div className="flex justify-between items-start py-3 border-b border-gray-200">
              <div>
                <span className="text-gray-700 font-medium">Storage Items</span>
                <p className="text-sm text-gray-500">What you&apos;re storing</p>
              </div>
              <div className="text-right">
                <div className="text-gray-900 font-semibold">
                  {[
                    ...(bookingData.bins > 0 ? [`${bookingData.bins} bin${bookingData.bins > 1 ? 's' : ''}`] : []),
                    ...bookingData.addons
                  ].join(', ') || 'No items selected'}
                </div>
              </div>
            </div>

            {/* Pricing Breakdown */}
            <div className="bg-white rounded-lg p-4 mt-4">
              <h4 className="font-semibold text-gray-900 mb-3">Pricing Breakdown</h4>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Base Storage Cost</span>
                  <span className="text-gray-900">${(bookingData.basePrice + bookingData.addonsBaseTotal).toFixed(2)}</span>
                </div>
                
                {bookingData.addonsDeliveryTotal > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fees</span>
                    <span className="text-gray-900">${bookingData.addonsDeliveryTotal.toFixed(2)}</span>
                  </div>
                )}
                
                {bookingData.climateControlCost > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Climate Control (+20%)</span>
                    <span className="text-gray-900">${bookingData.climateControlCost.toFixed(2)}</span>
                  </div>
                )}
                
                {bookingData.savings > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>You Save</span>
                    <span>${bookingData.savings.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-2 mt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-900">Total Amount</span>
                    <span className="text-primary-600">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <span className="text-blue-600 mr-2">🚚</span>
            <div>
              <h4 className="text-sm font-semibold text-blue-900">Delivery Information</h4>
              <p className="text-xs text-blue-800 mt-1">
                We provide pickup and delivery within 0-7 miles. Delivery fees vary based on your plan type and duration.
              </p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start">
            <span className="text-green-600 mr-2">✅</span>
            <div>
              <h4 className="text-sm font-semibold text-green-900">What Happens Next?</h4>
              <ul className="text-xs text-green-800 mt-1 space-y-1">
                <li>• We&apos;ll contact you to schedule pickup</li>
                <li>• Your items will be safely stored</li>
                <li>• You can request delivery anytime</li>
                <li>• Manage everything through our app</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return renderStep1();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Book Your Storage
          </h1>
          <p className="text-gray-600">
            Simple steps to get your items stored safely
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            {/* Background line */}
            <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-300 z-0"></div>
            
            {/* Progress line */}
            <div 
              className="absolute top-6 left-6 h-0.5 bg-primary-600 z-10 transition-all duration-500"
              style={{ 
                width: currentStep > 1 ? `${((currentStep - 1) / 3) * 100}%` : '0%',
                maxWidth: 'calc(100% - 48px)'
              }}
            ></div>
            
            {[
              { step: 1, title: "Plan", icon: "📋" },
              { step: 2, title: "Duration", icon: "📅" },
              { step: 3, title: "Add-ons", icon: "➕" },
              { step: 4, title: "Review", icon: "✅" },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center relative z-20">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all cursor-pointer ${
                    currentStep >= item.step
                      ? "bg-primary-600 border-primary-600 text-white shadow-lg"
                      : "bg-white border-gray-300 text-gray-400 hover:border-gray-400"
                  } ${currentStep === item.step ? "ring-4 ring-orange-200 scale-110 border-orange-500" : ""}`}
                  onClick={() => setCurrentStep(item.step)}
                >
                  <span className="text-lg">{item.icon}</span>
                </div>
                <div className="mt-3 text-center">
                  <div
                    className={`text-sm font-medium ${
                      currentStep >= item.step
                        ? "text-primary-600"
                        : "text-gray-400"
                    }`}
                  >
                    Step {item.step}
                  </div>
                  <div
                    className={`text-xs mt-1 ${
                      currentStep >= item.step
                        ? "text-gray-700 font-medium"
                        : "text-gray-400"
                    }`}
                  >
                    {item.title}
                  </div>
                 
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Step Content */}
          <div className="p-8">{renderCurrentStep()}</div>

          {/* Navigation */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <button
                onClick={previousStep}
                className={`px-6 py-3 rounded-lg font-medium transition-all cursor-pointer ${
                  currentStep > 1
                    ? "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    : "invisible"
                }`}
              >
                ← Back
              </button>

              <div className="text-sm text-gray-500">
                Step {currentStep} of 4
              </div>

              {currentStep < 4 ? (
                <button
          onClick={() => {
            void nextStep();
          }}
                  className="px-8 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-all shadow-sm cursor-pointer"
                >
                  Continue →
                </button>
              ) : (
        <button
          onClick={handleSubmit((values) => {
            setBookingData(prev => ({
              ...prev,
              firstName: values.firstName,
              lastName: values.lastName,
              email: values.email,
              phoneNumber: values.phoneNumber,
            }));
          })}
          className="px-8 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-all shadow-sm cursor-pointer"
        >
          Complete Booking
        </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValetStorageBooking;