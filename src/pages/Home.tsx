import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import OptionChainView from "../components/OptionChain";
import { fetchMainSectors, fetchStocksBySector } from "../api";
import type { Nifty50Company } from "../types";

const Home: React.FC = () => {
    const [sectors, setSectors] = useState<string[]>([]);
    const [selectedSector, setSelectedSector] = useState<string | null>(null);
    const [stocks, setStocks] = useState<Nifty50Company[]>([]);
    const [selectedStock, setSelectedStock] = useState<string | null>(null);

    useEffect(() => {
        fetchMainSectors().then((list) => {
            setSectors(list);
            // Default to NIFTY for the "main" initial view
            setSelectedSector("NIFTY");
        });
    }, []);

    useEffect(() => {
        if (!selectedSector) return;
        fetchStocksBySector(selectedSector).then((stkList) => {
            setStocks(stkList);
            setSelectedStock(stkList.length ? stkList[0].symbol : null);
        });
    }, [selectedSector]);

    return (
        <div className="flex w-full min-h-screen bg-gradient-to-tr from-gray-100 to-gray-300 text-gray-900">
            <Sidebar sectors={sectors} selectedSector={selectedSector} onSelectSector={setSelectedSector} />
            <main className="flex-grow flex flex-col">
                <Navbar
                    stocks={stocks}
                    selectedStock={selectedStock}
                    onSelectStock={setSelectedStock}
                />
                <div className="flex-grow">
                    {selectedStock ? (
                        <OptionChainView symbol={selectedStock} />
                    ) : (
                        <div className="text-center text-gray-600 text-lg mt-32">
                            Please select a stock or index from the sidebar.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};
export default Home;
