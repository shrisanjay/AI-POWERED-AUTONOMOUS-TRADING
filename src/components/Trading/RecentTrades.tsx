import React from 'react';
import { Clock, CheckCircle, XCircle, Loader } from 'lucide-react';
import { format } from 'date-fns';
import { Trade } from '../../types/trading';

interface RecentTradesProps {
  trades: Trade[];
}

export function RecentTrades({ trades }: RecentTradesProps) {
  const getStatusIcon = (status: Trade['status']) => {
    switch (status) {
      case 'EXECUTED':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'FAILED':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'PENDING':
        return <Loader className="w-4 h-4 text-amber-400 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: Trade['status']) => {
    switch (status) {
      case 'EXECUTED':
        return 'text-emerald-400';
      case 'FAILED':
        return 'text-red-400';
      case 'PENDING':
        return 'text-amber-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Recent Trades</h3>
      
      <div className="space-y-4">
        {trades.map((trade) => (
          <div
            key={trade.id}
            className="flex items-center justify-between p-4 bg-gray-750 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center space-x-4">
              {getStatusIcon(trade.status)}
              <div>
                <div className="flex items-center space-x-2">
                  <span className={`font-medium text-sm px-2 py-1 rounded ${
                    trade.type === 'BUY' 
                      ? 'bg-emerald-600/20 text-emerald-400' 
                      : 'bg-red-600/20 text-red-400'
                  }`}>
                    {trade.type}
                  </span>
                  <span className="font-medium text-white">{trade.symbol}</span>
                </div>
                <p className="text-sm text-gray-400">
                  {trade.quantity} @ ${trade.price.toLocaleString()}
                </p>
                {trade.strategy && (
                  <p className="text-xs text-blue-400">{trade.strategy}</p>
                )}
              </div>
            </div>
            
            <div className="text-right">
              <p className={`text-sm font-medium ${getStatusColor(trade.status)}`}>
                {trade.status}
              </p>
              <p className="text-xs text-gray-400">
                {format(new Date(trade.timestamp), 'HH:mm:ss')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}