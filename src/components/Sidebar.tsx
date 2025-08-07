import React from "react";

interface SidebarProps {
    sectors: string[];
    selectedSector: string | null;
    onSelectSector: (sector: string) => void;
}
const Sidebar: React.FC<SidebarProps> = ({ sectors, selectedSector, onSelectSector }) => {
    const mainEntries = ["NIFTY", "BANKNIFTY"];
    const rest = sectors.filter(s => !mainEntries.includes(s));
    return (
        <aside className="w-60 h-screen bg-gradient-to-b from-[#1f232a] to-[#2d3546] text-white flex flex-col font-semibold shadow-lg">
            <h1 className="text-2xl tracking-wide mx-auto py-8 mb-4 font-bold drop-shadow">
                Sectors
            </h1>
            <nav>
                <ul className="space-y-2">
                    {mainEntries.map((sector) => (
                        <li key={sector}>
                            <button
                                className={`block w-full text-left px-6 py-3 rounded-lg transition-all ${selectedSector === sector ? "bg-blue-700 text-white shadow" : "hover:bg-blue-900/80 hover:text-blue-100"
                                    }`}
                                aria-current={selectedSector === sector}
                                onClick={() => onSelectSector(sector)}
                            >
                                {sector}
                            </button>
                        </li>
                    ))}
                    <hr className="my-2 opacity-50" />
                    {rest.map((sector) => (
                        <li key={sector}>
                            <button
                                className={`block w-full text-left px-6 py-3 rounded-lg transition-all ${selectedSector === sector
                                        ? "bg-blue-700 text-white shadow"
                                        : "hover:bg-blue-900/80 hover:text-blue-100"
                                    }`}
                                aria-current={selectedSector === sector}
                                onClick={() => onSelectSector(sector)}
                            >
                                {sector}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};
export default Sidebar;
