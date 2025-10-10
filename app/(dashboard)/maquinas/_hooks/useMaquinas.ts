'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  buscarMaquina,
  deletarMaquina,
  listarMaquinas
} from '../_actions/listar-maquinas';
import { toast } from 'sonner';

// Keys para queries
export const maquinasKeys = {
  all: ['maquinas'] as const,
  lists: () => [...maquinasKeys.all, 'list'] as const,
  list: (page: number = 1, limit: number = 8) =>
    [...maquinasKeys.lists(), { page, limit }] as const,
  details: () => [...maquinasKeys.all, 'detail'] as const,
  detail: (id: number) => [...maquinasKeys.details(), id] as const
};

// Hook para listar máquinas com paginação
export function useMaquinas(page: number = 1, limit: number = 8) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: maquinasKeys.list(page, limit),
    queryFn: async () => {
      const result = await listarMaquinas(page, limit);
      if (!result.success || !result.data) {
        throw new Error(result.message);
      }
      return result.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    placeholderData: (previousData) => previousData // Mantém dados anteriores durante carregamento
  });

  // Prefetch da próxima página (se existir)
  const prefetchNextPage = () => {
    if (query.data && page < query.data.totalPages) {
      queryClient.prefetchQuery({
        queryKey: maquinasKeys.list(page + 1, limit),
        queryFn: async () => {
          const result = await listarMaquinas(page + 1, limit);
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
        queryKey: maquinasKeys.list(page - 1, limit),
        queryFn: async () => {
          const result = await listarMaquinas(page - 1, limit);
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

// Hook para buscar uma máquina específica (com cache)
export function useMaquina(id: number) {
  return useQuery({
    queryKey: maquinasKeys.detail(id),
    queryFn: async () => {
      const result = await buscarMaquina(id);
      if (!result.success || !result.data) {
        throw new Error(result.message || 'Máquina não encontrada');
      }
      return result.data;
    },
    staleTime: 1000 * 60 * 5 // 5 minutos
  });
}

// Hook para deletar máquina (com renderização otimista)
export function useDeletarMaquina() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const result = await deletarMaquina(id);
      if (!result.success) {
        throw new Error(result.message);
      }
      return { id, message: result.message };
    },
    // Ao sucesso, invalidar todas as páginas de máquinas
    onSuccess: (data) => {
      toast.success(data.message);
      // Invalidar todas as queries de listagem (todas as páginas)
      queryClient.invalidateQueries({ queryKey: maquinasKeys.lists() });
      // Remover query específica da máquina
      queryClient.removeQueries({ queryKey: maquinasKeys.detail(data.id) });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erro ao deletar');
    }
  });
}

// Hook para invalidar cache de máquinas manualmente
export function useInvalidarMaquinas() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: maquinasKeys.all });
  };
}
