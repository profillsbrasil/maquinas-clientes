// Type para peça
export type Peca = {
  id: number;
  nome: string;
  linkLojaIntegrada: string;
  createdAt: Date;
  updatedAt: Date;
};

// Type para criar/editar peça
export type PecaFormData = {
  nome: string;
  linkLojaIntegrada: string;
};

// Type para resultado de action
export type ActionResult<T = void> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
};
