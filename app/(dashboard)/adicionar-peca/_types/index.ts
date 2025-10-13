/**
 * Tipos específicos do módulo de peças
 * Usa tipos inferidos dos schemas Drizzle quando possível
 */
import type { ActionResult, InsertPeca, Peca } from '@/db/schema/types';

// Re-exporta tipos do schema
export type { Peca, ActionResult };

// Type para criar/editar peça (baseado em InsertPeca mas sem campos auto-gerados)
export type PecaFormData = Pick<InsertPeca, 'nome' | 'linkLojaIntegrada'>;
