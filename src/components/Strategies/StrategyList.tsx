import React from 'react';
import { Play, Pause, Square, BarChart3, Target, TrendingUp, AlertTriangle } from 'lucide-react';
import { TradingStrategy } from '../../types/trading';

interface StrategyListProps {
  strategies: TradingStrategy[];
}

export function StrategyList({ strategies }: StrategyListProps) {
  const getStatusIcon = (status: TradingStrategy['status']) => {
    switch (status) {
      case 'ACTIVE':
        return <Play className="w-4 h-4 text-emerald-400" />;
      case 'PAUSED':
        return <Pause className="w-4 h-4 text-amber-400" />;
      case 'STOPPED':
        return <Square className="w-4 h-4 text-red-400" />;
    }
  };

  const getStatusColor = (status: TradingStrategy['status']) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-emerald-600/20 text-emerald-400';
      case 'PAUSED':
        return 'bg-amber-600/20 text-amber-400';
      case 'STOPPED':
        return 'bg-red-600/20 text-red-400';
    }
  };

  return (
    <div className="space-y-6">
      {strategies.map((strategy) => (
        <div
          key={strategy.id}
          className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {getStatusIcon(strategy.status)}
              <div>
                <h3 className="text-lg font-semibold text-white">{strategy.name}</h3>
                <p className="text-sm text-gray-400">{strategy.description}</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getStatusColor(strategy.status)}`}>
              {strategy.status}
            </span>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-4 h-4 text-emerald-400 mr-1" />
                <span className="text-xs text-gray-400">Return</span>
              </div>
              <p className="text-lg font-bold text-emerald-400">
                +{strategy.performance.totalReturn}%
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Target className="w-4 h-4 text-blue-400 mr-1" />
                <span className="text-xs text-gray-400">Win Rate</span>
              </div>
              <p className="text-lg font-bold text-blue-400">
                {strategy.performance.winRate}%
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <BarChart3 className="w-4 h-4 text-purple-400 mr-1" />
                <span className="text-xs text-gray-400">Sharpe</span>
              </div>
              <p className="text-lg font-bold text-purple-400">
                {strategy.performance.sharpeRatio}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <AlertTriangle className="w-4 h-4 text-red-400 mr-1" />
                <span className="text-xs text-gray-400">Max DD</span>
              </div>
              <p className="text-lg font-bold text-red-400">
                {strategy.performance.maxDrawdown}%
              </p>
            </div>
          </div>

          {/* Backtest Results */}
          <div className="bg-gray-750 rounded-lg p-4">
            <h4 className="text-sm font-medium text-white mb-3">Backtest Results</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Accuracy</p>
                <p className="font-semibold text-white">{strategy.backtestResults.accuracy}%</p>
              </div>
              <div>
                <p className="text-gray-400">Total Trades</p>
                <p className="font-semibold text-white">{strategy.backtestResults.totalTrades}</p>
              </div>
              <div>
                <p className="text-gray-400">Profitable</p>
                <p className="font-semibold text-emerald-400">{strategy.backtestResults.profitableTrades}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}