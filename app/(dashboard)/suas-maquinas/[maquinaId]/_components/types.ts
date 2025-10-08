export interface Peca {
  nome: string;
  descricao?: string;
  localizacaoClassName: string;
  linkLoja: string;
}

export interface Maquina {
  id: number;
  name: string;
  image: string | import('next/image').StaticImageData;
  pecas: Peca[];
}
