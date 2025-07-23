import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Trade } from '../types/trading';

export function useTrades(userId: string | undefined) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchTrades();

    // Set up real-time subscription
    const subscription = supabase
      .channel('trades_changes')
      .on('postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'trades',
          filter: `portfolio_id=in.(select id from portfolios where user_id=eq.${userId})`
        },
        () => fetchTrades()
      )
      .subscribe();

    return () => subscription.unsubscribe();
  }, [userId]);

  const fetchTrades = async () => {
    if (!userId) return;

    try {
      setLoading(true);

      // First get user's portfolios
      const { data: portfolios, error: portfolioError } = await supabase
        .from('portfolios')
        .select('id')
        .eq('user_id', userId);

      if (portfolioError) throw portfolioError;

      const portfolioIds = portfolios.map(p => p.id);

      // Then get trades for those portfolios
      const { data: tradesData, error: tradesError } = await supabase
        .from('trades')
        .select('*')
        .in('portfolio_id', portfolioIds)
        .order('created_at', { ascending: false })
        .limit(50);

      if (tradesError) throw tradesError;

      // Transform data to match our types
      const transformedTrades: Trade[] = tradesData.map(trade => ({
        id: trade.id,
        symbol: trade.symbol,
        type: trade.trade_type as 'BUY' | 'SELL',
        quantity: trade.quantity,
        price: trade.price,
        timestamp: new Date(trade.created_at).getTime(),
        status: trade.status as 'PENDING' | 'EXECUTED' | 'FAILED',
        strategy: trade.strategy_id ? 'AI Strategy' : undefined
      }));

      setTrades(transformedTrades);
      setError(null);
    } catch (err) {
      console.error('Error fetching trades:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch trades');
    } finally {
      setLoading(false);
    }
  };

  const createTrade = async (trade: Omit<Trade, 'id' | 'timestamp'>) => {
    if (!userId) return;

    try {
      // Get user's active portfolio
      const { data: portfolio, error: portfolioError } = await supabase
        .from('portfolios')
        .select('id')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (portfolioError) throw portfolioError;

      const { data, error } = await supabase
        .from('trades')
        .insert({
          portfolio_id: portfolio.id,
          symbol: trade.symbol,
          trade_type: trade.type,
          quantity: trade.quantity,
          price: trade.price,
          total_amount: trade.quantity * trade.price,
          status: trade.status
        })
        .select()
        .single();

      if (error) throw error;
      
      // Refresh trades list
      await fetchTrades();
      
      return data;
    } catch (err) {
      console.error('Error creating trade:', err);
      throw err;
    }
  };

  return {
    trades,
    loading,
    error,
    createTrade,
    refetch: fetchTrades
  };
}