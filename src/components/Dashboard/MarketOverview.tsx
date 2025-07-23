import React from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { MarketData } from '../../types/trading';

interface MarketOverviewProps {
  data: MarketData[];
}

export function MarketOverview({ data }: MarketOverviewProps) {
  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Market Overview</h3>
        <Activity className="w-5 h-5 text-emerald-400" />
      </div>
      
      <div className="space-y-4">
        {data.map((item) => (
          <div
            key={item.symbol}
            className="flex items-center justify-between p-4 bg-gray-750 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {item.symbol.split('/')[0].substring(0, 2)}
                </span>
              </div>
              <div>
                <p className="font-medium text-white">{item.symbol}</p>
                <p className="text-sm text-gray-400">
                  Vol: {(item.volume / 1000000).toFixed(1)}M
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="font-semibold text-white">
                ${item.price.toLocaleString(undefined, { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}
              </p>
              <div className={`flex items-center space-x-1 ${
                item.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {item.changePercent >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">
                  {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}