// Types para peças
export type Peca = {
  id: number;
  nome: string;
  linkLojaIntegrada: string;
};

// Type para peça adicionada na máquina (local)
export type PecaAdicionada = {
  localizacao: number;
  pecaId: number;
  nome: string;
  linkLoja: string;
};

// Type para imagem
export type ImagemMaquina = {
  url: string;
  nome: string;
};

// Type para criar máquina
export type CriarMaquinaParams = {
  nome: string;
  imagemUrl: string;
  pecas: { pecaId: number; localizacao: number }[];
};
