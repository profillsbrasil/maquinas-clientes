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
  list: () => [...maquinasKeys.lists()] as const,
  details: () => [...maquinasKeys.all, 'detail'] as const,
  detail: (id: number) => [...maquinasKeys.details(), id] as const
};

// Hook para listar máquinas (com cache automático)
export function useMaquinas() {
  return useQuery({
    queryKey: maquinasKeys.list(),
    queryFn: async () => {
      const result = await listarMaquinas();
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data || [];
    },
    staleTime: 1000 * 60 * 5 // 5 minutos
  });
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
    // Renderização otimista
    onMutate: async (id) => {
      // Cancelar queries em andamento
      await queryClient.cancelQueries({ queryKey: maquinasKeys.list() });

      // Snapshot do estado anterior
      const previousMaquinas = queryClient.getQueryData(maquinasKeys.list());

      // Atualizar cache otimisticamente (remove a máquina)
      queryClient.setQueryData(maquinasKeys.list(), (old: unknown) => {
        if (!old) return [];
        return (old as { id: number }[]).filter((m) => m.id !== id);
      });

      return { previousMaquinas };
    },
    // Se der erro, reverter
    onError: (error, id, context) => {
      if (context?.previousMaquinas) {
        queryClient.setQueryData(maquinasKeys.list(), context.previousMaquinas);
      }
      toast.error(error instanceof Error ? error.message : 'Erro ao deletar');
    },
    // Ao sucesso, invalidar queries relacionadas
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: maquinasKeys.list() });
      queryClient.removeQueries({ queryKey: maquinasKeys.detail(data.id) });
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
