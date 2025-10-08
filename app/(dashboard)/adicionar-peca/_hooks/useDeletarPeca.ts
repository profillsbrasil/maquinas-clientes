'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deletarPeca } from '../_actions/pecas';
import type { Peca } from '../_types';
import { PECAS_QUERY_KEY } from './usePecas';
import { toast } from 'sonner';

export function useDeletarPeca() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const result = await deletarPeca(id);
      if (!result.success) {
        throw new Error(result.message);
      }
      return { id };
    },
    onMutate: async (id) => {
      // Cancelar queries pendentes
      await queryClient.cancelQueries({ queryKey: PECAS_QUERY_KEY });

      // Salvar estado anterior
      const previous = queryClient.getQueryData<Peca[]>(PECAS_QUERY_KEY);

      // Remover otimisticamente
      queryClient.setQueryData<Peca[]>(PECAS_QUERY_KEY, (old) =>
        old?.filter((peca) => peca.id !== id)
      );

      return { previous };
    },
    onError: (err, id, context) => {
      // Reverter em caso de erro
      if (context?.previous) {
        queryClient.setQueryData(PECAS_QUERY_KEY, context.previous);
      }
      toast.error(err instanceof Error ? err.message : 'Erro ao deletar peça');
    },
    onSuccess: () => {
      toast.success('Peça deletada com sucesso!');
    },
    onSettled: () => {
      // Revalidar sempre no final
      queryClient.invalidateQueries({ queryKey: PECAS_QUERY_KEY });
    }
  });
}
