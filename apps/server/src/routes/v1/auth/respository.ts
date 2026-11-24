import { NodePgDatabase } from "drizzle-orm/node-postgres";

export class AuthRepository {
    private readonly db: NodePgDatabase

    constructor(database: NodePgDatabase) {
        this.db = database
    }
}
