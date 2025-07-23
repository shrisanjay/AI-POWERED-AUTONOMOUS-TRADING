import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Position } from '../../types/trading';

interface PositionsListProps {
  positions: Position[];
}

export function PositionsList({ positions }: PositionsListProps) {
  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Active Positions</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Symbol</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Quantity</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Avg Price</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Current Price</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">P&L</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Market Value</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((position) => (
              <tr key={position.id} className="border-b border-gray-750 hover:bg-gray-750 transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-xs">
                        {position.symbol.split('/')[0].substring(0, 2)}
                      </span>
                    </div>
                    <span className="font-medium text-white">{position.symbol}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-right text-white">
                  {position.quantity}
                </td>
                <td className="py-4 px-4 text-right text-white">
                  ${position.averagePrice.toLocaleString()}
                </td>
                <td className="py-4 px-4 text-right text-white">
                  ${position.currentPrice.toLocaleString()}
                </td>
                <td className="py-4 px-4 text-right">
                  <div className={`flex items-center justify-end space-x-1 ${
                    position.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {position.pnl >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <div className="text-right">
                      <p className="font-medium">
                        ${Math.abs(position.pnl).toLocaleString()}
                      </p>
                      <p className="text-sm">
                        ({position.pnlPercent >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%)
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-right text-white font-medium">
                  ${position.marketValue.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}