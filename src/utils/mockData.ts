import { MarketData, Portfolio, Position, Trade, TradingStrategy, ChartDataPoint } from '../types/trading';

export const mockMarketData: MarketData[] = [
  {
    symbol: 'BTC/USD',
    price: 45678.90,
    change: 1234.56,
    changePercent: 2.78,
    volume: 1234567890,
    high24h: 46890.12,
    low24h: 44123.45,
    timestamp: Date.now()
  },
  {
    symbol: 'ETH/USD',
    price: 3456.78,
    change: -89.12,
    changePercent: -2.51,
    volume: 987654321,
    high24h: 3567.89,
    low24h: 3345.67,
    timestamp: Date.now()
  },
  {
    symbol: 'AAPL',
    price: 185.43,
    change: 2.87,
    changePercent: 1.57,
    volume: 45678901,
    high24h: 187.21,
    low24h: 182.45,
    timestamp: Date.now()
  },
  {
    symbol: 'GOOGL',
    price: 142.67,
    change: -1.23,
    changePercent: -0.85,
    volume: 23456789,
    high24h: 145.12,
    low24h: 141.89,
    timestamp: Date.now()
  },
  {
    symbol: 'TSLA',
    price: 248.91,
    change: 8.45,
    changePercent: 3.52,
    volume: 67890123,
    high24h: 252.34,
    low24h: 240.12,
    timestamp: Date.now()
  }
];

export const mockPositions: Position[] = [
  {
    id: '1',
    symbol: 'BTC/USD',
    quantity: 0.5,
    averagePrice: 43210.00,
    currentPrice: 45678.90,
    pnl: 1234.45,
    pnlPercent: 5.71,
    marketValue: 22839.45
  },
  {
    id: '2',
    symbol: 'ETH/USD',
    quantity: 2.5,
    averagePrice: 3200.00,
    currentPrice: 3456.78,
    pnl: 641.95,
    pnlPercent: 8.02,
    marketValue: 8641.95
  },
  {
    id: '3',
    symbol: 'AAPL',
    quantity: 50,
    averagePrice: 175.00,
    currentPrice: 185.43,
    pnl: 521.50,
    pnlPercent: 5.96,
    marketValue: 9271.50
  }
];

export const mockPortfolio: Portfolio = {
  id: 'portfolio-1',
  totalValue: 52750.90,
  totalPnL: 3897.90,
  totalPnLPercent: 7.98,
  availableCash: 12000.00,
  positions: mockPositions
};

export const mockTrades: Trade[] = [
  {
    id: 'trade-1',
    symbol: 'BTC/USD',
    type: 'BUY',
    quantity: 0.1,
    price: 45650.00,
    timestamp: Date.now() - 300000,
    status: 'EXECUTED',
    strategy: 'Momentum Strategy'
  },
  {
    id: 'trade-2',
    symbol: 'ETH/USD',
    type: 'SELL',
    quantity: 0.5,
    price: 3445.00,
    timestamp: Date.now() - 600000,
    status: 'EXECUTED',
    strategy: 'Risk Management'
  },
  {
    id: 'trade-3',
    symbol: 'AAPL',
    type: 'BUY',
    quantity: 10,
    price: 185.20,
    timestamp: Date.now() - 120000,
    status: 'PENDING',
    strategy: 'AI Recommendation'
  }
];

export const mockStrategies: TradingStrategy[] = [
  {
    id: 'strategy-1',
    name: 'Momentum Strategy',
    description: 'AI-driven momentum trading with technical indicators',
    status: 'ACTIVE',
    performance: {
      totalReturn: 15.2,
      winRate: 73.5,
      sharpeRatio: 1.85,
      maxDrawdown: -8.3
    },
    backtestResults: {
      accuracy: 74.2,
      totalTrades: 156,
      profitableTrades: 115
    }
  },
  {
    id: 'strategy-2',
    name: 'Risk Arbitrage',
    description: 'Market-neutral strategy with risk management',
    status: 'ACTIVE',
    performance: {
      totalReturn: 9.8,
      winRate: 81.2,
      sharpeRatio: 2.1,
      maxDrawdown: -4.5
    },
    backtestResults: {
      accuracy: 78.9,
      totalTrades: 89,
      profitableTrades: 72
    }
  },
  {
    id: 'strategy-3',
    name: 'Mean Reversion',
    description: 'Statistical arbitrage with AI pattern recognition',
    status: 'PAUSED',
    performance: {
      totalReturn: 12.4,
      winRate: 68.9,
      sharpeRatio: 1.65,
      maxDrawdown: -11.2
    },
    backtestResults: {
      accuracy: 71.3,
      totalTrades: 203,
      profitableTrades: 140
    }
  }
];

export function generateChartData(days: number = 30): ChartDataPoint[] {
  const data: ChartDataPoint[] = [];
  let basePrice = 45000;
  const now = Date.now();
  
  for (let i = days; i >= 0; i--) {
    const timestamp = now - (i * 24 * 60 * 60 * 1000);
    const volatility = 0.02;
    const trend = 0.001;
    
    const change = (Math.random() - 0.5) * volatility + trend;
    const open = basePrice;
    const close = basePrice * (1 + change);
    const high = Math.max(open, close) * (1 + Math.random() * 0.01);
    const low = Math.min(open, close) * (1 - Math.random() * 0.01);
    const volume = Math.random() * 1000000 + 500000;
    
    data.push({
      timestamp,
      open,
      high,
      low,
      close,
      volume
    });
    
    basePrice = close;
  }
  
  return data;
}

export const aiResponses = [
  "Based on current market conditions, I recommend increasing your BTC position by 15%. The momentum indicators are showing strong bullish signals.",
  "Risk alert: ETH is approaching oversold territory. Consider taking partial profits on your current position.",
  "Market analysis suggests a potential reversal in AAPL. The AI model indicates 78% probability of upward movement in the next 24 hours.",
  "Portfolio optimization: Your current allocation shows high correlation risk. I suggest diversifying into defensive sectors.",
  "Technical analysis indicates a golden cross formation in BTC/USD. This could signal a strong uptrend continuation.",
  "Risk management alert: Your portfolio exposure to crypto is 65%. Consider rebalancing to maintain optimal risk levels."
];