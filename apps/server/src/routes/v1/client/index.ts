import { Hono } from "hono";
import { effectValidator } from '@hono/effect-validator'
import { ClientRequestSchema, URLQuerySchema, URLQuery, ClientRequest } from "@invoice/shared";
import { authMiddleware, AuthMiddlewareContext } from "@/middleware/authentication";
import { ClientContext, clientMiddleware } from "./middleware";

const clientRouteV1 = new Hono<ClientContext & AuthMiddlewareContext>();
clientRouteV1.use(authMiddleware);
clientRouteV1.use(clientMiddleware)

clientRouteV1.get("/", effectValidator("query", URLQuerySchema), async (c) => {
    const query = c.req.valid("query") as URLQuery;
    const jwt = c.var.jwt;
    const service = c.var.service;

    const result = await service.getClients(jwt.currentOrgID, query.page, query.size)

    return c.json(
        {
            message: "Clients fetched",
            data: result.data,
            meta: result.meta,
        },
        200,
    );
});

clientRouteV1.get("/:id", async (c) => {
    const clientID = c.req.param("id");
    const service = c.var.service;

    const client = await service.getClient(clientID)

    return c.json({ message: "Client fetched successfully", client }, 200);
});

// Get client invoices
clientRouteV1.get("/:id/invoices", effectValidator("query", URLQuerySchema), async (c) => {
    const clientID = c.req.param("id");
    const query = c.req.valid("query") as URLQuery;
    const service = c.var.service;

    const result = await service.getClientInvoices(clientID, query);

    return c.json(
        {
            message: "Client invoices fetched",
            data: result.data,
            meta: result.meta,
        },
        200,
    );
});

clientRouteV1.post("/create", effectValidator("json", ClientRequestSchema), async (c) => {
    const request = c.req.valid("json") as ClientRequest;
    const jwt = c.get("jwt");
    const service = c.var.service;

    const result = await service.createClient(jwt.currentOrgID, request)

    return c.json({ message: "Client created", data: result }, 200);
});

clientRouteV1.delete("/:id/delete", async (c) => {
    const clientID = c.req.param("id");
    const service = c.var.service;

    await service.deleteClient(clientID)

    return c.json({ message: "Client Deleted" }, 200);
});

clientRouteV1.put("/:id/edit", effectValidator("json", ClientRequestSchema), async (c) => {
    const request = c.req.valid("json") as ClientRequest;
    const clientID = c.req.param("id");
    const service = c.var.service;

    const result = await service.updateClient(clientID, request)

    return c.json({ message: "Client data edited", data: result }, 200);
});

export default clientRouteV1;
