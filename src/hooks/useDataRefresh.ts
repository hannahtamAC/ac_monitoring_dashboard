import { useState, useEffect } from 'react';
export const useDataRefresh = <T,>(initialData: T, refreshCallback: () => Promise<T>, interval = 30000) => {
  const [data, setData] = useState<T>(initialData);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const refresh = async () => {
    try {
      setIsLoading(true);
      const newData = await refreshCallback();
      setData(newData);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to refresh data'));
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const timer = setInterval(refresh, interval);
    return () => clearInterval(timer);
  }, [interval]);
  return {
    data,
    lastUpdated,
    isLoading,
    error,
    refresh
  };
};