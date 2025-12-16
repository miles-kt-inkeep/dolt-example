import { Pool } from 'pg';

const CONNECTION_STRING = 'postgresql://appuser:password@localhost:5432/test';

async function testJsonSize(connection: any, size: number): Promise<boolean> {
  const testId = `size-test-${size}-${Date.now()}`;
  
  // Generate generic nested JSON to reach target size
  const json: any = { data: [] };
  let currentSize = JSON.stringify(json).length;
  let itemNum = 0;
  
  while (currentSize < size) {
    json.data.push({
      id: itemNum,
      name: `item_${itemNum}`,
      value: 'x'.repeat(Math.min(50, size - currentSize)),
      nested: { a: 1, b: 2, c: 3 }
    });
    currentSize = JSON.stringify(json).length;
    itemNum++;
  }

  try {
    await connection.query(`
      INSERT INTO jsonb_test (id, jsonb_column)
      VALUES ($1, $2)
    `, [testId, JSON.stringify(json)]);
    
    await connection.query(`SELECT jsonb_column FROM jsonb_test WHERE id = $1`, [testId]);
    await connection.query(`DELETE FROM jsonb_test WHERE id = $1`, [testId]);
    return true;
  } catch (err) {
    console.error(err);
    try { await connection.query(`DELETE FROM jsonb_test WHERE id = $1`, [testId]); } catch {}
    return false;
  }
}

async function main() {
  const pool = new Pool({ connectionString: CONNECTION_STRING });
  const connection = await pool.connect();

  try {
    // Create test table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS jsonb_test (
        id VARCHAR(255) PRIMARY KEY,
        jsonb_column JSONB
      )
    `);

    console.log('=== DOLTGRES JSONB SIZE THRESHOLD TEST ===\n');

    // Binary search for the threshold
    let low = 100;
    let high = 20000;
    
    console.log('Testing size range:', low, '-', high, 'bytes\n');

    // First, find approximate range
    const testSizes = [500, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 10000, 15000, 20000];
    
    for (const size of testSizes) {
      const passed = await testJsonSize(connection, size);
      console.log(`${size} bytes: ${passed ? '✅ PASS' : '❌ FAIL'}`);
      
      if (!passed && low < size) {
        high = size;
        break;
      }
      if (passed) {
        low = size;
      }
    }

    console.log('\n--- Binary search for exact threshold ---\n');
    
    // Binary search between low and high
    while (high - low > 100) {
      const mid = Math.floor((low + high) / 2);
      const passed = await testJsonSize(connection, mid);
      console.log(`${mid} bytes: ${passed ? '✅ PASS' : '❌ FAIL'}`);
      
      if (passed) {
        low = mid;
      } else {
        high = mid;
      }
    }

    console.log(`\n=== THRESHOLD FOUND ===`);
    console.log(`Bug triggers between ${low} and ${high} bytes`);
    console.log(`Approximate threshold: ~${Math.floor((low + high) / 2)} bytes\n`);

  } finally {
    connection.release();
    await pool.end();
  }
}

main().catch(console.error);

