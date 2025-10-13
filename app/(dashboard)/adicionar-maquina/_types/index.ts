/**
 * Tipos específicos do módulo de adicionar máquina
 * Usa tipos inferidos dos schemas Drizzle quando possível
 */
import type { InsertMaquina, Peca } from '@/db/schema/types';

// Re-exporta Peca do schema (apenas campos necessários para o formulário)
export type { Peca };

// Type para peça adicionada na máquina (estado local do formulário)
export type PecaAdicionada = {
  localizacao: number;
  pecaId: number;
  nome: string;
  linkLoja: string;
};

// Type para imagem da máquina (estado local do formulário)
export type ImagemMaquina = {
  url: string;
  nome: string;
};

// Type para criar máquina (baseado em InsertMaquina)
export type CriarMaquinaParams = {
  nome: string;
  imagemUrl: string;
  pecas: { pecaId: number; localizacao: number }[];
};
