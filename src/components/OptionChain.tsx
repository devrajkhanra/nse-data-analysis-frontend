// import React, { useEffect, useMemo, useState } from "react";
// import type {
//     OptionChainWithDeltas,
//     OptionChainLegWithDeltas,
// } from "../types";
// import {
//     fetchExpiryDates,
//     fetchAvailableOptionDates,
//     fetchOptionChain,
// } from "../api";
// import DateRangePicker from "./DateRangePicker";

// interface OptionChainProps {
//     symbol: string;
// }

// const OptionChainView: React.FC<OptionChainProps> = ({ symbol }) => {
//     const [expiries, setExpiries] = useState<string[]>([]);
//     const [selectedExpiryIndex, setSelectedExpiryIndex] = useState(0);

//     // Available option file dates for date range filter
//     const [availableDates, setAvailableDates] = useState<string[]>([]);
//     const [dateFrom, setDateFrom] = useState<string | null>(null);
//     const [dateTo, setDateTo] = useState<string | null>(null);

//     // For navigation within filtered date range
//     const [selectedDateIndex, setSelectedDateIndex] = useState(0);

//     // Option chain with delta info, loaded from API
//     const [optionChain, setOptionChain] = useState<OptionChainWithDeltas | null>(null);

//     // Loading & errors
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);

//     // Load expiry dates on symbol change
//     useEffect(() => {
//         setLoading(true);
//         setError(null);
//         fetchExpiryDates(symbol)
//             .then((exps) => {
//                 setExpiries(exps);
//                 setSelectedExpiryIndex(0);
//             })
//             .catch(() => setError("Failed to load expiry dates"))
//             .finally(() => setLoading(false));
//     }, [symbol]);

//     // Load available option file dates on mount (or symbol change)
//     useEffect(() => {
//         fetchAvailableOptionDates()
//             .then((dates) => {
//                 setAvailableDates(dates);
//                 if (dates.length) {
//                     setDateFrom(dates[0]);
//                     setDateTo(dates[dates.length - 1]);
//                     setSelectedDateIndex(0);
//                 }
//             })
//             .catch(() => setError("Failed to load available option dates."));
//     }, [symbol]);

//     // Compute filtered dates user can navigate across (within selected date range)
//     const filteredDates = useMemo(() => {
//         if (!dateFrom || !dateTo) return [];
//         const startIdx = availableDates.indexOf(dateFrom);
//         const endIdx = availableDates.indexOf(dateTo);
//         if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) return [];
//         return availableDates.slice(startIdx, endIdx + 1);
//     }, [availableDates, dateFrom, dateTo]);

//     // Construct dates param list for API call, currently picking only selected date for option data
//     const selectedDate = filteredDates[selectedDateIndex] || null;

//     // Previous date for delta comparison is previous day in filteredDates array
//     const previousDate =
//         selectedDateIndex > 0 ? filteredDates[selectedDateIndex - 1] : undefined;

//     // Load option chain on [symbol, expiry, selectedDate, previousDate] changes
//     useEffect(() => {
//         if (!selectedDate || !expiries.length) {
//             setOptionChain(null);
//             return;
//         }
//         setLoading(true);
//         setError(null);
//         fetchOptionChain(symbol, expiries[selectedExpiryIndex], [selectedDate], previousDate)
//             .then((chain) => {
//                 setOptionChain(chain);
//             })
//             .catch(() => {
//                 setOptionChain(null);
//                 setError("Failed to load option chain data.");
//             })
//             .finally(() => setLoading(false));
//     }, [symbol, expiries, selectedExpiryIndex, selectedDate, previousDate]);

//     // Handlers for expiry and day navigation
//     const handleExpiryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//         const idx = expiries.indexOf(e.target.value);
//         if (idx >= 0) {
//             setSelectedExpiryIndex(idx);
//             setSelectedDateIndex(0); // reset day navigation
//         }
//     };

