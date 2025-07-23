import React, { useState } from 'react';
import { AuthForm } from './components/Auth/AuthForm';
import { Sidebar } from './components/Layout/Sidebar';
import { MarketOverview } from './components/Dashboard/MarketOverview';
import { PortfolioSummary } from './components/Dashboard/PortfolioSummary';
import { TradingChart } from './components/Charts/TradingChart';
import { RecentTrades } from './components/Trading/RecentTrades';
import { StrategyList } from './components/Strategies/StrategyList';
import { ChatAssistant } from './components/AI/ChatAssistant';
import { PositionsList } from './components/Portfolio/PositionsList';
import { PerformanceMetrics } from './components/Analytics/PerformanceMetrics';
import { useAuth } from './hooks/useAuth';
import { usePortfolio } from './hooks/usePortfolio';
import { useTrades } from './hooks/useTrades';
import { useStrategies } from './hooks/useStrategies';
import { useRealTimeData } from './hooks/useRealTimeData';
import { generateChartData } from './utils/mockData';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user, loading: authLoading } = useAuth();
  const { portfolio, loading: portfolioLoading } = usePortfolio(user?.id);
  const { trades, loading: tradesLoading } = useTrades(user?.id);
  const { strategies, loading: strategiesLoading } = useStrategies(user?.id);
  const marketData = useRealTimeData();
  const chartData = generateChartData(30);

  // Show loading screen while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-400">Loading TradeMind...</p>
        </div>
      </div>
    );
  }

  // Show auth form if not authenticated
  if (!user) {
    return <AuthForm onSuccess={() => window.location.reload()} />;
  }

  // Use mock data as fallback while loading
  const currentPortfolio = portfolio || {
    id: 'loading',
    totalValue: 0,
    totalPnL: 0,
    totalPnLPercent: 0,
    availableCash: 0,
    positions: []
  };

  const currentTrades = trades.length > 0 ? trades : [];
  const currentStrategies = strategies.length > 0 ? strategies : [];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <PortfolioSummary portfolio={currentPortfolio} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TradingChart data={chartData} />
              </div>
              <div>
                <MarketOverview data={marketData} />
              </div>
            </div>
            <RecentTrades trades={currentTrades.slice(0, 5)} />
          </div>
        );
      case 'portfolio':
        return (
          <div className="space-y-6">
            <PortfolioSummary portfolio={currentPortfolio} />
            <PositionsList positions={currentPortfolio.positions} />
          </div>
        );
      case 'trading':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TradingChart data={chartData} height={500} />
            </div>
            <div className="space-y-6">
              <MarketOverview data={marketData} />
              <RecentTrades trades={currentTrades.slice(0, 3)} />
            </div>
          </div>
        );
      case 'strategies':
        return <StrategyList strategies={currentStrategies} />;
      case 'analytics':
        return (
          <div className="space-y-6">
            <PerformanceMetrics />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TradingChart data={chartData} height={350} />
              <PositionsList positions={currentPortfolio.positions} />
            </div>
          </div>
        );
      case 'assistant':
        return <ChatAssistant />;
      case 'settings':
        return (
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Settings</h2>
            <div className="mb-6 p-4 bg-gray-750 rounded-lg">
              <h3 className="text-lg font-medium text-white mb-2">Account Information</h3>
              <p className="text-gray-300">Email: {user.email}</p>
              <p className="text-gray-400 text-sm">User ID: {user.id}</p>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Trading Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Auto-execute AI recommendations</span>
                    <button className="w-12 h-6 bg-emerald-600 rounded-full relative">
                      <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Risk management alerts</span>
                    <button className="w-12 h-6 bg-emerald-600 rounded-full relative">
                      <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Real-time notifications</span>
                    <button className="w-12 h-6 bg-gray-600 rounded-full relative">
                      <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5"></div>
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-4">API Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Market Data Provider
                    </label>
                    <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
                      <option>Alpha Vantage</option>
                      <option>Polygon.io</option>
                      <option>Yahoo Finance</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Execution Venue
                    </label>
                    <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
                      <option>Interactive Brokers</option>
                      <option>Alpaca Markets</option>
                      <option>TD Ameritrade</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white capitalize mb-2">
                  {activeTab === 'dashboard' ? 'Trading Dashboard' : activeTab}
                </h1>
                <p className="text-gray-400">
                  Real-time market data and AI-powered trading insights
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Welcome back,</p>
                <p className="text-white font-medium">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;