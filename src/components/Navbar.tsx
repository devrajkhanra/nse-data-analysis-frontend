import React from "react";
import type { Nifty50Company } from "../types";

interface NavbarProps {
    stocks: Nifty50Company[];
    selectedStock: string | null;
    onSelectStock: (stock: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ stocks, selectedStock, onSelectStock }) => (
    <nav className="bg-white border-b shadow-sm flex gap-2 px-6 py-2 overflow-x-auto">
        {stocks.map((stock) => (
            <button
                key={stock.symbol}
                onClick={() => onSelectStock(stock.symbol)}
                className={`text-sm px-4 py-2 rounded-full border font-semibold transition-all
           ${stock.symbol === selectedStock ? "bg-gradient-to-r from-blue-800 to-sky-600 text-white border-blue-800" : "bg-gray-50 hover:bg-blue-50 text-gray-800 border-gray-200"}`}
                aria-current={stock.symbol === selectedStock}
                title={stock.companyName}
            >
                {stock.symbol}
            </button>
        ))}
    </nav>
);
export default Navbar;
