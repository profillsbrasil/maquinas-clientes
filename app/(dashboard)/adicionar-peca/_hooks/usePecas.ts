'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { listarPecas } from '../_actions/pecas';

export const PECAS_QUERY_KEY = ['pecas'];

export function usePecas() {
  return useQuery({
    queryKey: PECAS_QUERY_KEY,
    queryFn: async () => {
      const result = await listarPecas();
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false
  });
}

export function useInvalidarPecas() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: PECAS_QUERY_KEY });
}
