'use client';

import { useRouter } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';

import { useInvalidarMaquinas } from '../../maquinas/_hooks/useMaquinas';
import { criarMaquinaCompleta } from '../_actions/maquinas';
import { toast } from 'sonner';

type CriarMaquinaParams = {
  nome: string;
  imagemUrl: string;
  pecas: { pecaId: number; localizacao: number }[];
};

export function useCriarMaquina() {
  const router = useRouter();
  const invalidarMaquinas = useInvalidarMaquinas();

  return useMutation({
    mutationFn: async ({ nome, imagemUrl, pecas }: CriarMaquinaParams) => {
      const result = await criarMaquinaCompleta(nome, imagemUrl, pecas);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    onSuccess: () => {
      invalidarMaquinas();
      toast.success('Máquina criada com sucesso!');
      setTimeout(() => router.push('/maquinas'), 800);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Erro ao criar máquina'
      );
    }
  });
}
