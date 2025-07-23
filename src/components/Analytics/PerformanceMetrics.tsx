import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

const portfolioAllocation = [
  { name: 'Crypto', value: 45, color: '#3B82F6' },
  { name: 'Stocks', value: 35, color: '#10B981' },
  { name: 'Cash', value: 20, color: '#F59E0B' }
];

const performanceData = [
  { month: 'Jan', return: 8.2, benchmark: 5.1 },
  { month: 'Feb', return: 12.5, benchmark: 7.8 },
  { month: 'Mar', return: -3.1, benchmark: -1.2 },
  { month: 'Apr', return: 15.7, benchmark: 9.3 },
  { month: 'May', return: 9.8, benchmark: 6.5 },
  { month: 'Jun', return: 18.2, benchmark: 11.7 }
];

export function PerformanceMetrics() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Portfolio Allocation */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Portfolio Allocation</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={portfolioAllocation}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {portfolioAllocation.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${value}%`, 'Allocation']}
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 space-y-2">
          {portfolioAllocation.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-300">{item.name}</span>
              </div>
              <span className="text-sm font-medium text-white">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Performance vs Benchmark */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Performance vs Benchmark</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
            <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={(value) => `${value}%`} />
            <Tooltip
              formatter={(value) => [`${value}%`, '']}
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
            />
            <Bar dataKey="return" fill="#10B981" name="Portfolio" radius={[2, 2, 0, 0]} />
            <Bar dataKey="benchmark" fill="#6B7280" name="Benchmark" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}