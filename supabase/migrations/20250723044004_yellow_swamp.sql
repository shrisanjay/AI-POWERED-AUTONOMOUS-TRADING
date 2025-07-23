/*
  # Trading Platform Database Schema

  1. New Tables
    - `profiles` - User profiles and settings
    - `portfolios` - User portfolios with total values and cash
    - `positions` - Individual stock/crypto positions
    - `trades` - Trade history and execution records
    - `strategies` - AI trading strategies with performance metrics
    - `market_data` - Real-time market data cache
    - `chat_messages` - AI assistant conversation history

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
    - Separate policies for market data (public read access)

  3. Features
    - Real-time subscriptions for live data
    - Comprehensive trading data model
    - AI strategy tracking with backtesting results
    - Portfolio performance analytics
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table for user settings
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) PRIMARY KEY,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  trading_preferences jsonb DEFAULT '{}',
  risk_tolerance text DEFAULT 'moderate' CHECK (risk_tolerance IN ('conservative', 'moderate', 'aggressive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Portfolios table
CREATE TABLE IF NOT EXISTS portfolios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  name text NOT NULL DEFAULT 'Main Portfolio',
  total_value numeric(15,2) DEFAULT 0,
  total_pnl numeric(15,2) DEFAULT 0,
  total_pnl_percent numeric(8,4) DEFAULT 0,
  available_cash numeric(15,2) DEFAULT 10000,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Positions table
CREATE TABLE IF NOT EXISTS positions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id uuid REFERENCES portfolios(id) ON DELETE CASCADE NOT NULL,
  symbol text NOT NULL,
  quantity numeric(15,8) NOT NULL,
  average_price numeric(15,2) NOT NULL,
  current_price numeric(15,2) DEFAULT 0,
  pnl numeric(15,2) DEFAULT 0,
  pnl_percent numeric(8,4) DEFAULT 0,
  market_value numeric(15,2) DEFAULT 0,
  position_type text DEFAULT 'LONG' CHECK (position_type IN ('LONG', 'SHORT')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Trades table
CREATE TABLE IF NOT EXISTS trades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id uuid REFERENCES portfolios(id) ON DELETE CASCADE NOT NULL,
  symbol text NOT NULL,
  trade_type text NOT NULL CHECK (trade_type IN ('BUY', 'SELL')),
  quantity numeric(15,8) NOT NULL,
  price numeric(15,2) NOT NULL,
  total_amount numeric(15,2) NOT NULL,
  fees numeric(15,2) DEFAULT 0,
  status text DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'EXECUTED', 'FAILED', 'CANCELLED')),
  strategy_id uuid,
  execution_time timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Trading strategies table
CREATE TABLE IF NOT EXISTS strategies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  name text NOT NULL,
  description text,
  strategy_type text DEFAULT 'AI_GENERATED',
  status text DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'PAUSED', 'STOPPED')),
  parameters jsonb DEFAULT '{}',
  performance jsonb DEFAULT '{"totalReturn": 0, "winRate": 0, "sharpeRatio": 0, "maxDrawdown": 0}',
  backtest_results jsonb DEFAULT '{"accuracy": 0, "totalTrades": 0, "profitableTrades": 0}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Market data cache table
CREATE TABLE IF NOT EXISTS market_data (
  symbol text PRIMARY KEY,
  price numeric(15,2) NOT NULL,
  change_amount numeric(15,2) DEFAULT 0,
  change_percent numeric(8,4) DEFAULT 0,
  volume bigint DEFAULT 0,
  high_24h numeric(15,2) DEFAULT 0,
  low_24h numeric(15,2) DEFAULT 0,
  market_cap bigint,
  last_updated timestamptz DEFAULT now()
);

-- Chat messages for AI assistant
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  message_type text NOT NULL CHECK (message_type IN ('user', 'ai')),
  content text NOT NULL,
  suggestions jsonb DEFAULT '[]',
  context jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Portfolios policies
CREATE POLICY "Users can view own portfolios"
  ON portfolios FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own portfolios"
  ON portfolios FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Positions policies
CREATE POLICY "Users can view own positions"
  ON positions FOR SELECT
  TO authenticated
  USING (
    portfolio_id IN (
      SELECT id FROM portfolios WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own positions"
  ON positions FOR ALL
  TO authenticated
  USING (
    portfolio_id IN (
      SELECT id FROM portfolios WHERE user_id = auth.uid()
    )
  );

-- Trades policies
CREATE POLICY "Users can view own trades"
  ON trades FOR SELECT
  TO authenticated
  USING (
    portfolio_id IN (
      SELECT id FROM portfolios WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own trades"
  ON trades FOR ALL
  TO authenticated
  USING (
    portfolio_id IN (
      SELECT id FROM portfolios WHERE user_id = auth.uid()
    )
  );

-- Strategies policies
CREATE POLICY "Users can view own strategies"
  ON strategies FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own strategies"
  ON strategies FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Market data policies (public read access)
CREATE POLICY "Anyone can view market data"
  ON market_data FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role can manage market data"
  ON market_data FOR ALL
  TO service_role
  USING (true);

-- Chat messages policies
CREATE POLICY "Users can view own chat messages"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own chat messages"
  ON chat_messages FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_positions_portfolio_id ON positions(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_positions_symbol ON positions(symbol);
CREATE INDEX IF NOT EXISTS idx_trades_portfolio_id ON trades(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_trades_symbol ON trades(symbol);
CREATE INDEX IF NOT EXISTS idx_trades_created_at ON trades(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_strategies_user_id ON strategies(user_id);
CREATE INDEX IF NOT EXISTS idx_market_data_last_updated ON market_data(last_updated DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);

-- Functions for automatic timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON portfolios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_positions_updated_at BEFORE UPDATE ON positions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_strategies_updated_at BEFORE UPDATE ON strategies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();