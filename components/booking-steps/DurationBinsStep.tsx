"use client";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Plan } from "@/store/slices/pricingSlice";

interface DurationBinsStepProps {
  readonly selectedMonths: number | null;
  readonly setSelectedMonths: (months: number) => void;
  readonly selectedBins: number;
  readonly setSelectedBins: (bins: number) => void;
  readonly prepaidPlan?: Plan;
  readonly monthToMonthPlan?: Plan;
  readonly currentPlan?: Plan | null; // Full plan object
  readonly durationError?: string | null;
}

export default function DurationBinsStep({
  selectedMonths,
  setSelectedMonths,
  selectedBins,
  setSelectedBins,
  prepaidPlan,
  monthToMonthPlan,
  currentPlan,
  durationError,
}: DurationBinsStepProps) {
  // Get the currently selected plan - use currentPlan if available, otherwise fallback to prepaidPlan
  const selectedPlan = currentPlan || prepaidPlan;
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [zoomScale, setZoomScale] = useState(1);
  const [isModalImageLoading, setIsModalImageLoading] = useState(false);
  const binImages = [
    {
      src: "/BinInsideView.jpeg",
      alt: "Inside view of storage bin",
    },
    {
      src: "/BinSideViewCropped.jpeg",
      alt: "Side view of storage bin",
    },
    {
      src: "/FilledToteBin.png",
      alt: "Example of filled storage tote bin",
    },
    {
      src: "/filledBin2.png",
      alt: "Filled bin with mixed items",
    },
    {
      src: "/FilledToteBin3.png",
      alt: "Filled tote bin with household storage items",
    },
  ] as const;
  const totalBinImages = binImages.length;
  const hasPreviousImage = activeImageIndex !== null && activeImageIndex > 0;
  const hasNextImage = activeImageIndex !== null && activeImageIndex < totalBinImages - 1;

  const goToPreviousImage = useCallback(() => {
    if (!hasPreviousImage || activeImageIndex === null) return;
    setActiveImageIndex(activeImageIndex - 1);
    setZoomScale(1);
    setIsModalImageLoading(true);
  }, [activeImageIndex, hasPreviousImage]);

  const goToNextImage = useCallback(() => {
    if (!hasNextImage || activeImageIndex === null) return;
    setActiveImageIndex(activeImageIndex + 1);
    setZoomScale(1);
    setIsModalImageLoading(true);
  }, [activeImageIndex, hasNextImage]);

  useEffect(() => {
    if (activeImageIndex === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveImageIndex(null);
        setZoomScale(1);
        setIsModalImageLoading(false);
      } else if (event.key === "ArrowLeft") {
        goToPreviousImage();
      } else if (event.key === "ArrowRight") {
        goToNextImage();
      } else if (event.key === "+") {
        setZoomScale((prev) => Math.min(3, Number((prev + 0.25).toFixed(2))));
      } else if (event.key === "-") {
        setZoomScale((prev) => Math.max(0.25, Number((prev - 0.25).toFixed(2))));
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [activeImageIndex, goToNextImage, goToPreviousImage]);

  useEffect(() => {
    if (activeImageIndex === null) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [activeImageIndex]);

  // Extract available months and bins from the selected plan's pricing matrix
  const { availableMonths, availableBins } = useMemo(() => {
    if (!selectedPlan?.pricing) {
      return { availableMonths: [], availableBins: [] };
    }

    // Get months from pricing keys
    const months = Object.keys(selectedPlan.pricing)
      .map(Number)
      .filter((m) => !Number.isNaN(m))
      .sort((a, b) => a - b);

    // Get bins from first month's pricing (all months should have same bins)
    const firstMonth = months[0]?.toString();
    const bins = firstMonth
      ? Object.keys(selectedPlan.pricing[firstMonth] || {})
          .map(Number)
          .filter((b) => !Number.isNaN(b))
          .sort((a, b) => a - b)
      : [];

    return {
      availableMonths: months,
      availableBins: [0, ...bins], // Add 0 for "no bins" option
    };
  }, [selectedPlan]);

  // Calculate prices for all available plans with proper comparison
  const planComparisons = useMemo(() => {
    if (!selectedMonths || selectedBins === 0) {
      return [];
    }

    const binsStr = selectedBins.toString();
    const monthsStr = selectedMonths.toString();
    const plans = [prepaidPlan, monthToMonthPlan].filter((p): p is Plan => p !== undefined);

    // Calculate prices for each plan
    const planPrices = plans.map((plan) => {
      const pricing = plan.pricing[monthsStr]?.[binsStr];
      const total = pricing ? pricing.base + pricing.deliveryFee : 0;
      return { plan, total };
    });

    // Calculate savings: prepaid saves compared to monthly, monthly doesn't save
    return planPrices.map(({ plan, total }) => {
      const isPrepaid = plan.plan_name.toLowerCase().includes("prepaid");
      let savings = 0;
      
      // Only calculate savings for prepaid plans compared to monthly
      if (isPrepaid && monthToMonthPlan) {
        const monthlyPricing = monthToMonthPlan.pricing[monthsStr]?.[binsStr];
        if (monthlyPricing) {
          const monthlyTotal = monthlyPricing.base + monthlyPricing.deliveryFee;
          savings = Math.max(0, monthlyTotal - total);
        }
      }
      
      return {
        plan,
        price: total,
        savings,
        isSelected: currentPlan?.id === plan.id,
        isPrepaid,
      };
    }).sort((a, b) => {
      // Sort: prepaid first, then monthly, but selected plan first
      if (a.isSelected) return -1;
      if (b.isSelected) return 1;
      if (a.isPrepaid && !b.isPrepaid) return -1;
      if (!a.isPrepaid && b.isPrepaid) return 1;
      return a.price - b.price;
    });
  }, [prepaidPlan, monthToMonthPlan, selectedBins, selectedMonths, currentPlan]);

  // Get price for a specific month/bin combination
  const getPriceForOption = (months: number, bins: number): number => {
    if (!selectedPlan || bins === 0) return 0;
    const monthsStr = months.toString();
    const binsStr = bins.toString();
    const pricing = selectedPlan.pricing[monthsStr]?.[binsStr];
    return pricing ? pricing.base + pricing.deliveryFee : 0;
  };

  const showPriceComparison =
    selectedBins > 0 && selectedMonths !== null && planComparisons.length > 0;
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
        Select Duration & Number of Bins
      </h2>

      {/* Storage Duration - First Row */}
      {availableMonths.length > 0 && (
        <div className="mb-8">
          <label className="flex items-center gap-2 text-base font-semibold mb-3">
            <span>📅</span> Storage Duration
          </label>
          <div className={`grid grid-cols-2 sm:grid-cols-3 ${availableMonths.length <= 3 ? 'md:grid-cols-3' : availableMonths.length === 4 ? 'md:grid-cols-4' : 'md:grid-cols-5'} gap-3`}>
            {availableMonths.map((months) => {
              return (
                <div
                  key={months}
                  onClick={() => setSelectedMonths(months)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedMonths(months); }}
                  role="button"
                  tabIndex={0}
                  className={`relative p-3 md:p-4 border-2 rounded-lg text-center cursor-pointer transition-all bg-white ${
                    selectedMonths === months
                      ? "border-[#f8992f] text-[#f8992f]"
                      : "border-gray-200 text-gray-700 hover:border-[#f8992f]"
                  } ${
                    selectedMonths !== months && durationError ? "border-red-400" : ""
                  }`}
                >
                  {/* Discount badge in top right corner */}
                  {(months === 6 || months === 12) && (
                    <div className={`absolute top-1 right-1 px-2 py-1 text-xs rounded-full ${
                      selectedMonths === months ? "bg-[#f8992f] text-white" : "bg-[#22c55e] text-white"
                    }`}>
                      {months === 6 ? "10% off" : "15% off"}
                    </div>
                  )}
                  <div className="text-xl md:text-2xl font-bold mb-1">{months}</div>
                  <div className="text-xs">{months === 1 ? "Month" : "Months"}</div>
                </div>
              );
            })}
          </div>
          {durationError && (
            <p className="mt-2 text-sm text-red-600">{durationError}</p>
          )}
        </div>
      )}

      {/* Number of Bins - Second Row */}
      {availableBins.length > 0 && (
        <div>
          <label className="flex items-center gap-2 text-base font-semibold mb-3">
            <span>📦</span> Number of Bins (optional)
          </label>
          <div className={`grid grid-cols-2 sm:grid-cols-3 ${availableBins.length <= 4 ? 'md:grid-cols-4' : availableBins.length === 5 ? 'md:grid-cols-5' : 'md:grid-cols-6'} gap-3`}>
            {availableBins.map((bins) => {
              // Calculate price for this bin count with selected months (or first month if none selected)
              const monthsToUse = selectedMonths || availableMonths[0] || 1;
              const price = bins > 0 ? getPriceForOption(monthsToUse, bins) : 0;
              
              return (
                <div
                  key={bins}
                  onClick={() => setSelectedBins(bins)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedBins(bins); }}
                  role="button"
                  tabIndex={0}
                  className={`relative p-3 md:p-4 border-2 rounded-lg text-center cursor-pointer transition-all bg-white ${
                    selectedBins === bins
                      ? "border-[#f8992f] text-[#f8992f]"
                      : "border-gray-200 text-gray-700 hover:border-[#f8992f]"
                  }`}
                >
                  <div className="text-xl md:text-2xl font-bold mb-1">{bins}</div>
                  <div className="text-xs">{bins === 1 ? "Bin" : "Bins"}</div>
                  {bins > 0 && price > 0 && selectedMonths && (
                    <div className="text-xs text-gray-500 mt-1">
                      ${price.toFixed(2)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <small className="text-gray-500 mt-3 block">
            You can choose 0 bins and select bulky items in the next step.
          </small>

          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <h4 className="mb-2 text-sm font-semibold text-amber-900">What fits in one bin?</h4>
            <p className="text-sm text-amber-800">
              One standard tote bin is roughly 27 gallons (30.6 x 20.6 x 14.3 inches) and is best for
              folded clothes, shoes, books, toys, and small household items. Use bins for compact items;
              add bulky items separately in the next step.
            </p>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <button
                type="button"
                onClick={() => {
                  setActiveImageIndex(0);
                  setZoomScale(1);
                  setIsModalImageLoading(true);
                }}
                className="overflow-hidden rounded-lg bg-white p-2 text-left"
              >
                <Image
                  src={binImages[0].src}
                  alt={binImages[0].alt}
                  width={900}
                  height={600}
                  className="h-36 w-full rounded object-cover"
                />
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveImageIndex(1);
                  setZoomScale(1);
                  setIsModalImageLoading(true);
                }}
                className="overflow-hidden rounded-lg bg-white p-2 text-left"
              >
                <Image
                  src={binImages[1].src}
                  alt={binImages[1].alt}
                  width={900}
                  height={600}
                  className="h-36 w-full rounded object-cover"
                />
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveImageIndex(2);
                  setZoomScale(1);
                  setIsModalImageLoading(true);
                }}
                className="overflow-hidden rounded-lg bg-white p-2 text-left"
              >
                <Image
                  src={binImages[2].src}
                  alt={binImages[2].alt}
                  width={900}
                  height={600}
                  className="h-36 w-full rounded object-cover"
                />
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-600">
              Real bin examples: empty bin dimensions and how everyday household items fit inside.
            </p>
            <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  setActiveImageIndex(3);
                  setZoomScale(1);
                  setIsModalImageLoading(true);
                }}
                className="overflow-hidden rounded-lg bg-white p-2 text-left"
              >
                <Image
                  src={binImages[3].src}
                  alt={binImages[3].alt}
                  width={900}
                  height={600}
                  className="h-36 w-full rounded object-cover"
                />
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveImageIndex(4);
                  setZoomScale(1);
                  setIsModalImageLoading(true);
                }}
                className="overflow-hidden rounded-lg bg-white p-2 text-left"
              >
                <Image
                  src={binImages[4].src}
                  alt={binImages[4].alt}
                  width={900}
                  height={600}
                  className="h-36 w-full rounded object-cover"
                />
              </button>
            </div>
          </div>
        </div>
      )}
      {activeImageIndex !== null && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-4"
          onClick={() => {
            setActiveImageIndex(null);
            setZoomScale(1);
            setIsModalImageLoading(false);
          }}
        >
          <div
            className="relative w-full max-w-5xl rounded-lg bg-[#111111] p-3"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm text-white/90">
                Click outside to close. Use arrow keys for previous/next and + / - to zoom.
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setZoomScale((prev) => Math.max(0.25, Number((prev - 0.25).toFixed(2))))
                  }
                  className="rounded bg-white/15 px-3 py-1 text-white hover:bg-white/25"
                >
                  -
                </button>
                <span className="min-w-14 text-center text-sm text-white">
                  {Math.round(zoomScale * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setZoomScale((prev) => Math.min(3, Number((prev + 0.25).toFixed(2))))
                  }
                  className="rounded bg-white/15 px-3 py-1 text-white hover:bg-white/25"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => setZoomScale(1)}
                  className="rounded bg-white/15 px-3 py-1 text-white hover:bg-white/25"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveImageIndex(null);
                    setZoomScale(1);
                    setIsModalImageLoading(false);
                  }}
                  className="rounded bg-white/15 px-3 py-1 text-white hover:bg-white/25"
                >
                  Close
                </button>
              </div>
            </div>
            <div
              className="relative flex max-h-[75vh] items-center justify-center overflow-auto rounded bg-black"
              onWheel={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setZoomScale((prev) => {
                  const direction = event.deltaY > 0 ? -1 : 1;
                  const next = prev + direction * 0.1;
                  return Math.max(0.25, Math.min(3, Number(next.toFixed(2))));
                });
              }}
            >
              {hasPreviousImage && (
                <button
                  type="button"
                  onClick={goToPreviousImage}
                  className="absolute left-4 top-1/2 z-20 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/45 text-white shadow-[0_8px_20px_rgba(0,0,0,0.35)] backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:border-[#f8992f] hover:bg-[#f8992f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f8992f] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  aria-label="Show previous image"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
              )}
              {hasNextImage && (
                <button
                  type="button"
                  onClick={goToNextImage}
                  className="absolute right-4 top-1/2 z-20 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/45 text-white shadow-[0_8px_20px_rgba(0,0,0,0.35)] backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:border-[#f8992f] hover:bg-[#f8992f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f8992f] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  aria-label="Show next image"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </button>
              )}
              {isModalImageLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40">
                  <div className="flex items-center gap-2 rounded bg-black/60 px-4 py-2 text-sm text-white">
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Loading image...
                  </div>
                </div>
              )}
              <Image
                src={binImages[activeImageIndex].src}
                alt={binImages[activeImageIndex].alt}
                width={1400}
                height={900}
                className={`h-auto max-h-[72vh] w-auto max-w-full rounded ${
                  zoomScale > 1 ? "cursor-zoom-out" : "cursor-zoom-in"
                }`}
                style={{ transform: `scale(${zoomScale})`, transformOrigin: "center center" }}
                onLoadingComplete={() => setIsModalImageLoading(false)}
                onClick={() => {
                  setZoomScale((prev) => (prev > 1 ? 1 : 1.5));
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Price Comparison Section */}
      {showPriceComparison && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Price Comparison</h3>
          <div className={`grid grid-cols-1 ${planComparisons.length === 1 ? 'md:grid-cols-1' : planComparisons.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-4`}>
            {planComparisons.map((comparison) => {
              const { plan, price, savings, isSelected, isPrepaid } = comparison;
              
              return (
                <div
                  key={plan.id}
                  className={`relative p-6 border-2 rounded-lg transition-all ${
                    isSelected
                      ? "border-[#f8992f] bg-[#f8992f]"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  {/* Plan Name */}
                  <h4 className={`text-lg font-semibold mb-2 ${
                    isSelected ? "text-white" : "text-[#4c4946]"
                  }`}>
                    {plan.plan_name}
                  </h4>
                  
                  {/* Price */}
                  <div className={`text-3xl md:text-4xl font-bold mb-1 ${
                    isSelected ? "text-white" : "text-gray-700"
                  }`}>
                    ${price.toFixed(2)}
                  </div>
                  
                  {/* Description */}
                  <small className={`text-sm ${
                    isSelected ? "text-white/90" : "text-gray-600"
                  }`}>
                    {plan.description || (isPrepaid ? "One-time payment" : "Total over term")}
                  </small>
                  
                  {/* Badge Container - Show savings or selected indicator */}
                  <div className="absolute top-4 right-4">
                    {isSelected ? (
                      <div className="px-3 py-1 bg-white text-[#f8992f] text-sm font-semibold rounded-full">
                        Selected
                      </div>
                    ) : isPrepaid && savings > 0 ? (
                      <div className="px-3 py-1 bg-[#22c55e] text-white text-sm font-semibold rounded-full">
                        Save ${savings.toFixed(2)}
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