//     const prevDay = () => {
//         setSelectedDateIndex((idx) => Math.max(idx - 1, 0));
//     };

//     const nextDay = () => {
//         setSelectedDateIndex((idx) => Math.min(idx + 1, filteredDates.length - 1));
//     };

//     return (
//         <section className="p-4 bg-white rounded shadow max-w-7xl mx-auto">
//             <h2 className="text-2xl font-bold mb-4">
//                 Option Chain - {symbol} - Expiry:{" "}
//                 {expiries[selectedExpiryIndex] ?? "N/A"}
//             </h2>

//             {/* Expiry selection */}
//             <div className="flex flex-wrap items-center gap-4 mb-4">
//                 <label htmlFor="expirySelect" className="font-semibold">
//                     Expiry:
//                 </label>
//                 <select
//                     id="expirySelect"
//                     className="border rounded p-1"
//                     value={expiries[selectedExpiryIndex] || ""}
//                     onChange={handleExpiryChange}
//                 >
//                     {expiries.map((exp) => (
//                         <option key={exp} value={exp}>
//                             {exp}
//                         </option>
//                     ))}
//                 </select>
//             </div>

//             {/* Date range picker */}
//             <div className="mb-4">
//                 {/* Ensure you have a DateRangePicker component wired up */}
//                 <DateRangePicker
//                     dates={availableDates}
//                     dateFrom={dateFrom}
//                     dateTo={dateTo}
//                     setDateFrom={(date) => {
//                         setDateFrom(date);
//                         if (filteredDates.length) setSelectedDateIndex(0);
//                     }}
//                     setDateTo={(date) => {
//                         setDateTo(date);
//                         if (filteredDates.length) setSelectedDateIndex(0);
//                     }}
//                 />
//             </div>

//             {/* Day navigation */}
//             <div className="flex items-center gap-3 mb-6 font-semibold text-gray-700">
//                 <button
//                     onClick={prevDay}
//                     disabled={selectedDateIndex === 0 || loading}
//                     aria-label="Previous trading day"
//                     className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
//                 >
//                     ← Prev Day
//                 </button>
//                 <div>
//                     Trading Day: <span className="font-bold">{selectedDate || "N/A"}</span>
//                     {previousDate && (
//                         <span className="ml-2 text-gray-400">
//                             (Compared to {previousDate})
//                         </span>
//                     )}
//                 </div>
//                 <button
//                     onClick={nextDay}
//                     disabled={
//                         !filteredDates.length || selectedDateIndex === filteredDates.length - 1 || loading
//                     }
//                     aria-label="Next trading day"
//                     className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
//                 >
//                     Next Day →
//                 </button>
//             </div>

//             {/* Loading & error states */}
//             {loading && <div className="text-center font-semibold text-gray-600">Loading option chain...</div>}
//             {error && <div className="text-center text-red-600 font-semibold">{error}</div>}

//             {/* Option chain table */}
//             {optionChain && !loading && !error && (
//                 <div className="overflow-x-auto rounded border bg-gray-50 shadow">
//                     <table className="min-w-full border-collapse text-sm text-right">
//                         <thead className="sticky top-0 bg-gray-200 font-semibold">
//                             <tr>
//                                 <th className="p-2 border bg-red-200 text-left">Strike Price</th>
//                                 <th className="p-2 border bg-blue-100">CE OI</th>
//                                 <th className="p-2 border bg-blue-100">CE ΔOI</th>
//                                 <th className="p-2 border bg-blue-100">CE Premium</th>
//                                 <th className="p-2 border bg-blue-100">CE ΔPremium</th>
//                                 <th className="p-2 border bg-red-100">PE Premium</th>
//                                 <th className="p-2 border bg-red-100">PE ΔPremium</th>
//                                 <th className="p-2 border bg-red-100">PE OI</th>
//                                 <th className="p-2 border bg-red-100">PE ΔOI</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {optionChain.strikes.map((leg: OptionChainLegWithDeltas) => (
//                                 <tr key={leg.strPrice} className="hover:bg-gray-100 transition-colors">
//                                     <td className="p-1 font-mono border text-left">{leg.strPrice}</td>

