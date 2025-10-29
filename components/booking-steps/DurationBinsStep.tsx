"use client";

interface DurationBinsStepProps {
  selectedMonths: number | null;
  setSelectedMonths: (months: number) => void;
  selectedBins: number;
  setSelectedBins: (bins: number) => void;
}

export default function DurationBinsStep({
  selectedMonths,
  setSelectedMonths,
  selectedBins,
  setSelectedBins,
}: DurationBinsStepProps) {
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
        Select Duration & Number of Bins
      </h2>

      {/* Storage Duration - First Row */}
      <div className="mb-8">
        <label className="flex items-center gap-2 text-base font-semibold mb-3">
          <span>📅</span> Storage Duration
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {[1, 3, 6, 9, 12].map((months) => (
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
          ))}
        </div>
      </div>

      {/* Number of Bins - Second Row */}
      <div>
        <label className="flex items-center gap-2 text-base font-semibold mb-3">
          <span>📦</span> Number of Bins (optional)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[0, 1, 4, 10, 15, 20].map((bins) => (
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
            </div>
          ))}
        </div>
        <small className="text-gray-500 mt-3 block">
          You can choose 0 bins and select bulky items in the next step.
        </small>
      </div>
    </div>
  );
}
