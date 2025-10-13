import { sql } from 'drizzle-orm';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import {
  customType,
  integer,
  sqliteTable,
  text
} from 'drizzle-orm/sqlite-core';

const timestamp = customType<{ data: Date; driverData: string }>({
  dataType() {
    return 'text';
  },
  toDriver(value: Date): string {
    return value.toISOString().replace('T', ' ').substring(0, 19);
  },
  fromDriver(value: string): Date {
    return new Date(value);
  }
});

export const maquinas = sqliteTable('maquinas', {
  id: integer('id').primaryKey(),
  nome: text('nome').notNull(),
  imagem: text('imagem').notNull(),
  criadoEm: timestamp('criado_em')
    .notNull()
    .default(sql`(datetime('now'))`),
  alteradoEm: timestamp('alterado_em')
    .notNull()
    .default(sql`(datetime('now'))`)
    .$onUpdate(() => new Date())
});

// Tipos inferidos automaticamente do schema
export type Maquina = InferSelectModel<typeof maquinas>;
export type InsertMaquina = InferInsertModel<typeof maquinas>;