//                                     <td className="p-1 border font-mono">{leg.CE?.openInt ?? "-"}</td>
//                                     <td
//                                         className={`p-1 border font-mono ${leg.CE?.deltaOI !== undefined
//                                                 ? leg.CE.deltaOI > 0
//                                                     ? "text-green-600 font-bold"
//                                                     : leg.CE.deltaOI < 0
//                                                         ? "text-red-600 font-bold"
//                                                         : ""
//                                                 : ""
//                                             }`}
//                                     >
//                                         {leg.CE?.deltaOI !== undefined ? leg.CE.deltaOI : "-"}
//                                     </td>
//                                     <td className="p-1 border font-mono">{leg.CE?.closePrice?.toFixed(2) ?? "-"}</td>
//                                     <td
//                                         className={`p-1 border font-mono ${leg.CE?.deltaPremium !== undefined
//                                                 ? leg.CE.deltaPremium > 0
//                                                     ? "text-green-600 font-bold"
//                                                     : leg.CE.deltaPremium < 0
//                                                         ? "text-red-600 font-bold"
//                                                         : ""
//                                                 : ""
//                                             }`}
//                                     >
//                                         {leg.CE?.deltaPremium !== undefined ? leg.CE.deltaPremium.toFixed(2) : "-"}
//                                     </td>

//                                     <td className="p-1 border font-mono">{leg.PE?.closePrice?.toFixed(2) ?? "-"}</td>
//                                     <td
//                                         className={`p-1 border font-mono ${leg.PE?.deltaPremium !== undefined
//                                                 ? leg.PE.deltaPremium > 0
//                                                     ? "text-green-600 font-bold"
//                                                     : leg.PE.deltaPremium < 0
//                                                         ? "text-red-600 font-bold"
//                                                         : ""
//                                                 : ""
//                                             }`}
//                                     >
//                                         {leg.PE?.deltaPremium !== undefined ? leg.PE.deltaPremium.toFixed(2) : "-"}
//                                     </td>
//                                     <td className="p-1 border font-mono">{leg.PE?.openInt ?? "-"}</td>
//                                     <td
//                                         className={`p-1 border font-mono ${leg.PE?.deltaOI !== undefined
//                                                 ? leg.PE.deltaOI > 0
//                                                     ? "text-green-600 font-bold"
//                                                     : leg.PE.deltaOI < 0
//                                                         ? "text-red-600 font-bold"
//                                                         : ""
//                                                 : ""
//                                             }`}
//                                     >
//                                         {leg.PE?.deltaOI !== undefined ? leg.PE.deltaOI : "-"}
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                     <div className="px-2 py-1 text-xs text-gray-600">
//                         Delta columns show Change in Open Interest (ΔOI) and Premium from previous day.
//                         Green = Increase, Red = Decrease.
//                     </div>
//                 </div>
//             )}
//         </section>
//     );
// };

// export default OptionChainView;


import React, { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Calendar, Target, Info, TrendingUp, TrendingDown } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import OptionMetrics from './OptionMetrics';
import type {
    OptionChainWithDeltas,
    OptionChainLegWithDeltas,
    OptionRowWithDeltas,
} from "../types";
import {
    fetchExpiryDates,
    fetchAvailableOptionDates,
    fetchOptionChain,
} from "../api";
import DateRangePicker from "./DateRangePicker";

interface OptionChainProps {
    symbol: string;
}

/** Determine ITM/ATM/OTM strike relation to ATM strike */
function getOptionMoneyness(strike: number, atmStrike: number, optType: "CE" | "PE") {
    if (strike === atmStrike) return "ATM";
    if (optType === "CE") return strike < atmStrike ? "ITM" : "OTM";
    else return strike > atmStrike ? "ITM" : "OTM";
}

