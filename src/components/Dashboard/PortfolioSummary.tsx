import React from 'react';
import { Wallet, TrendingUp, DollarSign, Target } from 'lucide-react';
import { Portfolio } from '../../types/trading';

interface PortfolioSummaryProps {
  portfolio: Portfolio;
}

export function PortfolioSummary({ portfolio }: PortfolioSummaryProps) {
  const metrics = [
    {
      label: 'Total Value',
      value: `$${portfolio.totalValue.toLocaleString()}`,
      icon: Wallet,
      color: 'text-blue-400'
    },
    {
      label: 'Total P&L',
      value: `$${portfolio.totalPnL.toLocaleString()}`,
      icon: TrendingUp,
      color: portfolio.totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400'
    },
    {
      label: 'P&L %',
      value: `${portfolio.totalPnLPercent >= 0 ? '+' : ''}${portfolio.totalPnLPercent.toFixed(2)}%`,
      icon: Target,
      color: portfolio.totalPnLPercent >= 0 ? 'text-emerald-400' : 'text-red-400'
    },
    {
      label: 'Available Cash',
      value: `$${portfolio.availableCash.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-amber-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <div
            key={metric.label}
            className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-all duration-200 hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <Icon className={`w-6 h-6 ${metric.color}`} />
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            </div>
            <p className="text-sm text-gray-400 mb-1">{metric.label}</p>
            <p className={`text-2xl font-bold ${metric.color}`}>
              {metric.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}