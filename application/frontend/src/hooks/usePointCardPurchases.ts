import { useEffect, useState, useCallback } from 'react';
import type { PointCardPurchase } from '@/types';
import { fetchMyPointCardsApi } from '@/api/customer';

interface UsePointCardPurchasesResult {
  data: PointCardPurchase[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function usePointCardPurchases(userId: string | undefined): UsePointCardPurchasesResult {
  const [data, setData] = useState<PointCardPurchase[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await fetchMyPointCardsApi(userId);
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load point cards');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
