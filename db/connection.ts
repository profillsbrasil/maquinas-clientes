import { createClient } from '@libsql/client/web';

import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql/web';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!
});
const db = drizzle({ client });

export default db;
