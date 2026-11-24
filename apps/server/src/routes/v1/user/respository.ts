import { UserEntry, OrgEntry } from "@/db/db-types";
import { members, organizations, users } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { type Country, COUNTRIES } from "@invoice/shared";

export class UserRepository {
    private readonly db: NodePgDatabase

    constructor(database: NodePgDatabase) {
        this.db = database
    }

    public async findUserByEmail(email: string): Promise<UserEntry | null> {
        // Todo: DB select could error
        const result = await this.db.select()
            .from(users)
            .where(and(eq(users.email, email), eq(users.deleted, false)))
            .then((result) => result[0])

        if (!result) return null

        return result

    }

    public async createSuperAdminUser(data: any): Promise<{ user: UserEntry; org: OrgEntry }> {
        const country: Country | undefined = COUNTRIES.find((c) => c.name === data.country);

        const { user, org } = await this.db.transaction(async (tx) => {

            // Create organization
            const org = await tx.insert(organizations)
                .values({
                    name: data.businessName,
                    country: data.country,
                    currency: country?.currency,
                })
                .returning()
                .then((result) => result[0])

            // Create user
            const user = await tx.insert(users)
                .values({
                    email: data.email,
                    firstname: data.firstname,
                    lastname: data.lastname,
                    currentOrgID: org.id,
                })
                .returning()
                .then((result) => result[0])

            // Create member
            await tx.insert(members)
                .values({
                    userID: user.id,
                    organizationID: org.id,
                    roleID: 1,
                })

            return { user, org }
        })

        return { user, org }
    }


}
