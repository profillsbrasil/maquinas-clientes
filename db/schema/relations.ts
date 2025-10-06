import { maquinas } from './maquinas';
import { pecas } from './pecas';
import { pecasNaMaquina } from './pecas_na_maquina';
import { relations } from 'drizzle-orm';

export const maquinasRelations = relations(maquinas, ({ many }) => ({
  pecas: many(pecasNaMaquina)
}));

export const pecasRelations = relations(pecas, ({ many }) => ({
  maquinas: many(pecasNaMaquina)
}));

export const pecasNaMaquinaRelations = relations(pecasNaMaquina, ({ one }) => ({
  maquina: one(maquinas, {
    fields: [pecasNaMaquina.maquinaId],
    references: [maquinas.id]
  }),
  peca: one(pecas, {
    fields: [pecasNaMaquina.pecaId],
    references: [pecas.id]
  })
}));
