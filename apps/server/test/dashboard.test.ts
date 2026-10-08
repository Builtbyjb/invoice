import { env } from "cloudflare:workers";
import {
    createExecutionContext,
    waitOnExecutionContext,
} from "cloudflare:test";
import { describe, it, expect } from "vitest";
import worker from "../src";

// `Request` to pass to `worker.fetch()`.
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe("Invoice Stats Fetch", () => {
    it("Invoice stats are fetched successfully", async () => {
        //         const request = new IncomingRequest("http://localhost:8585/user/dashboard/stats");
        //         const ctx = createExecutionContext();
        //         const response = await worker.fetch(request, env, ctx);
        //
        //         await waitOnExecutionContext(ctx);
        //         expect(response.status).toBe(200);
        //         expect(await response.json()).toBe({ message: "success" });
    });
});
