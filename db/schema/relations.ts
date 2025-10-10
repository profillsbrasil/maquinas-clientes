import { maquinas } from './maquinas';
import { pecas } from './pecas';
import { pecasNaMaquina } from './pecas_na_maquina';
import { user } from './user';
import { userMaquinas } from './user_maquinas';
import { relations } from 'drizzle-orm';

export const userRelations = relations(user, ({ many }) => ({
  maquinas: many(userMaquinas)
}));

export const maquinasRelations = relations(maquinas, ({ many }) => ({
  users: many(userMaquinas),
  pecas: many(pecasNaMaquina)
}));

export const userMaquinasRelations = relations(userMaquinas, ({ one }) => ({
  user: one(user, {
    fields: [userMaquinas.userId],
    references: [user.id]
  }),
  maquina: one(maquinas, {
    fields: [userMaquinas.maquinaId],
    references: [maquinas.id]
  })
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
