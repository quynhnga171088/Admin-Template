import { QueryClient } from '@tanstack/react-query';
import { QUERY_CONFIG } from '@/config/constant.ts';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_CONFIG.STALE_TIME * 60 * 1000,
      gcTime: QUERY_CONFIG.GC_TIME * 60 * 1000,
      retry: QUERY_CONFIG.RETRY
    },
    mutations: {
      retry: 0
    }
  }
});
