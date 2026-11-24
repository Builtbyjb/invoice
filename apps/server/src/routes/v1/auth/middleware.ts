import { ENV, TokenPayload } from "@/lib/types";
import { MiddlewareHandler } from "hono";
import { AuthService } from "./service";
import { getDB } from "@/db/utils";
import { AuthRepository } from "./respository";
import { UserRepository } from "../user/respository";

export interface AuthContext {
    Bindings: ENV,
    Variables: { service: AuthService }
}

export function injectService(): MiddlewareHandler<AuthContext> {
    return async (c, next) => {
        const { db, client } = await getDB(c.env.DB.connectionString)
        const userRepository = new UserRepository(db)
        const service = new AuthService(userRepository)

        c.set("service", service)

        await next()

        c.executionCtx.waitUntil(client.end());
    }
}
