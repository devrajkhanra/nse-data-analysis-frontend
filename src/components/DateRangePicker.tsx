import React from "react";

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
        <div className="flex items-center space-x-3 text-gray-900 font-semibold">
            <label htmlFor="dateFrom">From:</label>
            <select
                id="dateFrom"
                className="border rounded px-2 py-1"
                value={dateFrom || ""}
                onChange={(e) => setDateFrom(e.target.value)}
            >
                <option value="">Select</option>
                {dates.map((d) => (
                    <option key={d} value={d} disabled={dateTo ? d > dateTo : false}>
                        {d}
                    </option>
                ))}
            </select>

            <label htmlFor="dateTo">To:</label>
            <select
                id="dateTo"
                className="border rounded px-2 py-1"
                value={dateTo || ""}
                onChange={(e) => setDateTo(e.target.value)}
            >
                <option value="">Select</option>
                {dates.map((d) => (
                    <option key={d} value={d} disabled={dateFrom ? d < dateFrom : false}>
                        {d}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default DateRangePicker;