/** Map moneyness to background color classes */
const moneynessBg = {
    ATM: "bg-yellow-100",
    ITM: "bg-green-100",
    OTM: "bg-gray-50",
};

/** Color grades for OI change bars */
function oiChangeColor(delta: number): string {
    if (delta > 1000) return "bg-green-600";
    if (delta > 500) return "bg-green-400";
    if (delta > 0) return "bg-green-200";
    if (delta < -1000) return "bg-red-600";
    if (delta < -500) return "bg-red-400";
    if (delta < 0) return "bg-red-200";
    return "bg-transparent";
}

/** Width of bar based on absolute OI change scaled relative to max delta */
function oiChangeBarWidth(delta: number, maxDelta: number, maxWidth = 60) {
    if (!maxDelta) return 0;
    return Math.min((Math.abs(delta) / maxDelta) * maxWidth, maxWidth);
}

const OptionChain: React.FC<OptionChainProps> = ({ symbol }) => {
    // States for expiry & dates
    const [expiries, setExpiries] = useState<string[]>([]);
    const [selectedExpiryIndex, setSelectedExpiryIndex] = useState(0);

    const [availableDates, setAvailableDates] = useState<string[]>([]);
    const [dateFrom, setDateFrom] = useState<string | null>(null);
    const [dateTo, setDateTo] = useState<string | null>(null);

    const [selectedDateIndex, setSelectedDateIndex] = useState(0);

    const [optionChain, setOptionChain] = useState<OptionChainWithDeltas | null>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load expiries when symbol changes
    useEffect(() => {
        setLoading(true);
        setError(null);
        fetchExpiryDates(symbol)
            .then((exps) => {
                setExpiries(exps);
                setSelectedExpiryIndex(0);
            })
            .catch(() => setError("Failed to load expiry dates"))
            .finally(() => setLoading(false));
    }, [symbol]);

    // Load available option file dates on mount or symbol changes
    useEffect(() => {
        fetchAvailableOptionDates()
            .then((dates) => {
                // Sort the dates ascending (string DDMMYYYY to Date)
                const sortedDates = [...dates].sort((a, b) => {
                    const da = new Date(
                        +a.slice(4, 8), +a.slice(2, 4) - 1, +a.slice(0, 2)
                    );
                    const db = new Date(
                        +b.slice(4, 8), +b.slice(2, 4) - 1, +b.slice(0, 2)
                    );
                    return da.getTime() - db.getTime();
                });
                setAvailableDates(sortedDates);

                // Reset date range if none set
                if (!dateFrom || !dateTo) {
                    setDateFrom(sortedDates[0]);
                    setDateTo(sortedDates[sortedDates.length - 1]);
                    setSelectedDateIndex(0);
                }
            })
            .catch(() => setError("Failed to load available option dates."));
    }, [symbol]);

    // Filter dates within the user selected range and ensure sorted properly
    const filteredDates = useMemo(() => {
        if (!dateFrom || !dateTo) return [];
        const startIdx = availableDates.indexOf(dateFrom);
        const endIdx = availableDates.indexOf(dateTo);
        if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) return [];
        return availableDates.slice(startIdx, endIdx + 1);
    }, [availableDates, dateFrom, dateTo]);

    // Ensure selectedDateIndex stays within filteredDates
    useEffect(() => {
        if (selectedDateIndex >= filteredDates.length) {
            setSelectedDateIndex(filteredDates.length - 1);
        }
        if (selectedDateIndex < 0) setSelectedDateIndex(0);
    }, [filteredDates, selectedDateIndex]);

    // Selected date for options data
    const selectedDate = filteredDates[selectedDateIndex] || null;

    // Previous date for delta computations (previous day in filtered dates)
    const previousDate = selectedDateIndex > 0 ? filteredDates[selectedDateIndex - 1] : undefined;

    // Load option chain data when dependencies change
    useEffect(() => {
        if (!selectedDate || expiries.length === 0) {
            setOptionChain(null);
            return;
        }

        setLoading(true);
        setError(null);

        fetchOptionChain(symbol, expiries[selectedExpiryIndex], [selectedDate], previousDate)
            .then((chain) => setOptionChain(chain))
            .catch(() => {
                setOptionChain(null);
                setError("Failed to load option chain data.");
            })
            .finally(() => setLoading(false));
    }, [symbol, expiries, selectedExpiryIndex, selectedDate, previousDate]);

    // Approximate ATM strike as the strike closest to underlying price.
    // Since underlying price is not supplied, use the ATM strike from the chain where CE and PE close prices are near equal or select the middle strike.
    const atmStrike = useMemo(() => {
        if (!optionChain || optionChain.strikes.length === 0) return null;

        // Find strike with minimum abs(closePrice CE - closePrice PE), fallback to middle strike
        let minDiff = Number.MAX_SAFE_INTEGER;
        let atm = optionChain.strikes[Math.floor(optionChain.strikes.length / 2)].strPrice;
        for (const leg of optionChain.strikes) {
            if (leg.CE && leg.PE) {
                const diff = Math.abs(leg.CE.closePrice - leg.PE.closePrice);
                if (diff < minDiff) {
                    minDiff = diff;
                    atm = leg.strPrice;
                }
            }
        }
        return atm;
    }, [optionChain]);

    // Calculate max absolute OI delta for scale bars - CE and PE separately over all strikes
    const maxOiDelta = useMemo(() => {
        if (!optionChain) return 0;
        let maxDelta = 0;
        for (const leg of optionChain.strikes) {
            if (leg.CE?.deltaOI) maxDelta = Math.max(maxDelta, Math.abs(leg.CE.deltaOI));
            if (leg.PE?.deltaOI) maxDelta = Math.max(maxDelta, Math.abs(leg.PE.deltaOI));
        }
        return maxDelta;
    }, [optionChain]);

    // Navigation handlers
    const prevDay = () => {
        setSelectedDateIndex((idx) => Math.max(0, idx - 1));
    };

    const nextDay = () => {
        setSelectedDateIndex((idx) => Math.min(filteredDates.length - 1, idx + 1));
    };

    return (
        <section className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                                <Target className="w-8 h-8 mr-3 text-blue-600" />
                                Option Chain Analysis
                            </h2>
                            <p className="text-gray-600 mt-1">
                                {symbol} • Expiry: {expiries[selectedExpiryIndex] ?? "N/A"}
                            </p>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Info className="w-4 h-4" />
                            <span>Real-time option chain data</span>
                        </div>
                    </div>

                    {/* Controls Row */}
                    <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-center space-x-3">
                            <label htmlFor="expirySelect" className="text-sm font-medium text-gray-700">
                                Expiry Date:
                            </label>
                            <select
                                id="expirySelect"
                                className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={expiries[selectedExpiryIndex] || ""}
                                onChange={(e) => {
                                    const idx = expiries.indexOf(e.target.value);
                                    if (idx >= 0) {
                                        setSelectedExpiryIndex(idx);
                                        setSelectedDateIndex(0);
                                    }
                                }}
                            >
                                {expiries.map((exp) => (
                                    <option key={exp} value={exp}>
                                        {exp}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Date Range Picker */}
                <DateRangePicker
                    dates={availableDates}
                    dateFrom={dateFrom}
                    dateTo={dateTo}
                    setDateFrom={setDateFrom}
                    setDateTo={setDateTo}
                />

                {/* Day Navigation */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={prevDay}
                            disabled={selectedDateIndex === 0 || loading}
                            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            <span>Previous Day</span>
                        </button>
                        
                        <div className="flex items-center space-x-3">
                            <Calendar className="w-5 h-5 text-gray-600" />
                            <div className="text-center">
                                <div className="text-lg font-bold text-gray-900">
                                    {selectedDate ? new Date(
                                        parseInt(selectedDate.slice(4, 8)), 
                                        parseInt(selectedDate.slice(2, 4)) - 1, 
                                        parseInt(selectedDate.slice(0, 2))
                                    ).toLocaleDateString('en-IN', { 
                                        weekday: 'long', 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    }) : 'N/A'}
                                </div>
                                {previousDate && (
                                    <div className="text-sm text-gray-500">
                                        Compared to {new Date(
                                            parseInt(previousDate.slice(4, 8)), 
                                            parseInt(previousDate.slice(2, 4)) - 1, 
                                            parseInt(previousDate.slice(0, 2))
                                        ).toLocaleDateString('en-IN')}
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <button
                            onClick={nextDay}
                            disabled={selectedDateIndex >= filteredDates.length - 1 || filteredDates.length === 0 || loading}
                            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                        >
                            <span>Next Day</span>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Option Metrics */}
                <OptionMetrics optionChain={optionChain} />

                {/* Loading and Error States */}
                {loading && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <LoadingSpinner size="lg" />
                            <p className="text-gray-600 font-medium">Loading option chain data...</p>
                        </div>
                    </div>
                )}
                
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                <Info className="w-4 h-4 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-red-800 font-semibold">Error Loading Data</h3>
                                <p className="text-red-600">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Option Chain Table */}
                {optionChain && !loading && !error && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[1000px] border-collapse text-sm">
                                <thead>
                                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                        {/* PE Headers */}
                                        <th className="p-4 text-left font-semibold text-gray-700 border-r border-gray-200">
                                            <div className="flex items-center space-x-2">
                                                <TrendingDown className="w-4 h-4 text-red-500" />
                                                <span>PE OI</span>
                                            </div>
                                        </th>
                                        <th className="p-4 text-left font-semibold text-gray-700 border-r border-gray-200">
                                            PE ΔOI
                                        </th>
                                        <th className="p-4 text-left font-semibold text-gray-700 border-r border-gray-200">
                                            PE Premium
                                        </th>

                                        {/* Strike Header */}
                                        <th className="p-4 text-center font-bold text-lg text-gray-900 bg-yellow-50 border-x-2 border-yellow-200 sticky left-0 z-10 shadow-sm">
                                            <div className="flex items-center justify-center space-x-2">
                                                <Target className="w-5 h-5 text-yellow-600" />
                                                <span>Strike Price</span>
                                            </div>
                                        </th>

                                        {/* CE Headers */}
                                        <th className="p-4 text-left font-semibold text-gray-700 border-l border-gray-200">
                                            CE Premium
                                        </th>
                                        <th className="p-4 text-left font-semibold text-gray-700 border-l border-gray-200">
                                            CE ΔOI
                                        </th>
                                        <th className="p-4 text-left font-semibold text-gray-700 border-l border-gray-200">
                                            <div className="flex items-center space-x-2">
                                                <TrendingUp className="w-4 h-4 text-green-500" />
                                                <span>CE OI</span>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {optionChain.strikes.map((leg: OptionChainLegWithDeltas, index) => {
                                        const atm = atmStrike ?? 0;
                                        const ceMoneyness = leg.CE ? getOptionMoneyness(leg.strPrice, atm, "CE") : null;
                                        const peMoneyness = leg.PE ? getOptionMoneyness(leg.strPrice, atm, "PE") : null;

                                        const ceBg = ceMoneyness ? moneynessBg[ceMoneyness] : "bg-gray-50";
                                        const peBg = peMoneyness ? moneynessBg[peMoneyness] : "bg-gray-50";

                                        const ceDeltaOI = leg.CE?.deltaOI ?? 0;
                                        const peDeltaOI = leg.PE?.deltaOI ?? 0;
                                        const maxDelta = maxOiDelta || 1;

                                        const ceBarWidth = oiChangeBarWidth(ceDeltaOI, maxDelta);
                                        const peBarWidth = oiChangeBarWidth(peDeltaOI, maxDelta);
                                        const ceBarColor = oiChangeColor(ceDeltaOI);
                                        const peBarColor = oiChangeColor(peDeltaOI);

                                        return (
                                            <tr
                                                key={leg.strPrice}
                                                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                                                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                                                }`}
                                            >
                                                {/* PE Side */}
                                                <td className={`p-3 font-mono text-right ${peBg} border-r border-gray-200`}>
                                                    <span className="font-semibold">
                                                        {leg.PE?.openInt ? leg.PE.openInt.toLocaleString() : "-"}
                                                    </span>
                                                </td>
                                                <td className="p-3 font-mono relative border-r border-gray-200">
                                                    <div
                                                        className={`absolute inset-y-0 left-0 rounded-r ${peBarColor} opacity-30`}
                                                        style={{ width: `${peBarWidth}px` }}
                                                    />
                                                    <div className="relative z-10 flex items-center justify-between">
                                                        <span className={`font-semibold ${
                                                            peDeltaOI > 0 ? 'text-green-600' : peDeltaOI < 0 ? 'text-red-600' : 'text-gray-500'
                                                        }`}>
                                                            {peDeltaOI !== 0 ? (peDeltaOI > 0 ? `+${peDeltaOI}` : peDeltaOI) : "-"}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className={`p-3 font-mono text-right ${peBg} border-r border-gray-200`}>
                                                    <span className="font-semibold">
                                                        {leg.PE?.closePrice ? `₹${leg.PE.closePrice.toFixed(2)}` : "-"}
                                                    </span>
                                                </td>

                                                {/* Strike Price */}
                                                <td className="p-3 text-center font-bold text-lg bg-yellow-50 border-x-2 border-yellow-200 sticky left-0 z-10 shadow-sm">
                                                    <div className={`inline-flex items-center justify-center px-3 py-1 rounded-lg ${
                                                        leg.strPrice === atm ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                        {leg.strPrice}
                                                    </div>
                                                    {leg.strPrice === atm && (
                                                        <div className="text-xs text-yellow-600 mt-1 font-medium">ATM</div>
                                                    )}
                                                </td>

                                                {/* CE Side */}
                                                <td className={`p-3 font-mono text-right ${ceBg} border-l border-gray-200`}>
                                                    <span className="font-semibold">
                                                        {leg.CE?.closePrice ? `₹${leg.CE.closePrice.toFixed(2)}` : "-"}
                                                    </span>
                                                </td>
                                                <td className="p-3 font-mono relative border-l border-gray-200">
                                                    <div
                                                        className={`absolute inset-y-0 left-0 rounded-r ${ceBarColor} opacity-30`}
                                                        style={{ width: `${ceBarWidth}px` }}
                                                    />
                                                    <div className="relative z-10 flex items-center justify-between">
                                                        <span className={`font-semibold ${
                                                            ceDeltaOI > 0 ? 'text-green-600' : ceDeltaOI < 0 ? 'text-red-600' : 'text-gray-500'
                                                        }`}>
                                                            {ceDeltaOI !== 0 ? (ceDeltaOI > 0 ? `+${ceDeltaOI}` : ceDeltaOI) : "-"}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className={`p-3 font-mono text-right ${ceBg} border-l border-gray-200`}>
                                                    <span className="font-semibold">
                                                        {leg.CE?.openInt ? leg.CE.openInt.toLocaleString() : "-"}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Legend */}
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 bg-yellow-100 rounded border border-yellow-300"></div>
                                    <span>ATM (At-The-Money)</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 bg-green-100 rounded border border-green-300"></div>
                                    <span>ITM (In-The-Money)</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 bg-gray-100 rounded border border-gray-300"></div>
                                    <span>OTM (Out-Of-The-Money)</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-3 bg-green-300 rounded"></div>
                                    <span>OI Buildup</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-3 bg-red-300 rounded"></div>
                                    <span>OI Unwinding</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default OptionChain;
