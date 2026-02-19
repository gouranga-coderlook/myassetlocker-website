"use client";
import { useEffect } from "react";
import type { BookingCart } from "@/store/slices/cartSlice";

interface CartDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: BookingCart | null;
}

export default function CartDetailsModal({
  isOpen,
  onClose,
  cart,
}: CartDetailsModalProps) {
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !cart) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-white opacity-75 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-2xl font-bold text-[#4c4946]">Cart Details</h3>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
            {/* Plan/Bundle Section */}
            {(cart.plan || cart.bundles) && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Storage Plan
                </h4>
                {cart.bundles && (
                  <div>
                    <p className="text-gray-900 font-medium">
                      {cart.bundles.bundle_name}
                    </p>
                    {cart.bundles.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {cart.bundles.description}
                      </p>
                    )}
                    {(cart.bundles.fromMonth || cart.bundles.toMonth) && (
                      <p className="text-sm text-gray-600 mt-1">
                        {cart.bundles.fromMonth && cart.bundles.toMonth
                          ? `${cart.bundles.fromMonth} - ${cart.bundles.toMonth}`
                          : cart.bundles.fromMonth || cart.bundles.toMonth}
                        {cart.bundles.months > 0 &&
                          ` (${cart.bundles.months} months)`}
                      </p>
                    )}
                    {cart.bundles.extras && (
                      <p className="text-sm text-gray-600 mt-1">
                        {cart.bundles.extras}
                      </p>
                    )}
                    <p className="text-lg font-bold text-[#f8992f] mt-2">
                      ${cart.baseStorageCost.toFixed(2)}
                    </p>
                  </div>
                )}
                {cart.plan && !cart.bundles && (
                  <div>
                    <p className="text-gray-900 font-medium">
                      {cart.plan.plan_name}
                    </p>
                    {cart.durationBins.months && cart.durationBins.bins > 0 && (
                      <p className="text-sm text-gray-600 mt-1">
                        {cart.durationBins.bins} bins ×{" "}
                        {cart.durationBins.months}{" "}
                        {cart.durationBins.months === 1 ? "month" : "months"}
                      </p>
                    )}
                    <p className="text-lg font-bold text-[#f8992f] mt-2">
                      ${cart.baseStorageCost.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Add-ons Section */}
            {cart.addons.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Add-ons</h4>
                <div className="space-y-2">
                  {cart.addons.map((addon, index) => (
                    <div
                      key={addon.id || index}
                      className="flex justify-between items-start py-2 border-b border-gray-200 last:border-0"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {addon.name}
                        </p>
                        {addon.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {addon.description}
                          </p>
                        )}
                        {addon.recurrence === "monthly" &&
                          cart.durationBins.months && (
                            <p className="text-xs text-gray-500 mt-1">
                              {cart.durationBins.months}{" "}
                              {cart.durationBins.months === 1
                                ? "month"
                                : "months"}
                            </p>
                          )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          $
                          {addon.recurrence === "monthly" &&
                          cart.durationBins.months
                            ? (addon.amount * cart.durationBins.months).toFixed(
                                2
                              )
                            : addon.amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Climate Control */}
            {cart.climateControl && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Climate Control
                    </h4>
                    <p className="text-sm text-gray-600">
                      Climate-controlled storage environment
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    ${cart.climateControlCost.toFixed(2)}
                  </p>
                </div>
              </div>
            )}

            {/* Protection Plan */}
            {cart.protectionPlan && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {cart.protectionPlan.name}
                    </h4>
                    {cart.protectionPlan.description && (
                      <p className="text-sm text-gray-600">
                        {cart.protectionPlan.description}
                      </p>
                    )}
                  </div>
                  <p className="font-semibold text-gray-900">
                    ${cart.protectionPlanCost.toFixed(2)}
                  </p>
                </div>
              </div>
            )}

            {/* Cost Breakdown */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">
                Cost Breakdown
              </h4>
              <div className="space-y-2 text-sm">
                {cart.baseStorageCost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Storage:</span>
                    <span className="font-medium">
                      ${cart.baseStorageCost.toFixed(2)}
                    </span>
                  </div>
                )}
                {cart.redeliveryFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee:</span>
                    <span className="font-medium">
                      ${cart.redeliveryFee.toFixed(2)}
                    </span>
                  </div>
                )}
                {cart.zoneDeliveryCharges && cart.zoneDeliveryCharges > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Zone Delivery:</span>
                    <span className="font-medium">
                      ${cart.zoneDeliveryCharges.toFixed(2)}
                    </span>
                  </div>
                )}
                {cart.climateControlCost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Climate Control:</span>
                    <span className="font-medium">
                      ${cart.climateControlCost.toFixed(2)}
                    </span>
                  </div>
                )}
                {cart.addonsCost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Add-ons:</span>
                    <span className="font-medium">
                      ${cart.addonsCost.toFixed(2)}
                    </span>
                  </div>
                )}
                {cart.addonsDeliveryCost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Add-ons Delivery:</span>
                    <span className="font-medium">
                      ${cart.addonsDeliveryCost.toFixed(2)}
                    </span>
                  </div>
                )}
                {cart.protectionPlanCost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Protection Plan:</span>
                    <span className="font-medium">
                      ${cart.protectionPlanCost.toFixed(2)}
                    </span>
                  </div>
                )}
                {cart.savings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Savings:</span>
                    <span className="font-medium">
                      -${cart.savings.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-gray-300 mt-2">
                  <span className="text-lg font-bold text-gray-900">
                    Total:
                  </span>
                  <span className="text-xl font-bold text-[#f8992f]">
                    ${cart.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            {cart.deliveryInfo.fullName && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Delivery Information
                </h4>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-900">
                    <span className="font-semibold">Name:</span>{" "}
                    {cart.deliveryInfo.fullName}
                  </p>
                  <p className="text-gray-900">
                    <span className="font-semibold">Email:</span>{" "}
                    {cart.deliveryInfo.email}
                  </p>
                  <p className="text-gray-900">
                    <span className="font-semibold">Phone:</span>{" "}
                    {cart.deliveryInfo.phone}
                  </p>
                  {cart.deliveryInfo.deliveryAddress && (
                    <p className="text-gray-900">
                      <span className="font-semibold">Address:</span>{" "}
                      {cart.deliveryInfo.deliveryAddress},{" "}
                      {cart.deliveryInfo.city}, {cart.deliveryInfo.state}{" "}
                      {cart.deliveryInfo.zipCode}
                    </p>
                  )}
                  {cart.deliveryInfo.deliveryNotes && (
                    <p className="text-gray-600 mt-2">
                      <span className="font-semibold">Notes:</span>{" "}
                      {cart.deliveryInfo.deliveryNotes}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

