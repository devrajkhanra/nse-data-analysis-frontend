import React from "react";
import { Building } from 'lucide-react';
import type { Nifty50Company } from "../types";

interface NavbarProps {
    stocks: Nifty50Company[];
    selectedStock: string | null;
    onSelectStock: (stock: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ stocks, selectedStock, onSelectStock }) => {
    if (!stocks.length) {
        return (
            <nav className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-center text-gray-500">
                    <Building className="w-5 h-5 mr-2" />
                    <span>Select a sector to view stocks</span>
                </div>
            </nav>
        );
    }

    return (
        <nav className="bg-white border-b border-gray-200 shadow-sm">
            <div className="px-6 py-4">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-700 flex items-center">
                        <Building className="w-4 h-4 mr-2" />
                        Available Instruments ({stocks.length})
                    </h3>
                </div>
                
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {stocks.map((stock) => (
                        <button
                            key={stock.symbol}
                            onClick={() => onSelectStock(stock.symbol)}
                            className={`flex-shrink-0 px-4 py-2 rounded-lg border font-medium transition-all duration-200 hover:shadow-md group ${
                                stock.symbol === selectedStock 
                                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-600 shadow-lg transform scale-105" 
                                    : "bg-gray-50 hover:bg-blue-50 text-gray-700 border-gray-200 hover:border-blue-300"
                            }`}
                            title={`${stock.companyName} - ${stock.industry}`}
                        >
                            <div className="text-center">
                                <div className="text-sm font-bold">{stock.symbol}</div>
                                {stock.companyName && stock.companyName !== stock.symbol && (
                                    <div className={`text-xs mt-1 ${
                                        stock.symbol === selectedStock ? 'text-blue-100' : 'text-gray-500 group-hover:text-blue-600'
                                    }`}>
                                        {stock.companyName.length > 15 
                                            ? `${stock.companyName.substring(0, 15)}...` 
                                            : stock.companyName
                                        }
                                    </div>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
