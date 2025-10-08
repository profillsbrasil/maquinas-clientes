'use client';

import { useRouter } from 'next/navigation';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { maquinasKeys } from '../../../_hooks/useMaquinas';
import { editarMaquinaCompleta } from '../_actions/editar-maquina';
import { toast } from 'sonner';

type EditarMaquinaParams = {
  id: number;
  nome: string;
  imagemUrl: string;
  pecas: { pecaId: number; localizacao: number }[];
};

export function useEditarMaquina() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, nome, imagemUrl, pecas }: EditarMaquinaParams) => {
      const result = await editarMaquinaCompleta(id, nome, imagemUrl, pecas);

      if (!result.success) {
        throw new Error(result.message);
      }

      return { id };
    },
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: maquinasKeys.list() });
      queryClient.invalidateQueries({ queryKey: maquinasKeys.detail(data.id) });

      toast.success('Máquina atualizada com sucesso!');
      setTimeout(() => router.push('/maquinas'), 800);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Erro ao atualizar máquina'
      );
    }
  });
}
