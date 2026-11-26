import { MiddlewareHandler } from "hono";
import type { TokenPayload, ENV } from "@/lib/types";
import { verify } from "hono/jwt";
import { AuthService } from "@/routes/v1/auth/service";
import { createMiddleware } from "hono/factory";

export interface AuthMiddlewareContext {
    Bindings: ENV;
    Variables: { jwt: TokenPayload };
}

export const authMiddleware = createMiddleware<AuthMiddlewareContext>(
    async (c, next) => {
        const accessToken = AuthService.getTokenFromHeader(c);
        if (!accessToken) return c.json({ message: "Unauthorized: Access token not found" }, 401);

        const secret = c.env.JWT_SECRET;
        if (!secret) {
            console.error("JWT secret not configured");
            return c.json({ message: "Internal Server Error" }, 500);
        }

        try {
            const payload = (await verify(accessToken, secret, "HS256")) as TokenPayload;
            c.set("jwt", payload);
            await next();
        } catch (error) {
            console.log(error);
            return c.json({ message: "Unauthorized: Invalid access token" }, 401);
        }

    }
)
