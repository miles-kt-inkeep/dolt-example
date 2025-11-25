import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { eq } from 'drizzle-orm';
import testTable from './db/schema';

const pool = new Pool({
connectionString: 'postgresql://postgres:password@localhost/test_db',
});

const db = drizzle(pool, {
schema: { testTable },
logger: true,
});


async function main() {
  await db.insert(testTable).values({
      id: 'test',
      jsonbColumn: { test: 'value\n' },
  });

  // fails
  await db.update(testTable).set({
      jsonbColumn: { test: 'value\n\n' },
  }).where(eq(testTable.id, 'test')).returning();
}

main();