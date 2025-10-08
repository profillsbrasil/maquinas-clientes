'use client';

import { useMutation } from '@tanstack/react-query';

import { criarPeca } from '../_actions/pecas';
import type { PecaFormData } from '../_types';
import { useInvalidarPecas } from './usePecas';
import { toast } from 'sonner';

export function useCriarPeca() {
  const invalidarPecas = useInvalidarPecas();

  return useMutation({
    mutationFn: async (data: PecaFormData) => {
      const formData = new FormData();
      formData.append('nome', data.nome);
      formData.append('linkLojaIntegrada', data.linkLojaIntegrada);

      const result = await criarPeca(formData);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result;
    },
    onSuccess: () => {
      invalidarPecas();
      toast.success('Peça criada com sucesso!');
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Erro ao criar peça'
      );
    }
  });
}
