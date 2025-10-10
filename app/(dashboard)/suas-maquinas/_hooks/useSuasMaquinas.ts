'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import {
  buscarSuaMaquina,
  listarSuasMaquinas
} from '../_actions/listar-suas-maquinas';

// Keys para queries
export const suasMaquinasKeys = {
  all: ['suas-maquinas'] as const,
  lists: () => [...suasMaquinasKeys.all, 'list'] as const,
  list: (page: number = 1, limit: number = 8) =>
    [...suasMaquinasKeys.lists(), { page, limit }] as const,
  details: () => [...suasMaquinasKeys.all, 'detail'] as const,
  detail: (id: number) => [...suasMaquinasKeys.details(), id] as const
};

// Hook para listar suas máquinas com paginação
export function useSuasMaquinas(page: number = 1, limit: number = 8) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: suasMaquinasKeys.list(page, limit),
    queryFn: async () => {
      const result = await listarSuasMaquinas(page, limit);
      if (!result.success || !result.data) {
        throw new Error(result.message);
      }
      return result.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    placeholderData: (previousData) => previousData
  });

  // Prefetch da próxima página (se existir)
  const prefetchNextPage = () => {
    if (query.data && page < query.data.totalPages) {
      queryClient.prefetchQuery({
        queryKey: suasMaquinasKeys.list(page + 1, limit),
        queryFn: async () => {
          const result = await listarSuasMaquinas(page + 1, limit);
          if (!result.success || !result.data) {
            throw new Error(result.message);
          }
          return result.data;
        },
        staleTime: 1000 * 60 * 5
      });
    }
  };

  // Prefetch da página anterior (se existir)
  const prefetchPreviousPage = () => {
    if (page > 1) {
      queryClient.prefetchQuery({
        queryKey: suasMaquinasKeys.list(page - 1, limit),
        queryFn: async () => {
          const result = await listarSuasMaquinas(page - 1, limit);
          if (!result.success || !result.data) {
            throw new Error(result.message);
          }
          return result.data;
        },
        staleTime: 1000 * 60 * 5
      });
    }
  };

  return {
    ...query,
    prefetchNextPage,
    prefetchPreviousPage
  };
}

// Hook para buscar uma máquina específica do usuário (com cache)
export function useSuaMaquina(id: number) {
  return useQuery({
    queryKey: suasMaquinasKeys.detail(id),
    queryFn: async () => {
      const result = await buscarSuaMaquina(id);
      if (!result.success || !result.data) {
        throw new Error(result.message || 'Máquina não encontrada');
      }
      return result.data;
    },
    staleTime: 1000 * 60 * 5 // 5 minutos
  });
}
