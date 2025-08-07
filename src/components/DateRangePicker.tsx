import React from "react";
import { Calendar, ChevronDown } from 'lucide-react';

interface DateRangePickerProps {
    dates: string[];
    dateFrom: string | null;
    dateTo: string | null;
    setDateFrom: (date: string) => void;
    setDateTo: (date: string) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
    dates,
    dateFrom,
    dateTo,
    setDateFrom,
    setDateTo,
}) => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center space-x-2 mb-3">
                <Calendar className="w-4 h-4 text-gray-600" />
                <h3 className="text-sm font-semibold text-gray-700">Date Range Selection</h3>
            </div>
            
            <div className="flex items-center space-x-4">
                <div className="flex-1">
                    <label htmlFor="dateFrom" className="block text-xs font-medium text-gray-600 mb-1">
                        From Date
                    </label>
                    <div className="relative">
                        <select
                            id="dateFrom"
                            className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={dateFrom || ""}
                            onChange={(e) => setDateFrom(e.target.value)}
                        >
                            <option value="">Select start date</option>
                            {dates.map((d) => (
                                <option key={d} value={d} disabled={dateTo ? d > dateTo : false}>
                                    {new Date(
                                        parseInt(d.slice(4, 8)), 
                                        parseInt(d.slice(2, 4)) - 1, 
                                        parseInt(d.slice(0, 2))
                                    ).toLocaleDateString('en-IN')}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                <div className="flex-1">
                    <label htmlFor="dateTo" className="block text-xs font-medium text-gray-600 mb-1">
                        To Date
                    </label>
                    <div className="relative">
                        <select
                            id="dateTo"
                            className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={dateTo || ""}
                            onChange={(e) => setDateTo(e.target.value)}
                        >
                            <option value="">Select end date</option>
                            {dates.map((d) => (
                                <option key={d} value={d} disabled={dateFrom ? d < dateFrom : false}>
                                    {new Date(
                                        parseInt(d.slice(4, 8)), 
                                        parseInt(d.slice(2, 4)) - 1, 
                                        parseInt(d.slice(0, 2))
                                    ).toLocaleDateString('en-IN')}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DateRangePicker;
