import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { format } from 'date-fns';
import { ChartDataPoint } from '../../types/trading';

interface TradingChartProps {
  data: ChartDataPoint[];
  height?: number;
}

export function TradingChart({ data, height = 400 }: TradingChartProps) {
  const formatTooltip = (value: any, name: string) => {
    if (name === 'close') {
      return [`$${value.toLocaleString()}`, 'Price'];
    }
    return [value, name];
  };

  const formatXAxis = (tickItem: any) => {
    return format(new Date(tickItem), 'MMM dd');
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Price Chart</h3>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-xs font-medium bg-emerald-600 text-white rounded-lg">
            1D
          </button>
          <button className="px-3 py-1 text-xs font-medium text-gray-400 hover:text-white transition-colors">
            7D
          </button>
          <button className="px-3 py-1 text-xs font-medium text-gray-400 hover:text-white transition-colors">
            30D
          </button>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="timestamp"
            tickFormatter={formatXAxis}
            stroke="#9CA3AF"
            fontSize={12}
          />
          <YAxis 
            stroke="#9CA3AF"
            fontSize={12}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip
            formatter={formatTooltip}
            labelFormatter={(label) => format(new Date(label), 'MMM dd, yyyy HH:mm')}
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#F9FAFB'
            }}
          />
          <Area
            type="monotone"
            dataKey="close"
            stroke="#10B981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorPrice)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}