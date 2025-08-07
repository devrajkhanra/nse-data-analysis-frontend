import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import OptionChainView from "../components/OptionChain";
import LoadingSpinner from "../components/LoadingSpinner";
import { fetchMainSectors, fetchStocksBySector } from "../api";
import type { Nifty50Company } from "../types";

const Home: React.FC = () => {
    const [sectors, setSectors] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSector, setSelectedSector] = useState<string | null>(null);
    const [stocks, setStocks] = useState<Nifty50Company[]>([]);
    const [selectedStock, setSelectedStock] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        fetchMainSectors().then((list) => {
            setSectors(list);
            // Default to NIFTY for the "main" initial view
            setSelectedSector("NIFTY");
        }).finally(() => {
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        if (!selectedSector) return;
        fetchStocksBySector(selectedSector).then((stkList) => {
            setStocks(stkList);
            setSelectedStock(stkList.length ? stkList[0].symbol : null);
        });
    }, [selectedSector]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <LoadingSpinner size="lg" className="mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Loading NSE Analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex w-full min-h-screen bg-gray-50 text-gray-900">
            <Sidebar sectors={sectors} selectedSector={selectedSector} onSelectSector={setSelectedSector} />
            <main className="flex-1 flex flex-col">
                <Header selectedStock={selectedStock} selectedSector={selectedSector} />
                <Navbar
                    stocks={stocks}
                    selectedStock={selectedStock}
                    onSelectStock={setSelectedStock}
                />
                <div className="flex-1">
                    {selectedStock ? (
                        <OptionChainView symbol={selectedStock} />
                    ) : (
                        <div className="flex items-center justify-center h-full bg-gray-50">
                            <div className="text-center p-8">
                                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">Welcome to NSE Analytics</h3>
                                <p className="text-gray-500 mb-4">Select a sector from the sidebar to begin analyzing option chains</p>
                                <div className="text-sm text-gray-400">
                                    Professional-grade options analysis platform
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};
export default Home;
