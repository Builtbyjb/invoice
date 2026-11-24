import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { cors } from "hono/cors";
import { ENV } from "@/lib/types";
import { invoiceNotify, payout } from "./crons";
import rateLimiterMiddleware from "./middleware/rate-limiter";

/* App routes */
import routesV1 from "./routes/v1";

const app = new Hono<{ Bindings: ENV }>();

app.use(
    "/api/*",
    cors({
        origin: ["http://localhost:5173", "https://invoice.acorp.app"],
        allowHeaders: [
            "X-Custom-Header",
            "Upgrade-Insecure-Requests",
            "Content-Type",
            "Authorization",
            "Set-Cookie",
            "X-Mobile-Client",
        ],
        allowMethods: ["POST", "GET", "OPTIONS", "DELETE", "PATCH", "PUT"],
        exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
        credentials: true,
    }),
);

app.use("/api/*", rateLimiterMiddleware());

app.onError((error, c) => {
    const INTERNAL_ERROR_MESSAGE = "We are currently experiencing an internal issue that’s affecting this request. Our team is actively investigating and working to resolve it as quickly as possible.";
    console.error(`${error.message}: ${error.stack}: ${error.cause}`);
    if (error instanceof HTTPException) return error.getResponse();
    return c.json({ error: INTERNAL_ERROR_MESSAGE }, 500);
});

/* Register routes */
app.route("/api/v1", routesV1);

export default {
    fetch: app.fetch,

    async scheduled(event: ScheduledEvent, env: ENV, ctx: ExecutionContext) {
        if (event.cron === "* * * * *") {
            ctx.waitUntil(invoiceNotify(env));
            return;
        }

        if (event.cron === "0 0 1 * *") {
            ctx.waitUntil(payout(env));
        }
    },
};
