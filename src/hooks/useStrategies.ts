import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { TradingStrategy } from '../types/trading';

export function useStrategies(userId: string | undefined) {
  const [strategies, setStrategies] = useState<TradingStrategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchStrategies();

    // Set up real-time subscription
    const subscription = supabase
      .channel('strategies_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'strategies', filter: `user_id=eq.${userId}` },
        () => fetchStrategies()
      )
      .subscribe();

    return () => subscription.unsubscribe();
  }, [userId]);

  const fetchStrategies = async () => {
    if (!userId) return;

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('strategies')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to match our types
      const transformedStrategies: TradingStrategy[] = data.map(strategy => ({
        id: strategy.id,
        name: strategy.name,
        description: strategy.description || '',
        status: strategy.status as 'ACTIVE' | 'PAUSED' | 'STOPPED',
        performance: strategy.performance as any || {
          totalReturn: 0,
          winRate: 0,
          sharpeRatio: 0,
          maxDrawdown: 0
        },
        backtestResults: strategy.backtest_results as any || {
          accuracy: 0,
          totalTrades: 0,
          profitableTrades: 0
        }
      }));

      setStrategies(transformedStrategies);
      setError(null);
    } catch (err) {
      console.error('Error fetching strategies:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch strategies');
    } finally {
      setLoading(false);
    }
  };

  const createStrategy = async (strategy: Omit<TradingStrategy, 'id'>) => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('strategies')
        .insert({
          user_id: userId,
          name: strategy.name,
          description: strategy.description,
          status: strategy.status,
          performance: strategy.performance,
          backtest_results: strategy.backtestResults
        })
        .select()
        .single();

      if (error) throw error;
      
      await fetchStrategies();
      return data;
    } catch (err) {
      console.error('Error creating strategy:', err);
      throw err;
    }
  };

  return {
    strategies,
    loading,
    error,
    createStrategy,
    refetch: fetchStrategies
  };
}