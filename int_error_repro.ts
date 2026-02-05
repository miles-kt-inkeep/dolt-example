import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool, PoolClient } from 'pg';
import testTable from './db/schema';
import { eq } from 'drizzle-orm';

const pool = new Pool({
connectionString: 'postgresql://appuser:password@localhost/test_db',
});

const db = drizzle(pool, {
schema: { testTable },
logger: true,
});


async function main() {
  db.insert(testTable).values({ id: '1', test_int: 1, test_bool: false });
  const result = await db.query.testTable.findFirst({
    where: eq(testTable.id, '1'),
  });
  console.log(result);
}

main();