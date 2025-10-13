/**
 * Tipos centralizados do banco de dados
 * Todos os tipos são inferidos automaticamente dos schemas Drizzle
 */

// Re-exporta todos os tipos dos schemas
export type { User, InsertUser, Role, roles } from './user';
export type { Session, InsertSession } from './session';
export type { Account, InsertAccount } from './account';
export type { Verification, InsertVerification } from './verification';
export type { Maquina, InsertMaquina } from './maquinas';
export type { Peca, InsertPeca } from './pecas';
export type { PecaNaMaquina, InsertPecaNaMaquina } from './pecas_na_maquina';
export type { UserMaquina, InsertUserMaquina } from './user_maquinas';

/**
 * Tipo genérico para resultados de Server Actions
 * @template T - Tipo opcional dos dados retornados
 */
export type ActionResult<T = void> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
};
