import React from "react";
import { Building2, TrendingUp, BarChart3 } from 'lucide-react';

interface SidebarProps {
    sectors: string[];
    selectedSector: string | null;
    onSelectSector: (sector: string) => void;
}
const Sidebar: React.FC<SidebarProps> = ({ sectors, selectedSector, onSelectSector }) => {
    const mainEntries = ["NIFTY", "BANKNIFTY"];
    const rest = sectors.filter(s => !mainEntries.includes(s));
    
    return (
        <aside className="w-64 h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col shadow-2xl border-r border-slate-700">
            <div className="p-6 border-b border-slate-700">
                <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-blue-600 rounded-lg">
                        <BarChart3 className="w-5 h-5" />
                    </div>
                    <h1 className="text-xl font-bold">Market Sectors</h1>
                </div>
                <p className="text-sm text-slate-400">Select sector to analyze</p>
            </div>
            
            <nav className="flex-1 p-4">
                <div className="space-y-2">
                    <div className="mb-4">
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center">
                            <TrendingUp className="w-3 h-3 mr-2" />
                            Indices
                        </h3>
                        <ul className="space-y-1">
                            {mainEntries.map((sector) => (
                                <li key={sector}>
                                    <button
                                        className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center space-x-3 group ${
                                            selectedSector === sector 
                                                ? "bg-blue-600 text-white shadow-lg transform scale-[1.02]" 
                                                : "hover:bg-slate-700 hover:text-blue-200 text-slate-300"
                                        }`}
                                        onClick={() => onSelectSector(sector)}
                                    >
                                        <div className={`w-2 h-2 rounded-full ${
                                            selectedSector === sector ? 'bg-white' : 'bg-slate-500 group-hover:bg-blue-400'
                                        }`} />
                                        <span className="font-medium">{sector}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    <div>
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center">
                            <Building2 className="w-3 h-3 mr-2" />
                            Sectors
                        </h3>
                        <ul className="space-y-1">
                            {rest.map((sector) => (
                                <li key={sector}>
                                    <button
                                        className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center space-x-3 group ${
                                            selectedSector === sector
                                                ? "bg-blue-600 text-white shadow-lg transform scale-[1.02]"
                                                : "hover:bg-slate-700 hover:text-blue-200 text-slate-300"
                                        }`}
                                        onClick={() => onSelectSector(sector)}
                                    >
                                        <div className={`w-2 h-2 rounded-full ${
                                            selectedSector === sector ? 'bg-white' : 'bg-slate-500 group-hover:bg-blue-400'
                                        }`} />
                                        <span className="font-medium text-sm">{sector.replace('Nifty ', '')}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </h1>
            
            <div className="p-4 border-t border-slate-700">
                <div className="text-xs text-slate-400 text-center">
                    <p>NSE Data Analytics</p>
                    <p className="mt-1">Professional Edition</p>
                </div>
            </div>
        </aside>
    );
};
export default Sidebar;
