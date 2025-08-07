import React from 'react';
import { BarChart3, Calendar, TrendingUp } from 'lucide-react';

interface HeaderProps {
  selectedStock: string | null;
  selectedSector: string | null;
}

const Header: React.FC<HeaderProps> = ({ selectedStock, selectedSector }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">NSE Analytics</h1>
              <p className="text-sm text-gray-500">Professional Options Analysis</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <TrendingUp className="w-4 h-4" />
            <span>Live Market Data</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{new Date().toLocaleDateString('en-IN')}</span>
          </div>
          
          {selectedStock && selectedSector && (
            <div className="bg-blue-50 px-3 py-1 rounded-full">
              <span className="text-sm font-medium text-blue-700">
                {selectedSector} → {selectedStock}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;