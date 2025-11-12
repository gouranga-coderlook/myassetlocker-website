"use client";

interface DeliveryInformationStepProps {
  fullName: string;
  setFullName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
  deliveryAddress: string;
  setDeliveryAddress: (address: string) => void;
  city: string;
  setCity: (city: string) => void;
  state: string;
  setState: (state: string) => void;
  zipCode: string;
  setZipCode: (zipCode: string) => void;
  deliveryNotes: string;
  setDeliveryNotes: (notes: string) => void;
}

export default function DeliveryInformationStep({
  fullName,
  setFullName,
  email,
  setEmail,
  phone,
  setPhone,
  deliveryAddress,
  setDeliveryAddress,
  city,
  setCity,
  state,
  setState,
  zipCode,
  setZipCode,
  deliveryNotes,
  setDeliveryNotes,
}: DeliveryInformationStepProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        Delivery & Contact Information
      </h2>
      <p className="text-gray-600 mb-6 text-sm">
        Please provide your contact details and delivery address
      </p>

      {/* Contact Details */}
      <div className="mb-6 bg-white rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">📞 Contact Details</h3>
        <p className="text-sm text-gray-600 mb-4">
          We&apos;ll send your confirmation and moving details here
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold mb-2">
              <span>👤</span> Full Name *
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Jane Doe"
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f8992f] focus:border-[#f8992f] transition"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold mb-2">
              <span>✉️</span> Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f8992f] focus:border-[#f8992f] transition"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold mb-2">
              <span>📱</span> Phone Number *
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 123-4567"
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f8992f] focus:border-[#f8992f] transition"
            />
          </div>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="mb-6 bg-white rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">📍 Delivery Address</h3>
        <p className="text-sm text-gray-600 mb-4">
          Where should we pick up your items?
        </p>
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold mb-2">
              <span>🏠</span> Street Address *
            </label>
            <input
              type="text"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="123 Main Street"
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f8992f] focus:border-[#f8992f] transition"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                <span>🏙️</span> City *
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="New York"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f8992f] focus:border-[#f8992f] transition"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                <span>🗺️</span> State *
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="NY"
                required
                maxLength={2}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f8992f] focus:border-[#f8992f] transition uppercase"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                <span>📮</span> ZIP Code *
              </label>
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="10001"
                required
                maxLength={10}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f8992f] focus:border-[#f8992f] transition"
              />
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold mb-2">
              <span>📝</span> Special Instructions (Optional)
            </label>
            <textarea
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
              placeholder="Any special delivery instructions or notes..."
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f8992f] focus:border-[#f8992f] transition resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

