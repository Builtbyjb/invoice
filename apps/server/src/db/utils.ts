import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Client } from "pg";

export async function getDB(connectionString: string): Promise<{ db: NodePgDatabase; client: Client }> {
    const client = new Client({ connectionString });
    await client.connect();
    const db = drizzle({ client });

    return { db, client };
}
