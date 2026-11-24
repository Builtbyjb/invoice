import { clients, invoices } from "@/db/schema";
import { users, organizations, payouts } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
// import { getSubscriptionAmount } from "../routes/v1/referral/service";
import { getDB } from "./db/utils";
import { ENV } from "./lib/types";

const REWARD = 0.05;

/* Handles overdue invoice notifications */
export async function invoiceNotify(env: ENV): Promise<any> {
    const { db, client } = await getDB(env.DB.connectionString);

    try {
        const allUsers = await db.select().from(users).where(eq(users.deleted, false));

        for (const user of allUsers) {
            const organization = await db
                .select()
                .from(organizations)
                .where(eq(organizations.id, user.currentOrgID));

            if (!organization) continue;

            const allClients = await db
                .select()
                .from(clients)
                .where(
                    and(eq(clients.deleted, false), eq(clients.organizationID, user.currentOrgID)),
                );

            for (const client of allClients) {
                const allInvoices = await db
                    .select()
                    .from(invoices)
                    .where(eq(invoices.clientID, client.id));

                for (const invoice of allInvoices) {
                    if (invoice.notified) continue;

                    if (invoice.status === "sent" || invoice.status === "overdue") {
                        if (new Date(invoice.dueDate) < new Date()) {
                            await env.SEND_EMAIL.send({
                                from: "notify-noreply@acorp.app",
                                to: user.email,
                                subject: `Invoice Overdue: ${invoice.invoiceNumber}`,
                                text: `Invoice ${invoice.invoiceNumber} for ${client.name} is overdue. Consider sending a payment reminder.`,
                            });

                            await db
                                .update(invoices)
                                .set({ notified: true })
                                .where(eq(invoices.id, invoice.id));
                        }
                    }
                }
            }
        }
    } finally {
        await client.end();
    }
}

/* Creates a Paystack transfer recipient */
async function createPaystackRecipient(bankDetails: any, env: ENV): Promise<string | null> {
    try {
        const response = await fetch("https://api.paystack.co/transferrecipient", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                type: "nuban",
                name: bankDetails.accountHolderName,
                account_number: bankDetails.accountNumber,
                bank_code: bankDetails.bankCode,
                currency: "NGN",
            }),
        });

        const result: any = await response.json();
        if (result.status && result.data?.recipient_code) {
            return result.data.recipient_code;
        }

        return null;
    } catch (error) {
        console.error("Failed to create Paystack recipient:", error);
        return null;
    }
}

/* Handles referral rewards payout processing */
export async function payout(env: ENV): Promise<any> {
    // TODO:
}
