import { maquinas } from './maquinas';
import { user } from './user';
import { sql } from 'drizzle-orm';
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

export const userMaquinas = sqliteTable('user_maquinas', {
  id: integer('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
  maquinaId: integer('maquina_id')
    .notNull()
    .references(() => maquinas.id),
  criadoEm: timestamp('criado_em')
    .notNull()
    .default(sql`(datetime('now'))`),
  alteradoEm: timestamp('alterado_em')
    .notNull()
    .default(sql`(datetime('now'))`)
    .$onUpdate(() => new Date())
});
