import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Portfolio, Position } from '../types/trading';

export function usePortfolio(userId: string | undefined) {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchPortfolio();
    
    // Set up real-time subscriptions
    const portfolioSubscription = supabase
      .channel('portfolio_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'portfolios', filter: `user_id=eq.${userId}` },
        () => fetchPortfolio()
      )
      .subscribe();

    const positionsSubscription = supabase
      .channel('positions_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'positions' },
        () => fetchPortfolio()
      )
      .subscribe();

    return () => {
      portfolioSubscription.unsubscribe();
      positionsSubscription.unsubscribe();
    };
  }, [userId]);

  const fetchPortfolio = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      
      // Fetch portfolio
      const { data: portfolioData, error: portfolioError } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .maybeSingle();

      if (portfolioError) throw portfolioError;

      // If no portfolio exists, set empty state
      if (!portfolioData) {
        setPortfolio(null);
        setPositions([]);
        setError(null);
        return;
      }

      // Fetch positions
      const { data: positionsData, error: positionsError } = await supabase
        .from('positions')
        .select('*')
        .eq('portfolio_id', portfolioData.id)
        .order('created_at', { ascending: false });

      if (positionsError) throw positionsError;

      // Transform data to match our types
      const transformedPositions: Position[] = positionsData.map(pos => ({
        id: pos.id,
        symbol: pos.symbol,
        quantity: pos.quantity,
        averagePrice: pos.average_price,
        currentPrice: pos.current_price,
        pnl: pos.pnl,
        pnlPercent: pos.pnl_percent,
        marketValue: pos.market_value
      }));

      const transformedPortfolio: Portfolio = {
        id: portfolioData.id,
        totalValue: portfolioData.total_value,
        totalPnL: portfolioData.total_pnl,
        totalPnLPercent: portfolioData.total_pnl_percent,
        availableCash: portfolioData.available_cash,
        positions: transformedPositions
      };

      setPortfolio(transformedPortfolio);
      setPositions(transformedPositions);
      setError(null);
    } catch (err) {
      console.error('Error fetching portfolio:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch portfolio');
    } finally {
      setLoading(false);
    }
  };

  return {
    portfolio,
    positions,
    loading,
    error,
    refetch: fetchPortfolio
  };
}