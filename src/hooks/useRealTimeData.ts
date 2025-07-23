import { useState, useEffect, useRef } from 'react';
import { MarketData } from '../types/trading';
import { mockMarketData } from '../utils/mockData';

export function useRealTimeData() {
  const [data, setData] = useState<MarketData[]>(mockMarketData);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Simulate real-time data updates
    intervalRef.current = setInterval(() => {
      setData(prevData => 
        prevData.map(item => ({
          ...item,
          price: item.price * (1 + (Math.random() - 0.5) * 0.01),
          change: item.price * (Math.random() - 0.5) * 0.02,
          changePercent: (Math.random() - 0.5) * 4,
          volume: item.volume * (1 + (Math.random() - 0.5) * 0.1),
          timestamp: Date.now()
        }))
      );
    }, 2000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return data;
}