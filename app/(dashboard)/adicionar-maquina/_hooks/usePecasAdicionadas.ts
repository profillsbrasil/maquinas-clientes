'use client';

import { useCallback, useMemo, useState } from 'react';

import type { Peca, PecaAdicionada } from '../_types';
import { toast } from 'sonner';

export function usePecasAdicionadas(pecasDisponiveis: Peca[]) {
  const [pecasAdicionadas, setPecasAdicionadas] = useState<PecaAdicionada[]>(
    []
  );

  const handleAdicionarPeca = useCallback(
    (localizacao: number, pecaId: number) => {
      const peca = pecasDisponiveis.find((p) => p.id === pecaId);
      if (!peca) return;

      if (pecasAdicionadas.some((p) => p.localizacao === localizacao)) {
        toast.error('Já existe peça nesta localização');
        return;
      }

      setPecasAdicionadas([
        ...pecasAdicionadas,
        {
          localizacao,
          pecaId: peca.id,
          nome: peca.nome,
          linkLoja: peca.linkLojaIntegrada
        }
      ]);
      toast.success('Peça adicionada!');
    },
    [pecasDisponiveis, pecasAdicionadas]
  );

  const handleRemoverPeca = useCallback(
    (localizacao: number) => {
      setPecasAdicionadas(
        pecasAdicionadas.filter((p) => p.localizacao !== localizacao)
      );
      toast.success('Peça removida!');
    },
    [pecasAdicionadas]
  );

  const limparPecas = useCallback(() => {
    setPecasAdicionadas([]);
  }, []);

  // Mapa de peças por localização para performance O(1) lookup
  const pecasPorLocalizacao = useMemo(
    () => new Map(pecasAdicionadas.map((p) => [p.localizacao, p])),
    [pecasAdicionadas]
  );

  return {
    pecasAdicionadas,
    pecasPorLocalizacao,
    handleAdicionarPeca,
    handleRemoverPeca,
    limparPecas
  };
}
