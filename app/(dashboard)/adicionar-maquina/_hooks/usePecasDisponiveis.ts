'use client';

import { useQuery } from '@tanstack/react-query';

import { listarPecasDisponiveis } from '../_actions/maquinas';

export function usePecasDisponiveis() {
  return useQuery({
    queryKey: ['pecas-disponiveis'],
    queryFn: async () => {
      const result = await listarPecasDisponiveis();
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data || [];
    },
    staleTime: 1000 * 60 * 10, // 10 minutos - peças não mudam com frequência
    refetchOnWindowFocus: false
  });
}
