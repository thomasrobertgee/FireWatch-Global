
import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function runMigration() {
    // Local Supabase DB credentials usually: postgres/postgres on port 54322
    const connectionString = "postgresql://postgres:postgres@127.0.0.1:54322/postgres";

    const client = new Client({ connectionString });

    try {
        await client.connect();
        console.log("🔌 Connected to Local DB");

        const sql = fs.readFileSync(path.join(process.cwd(), 'supabase_schema_v6.sql'), 'utf8');
        await client.query(sql);

        console.log("✅ Migration applied: scout_status table created.");
    } catch (err) {
        console.error("❌ Migration failed:", err);
    } finally {
        await client.end();
    }
}

runMigration();
