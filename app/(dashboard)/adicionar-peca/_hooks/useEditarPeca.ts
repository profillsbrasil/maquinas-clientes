'use client';

import { useMutation } from '@tanstack/react-query';

import { editarPeca } from '../_actions/pecas';
import type { PecaFormData } from '../_types';
import { useInvalidarPecas } from './usePecas';
import { toast } from 'sonner';

type EditarPecaParams = {
  id: number;
  data: PecaFormData;
};

export function useEditarPeca() {
  const invalidarPecas = useInvalidarPecas();

  return useMutation({
    mutationFn: async ({ id, data }: EditarPecaParams) => {
      const formData = new FormData();
      formData.append('nome', data.nome);
      formData.append('linkLojaIntegrada', data.linkLojaIntegrada);

      const result = await editarPeca(id, formData);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result;
    },
    onSuccess: () => {
      invalidarPecas();
      toast.success('Peça atualizada com sucesso!');
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Erro ao atualizar peça'
      );
    }
  });
}
