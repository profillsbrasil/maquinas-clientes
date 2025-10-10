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

export type Role = 'cliente' | 'engenheiro' | 'admin';

export const roles: Role[] = ['cliente', 'engenheiro', 'admin'];

export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('email_verified', { mode: 'boolean' })
    .notNull()
    .default(false),
  image: text('image'),
  role: text('role').notNull().default('cliente').$type<Role>(),
  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`(datetime('now'))`)
    .$onUpdate(() => new Date())
});
