import React, { useMemo } from 'react';
import { Activity, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import MetricsCard from './MetricsCard';
import type { OptionChainWithDeltas } from '../types';

interface OptionMetricsProps {
  optionChain: OptionChainWithDeltas | null;
}

const OptionMetrics: React.FC<OptionMetricsProps> = ({ optionChain }) => {
  const metrics = useMemo(() => {
    if (!optionChain || !optionChain.strikes.length) {
      return {
        totalCEOI: 0,
        totalPEOI: 0,
        maxPain: 0,
        putCallRatio: 0,
        totalCEOIChange: 0,
        totalPEOIChange: 0
      };
    }

    let totalCEOI = 0;
    let totalPEOI = 0;
    let totalCEOIChange = 0;
    let totalPEOIChange = 0;
    let maxPainStrike = 0;
    let minPainValue = Number.MAX_SAFE_INTEGER;

    optionChain.strikes.forEach(strike => {
      const ceOI = strike.CE?.openInt || 0;
      const peOI = strike.PE?.openInt || 0;
      const ceOIChange = strike.CE?.deltaOI || 0;
      const peOIChange = strike.PE?.deltaOI || 0;

      totalCEOI += ceOI;
      totalPEOI += peOI;
      totalCEOIChange += ceOIChange;
      totalPEOIChange += peOIChange;

      // Max Pain calculation (simplified)
      const painValue = ceOI + peOI;
      if (painValue < minPainValue) {
        minPainValue = painValue;
        maxPainStrike = strike.strPrice;
      }
    });

    const putCallRatio = totalCEOI > 0 ? totalPEOI / totalCEOI : 0;

    return {
      totalCEOI,
      totalPEOI,
      maxPain: maxPainStrike,
      putCallRatio,
      totalCEOIChange,
      totalPEOIChange
    };
  }, [optionChain]);

  if (!optionChain) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      <MetricsCard
        title="Total CE OI"
        value={metrics.totalCEOI.toLocaleString()}
        change={metrics.totalCEOIChange}
        changeType={metrics.totalCEOIChange > 0 ? 'increase' : metrics.totalCEOIChange < 0 ? 'decrease' : 'neutral'}
        icon={<TrendingUp className="w-4 h-4" />}
        subtitle="Call Options"
      />
      
      <MetricsCard
        title="Total PE OI"
        value={metrics.totalPEOI.toLocaleString()}
        change={metrics.totalPEOIChange}
        changeType={metrics.totalPEOIChange > 0 ? 'increase' : metrics.totalPEOIChange < 0 ? 'decrease' : 'neutral'}
        icon={<TrendingDown className="w-4 h-4" />}
        subtitle="Put Options"
      />
      
      <MetricsCard
        title="Put/Call Ratio"
        value={metrics.putCallRatio.toFixed(2)}
        icon={<Activity className="w-4 h-4" />}
        subtitle="Market Sentiment"
      />
      
      <MetricsCard
        title="Max Pain"
        value={metrics.maxPain}
        icon={<DollarSign className="w-4 h-4" />}
        subtitle="Strike Price"
      />
      
      <MetricsCard
        title="CE Change"
        value={metrics.totalCEOIChange > 0 ? `+${metrics.totalCEOIChange.toLocaleString()}` : metrics.totalCEOIChange.toLocaleString()}
        changeType={metrics.totalCEOIChange > 0 ? 'increase' : metrics.totalCEOIChange < 0 ? 'decrease' : 'neutral'}
        subtitle="Daily Change"
      />
      
      <MetricsCard
        title="PE Change"
        value={metrics.totalPEOIChange > 0 ? `+${metrics.totalPEOIChange.toLocaleString()}` : metrics.totalPEOIChange.toLocaleString()}
        changeType={metrics.totalPEOIChange > 0 ? 'increase' : metrics.totalPEOIChange < 0 ? 'decrease' : 'neutral'}
        subtitle="Daily Change"
      />
    </div>
  );
};

export default OptionMetrics;