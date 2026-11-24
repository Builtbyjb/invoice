import { Hono } from "hono";
import authRouteV1 from "./auth";
import userRouteV1 from "./user";
import clientRouteV1 from "./client";
import invoiceRouteV1 from "./invoice";
import blobRouteV1 from "./blob";
import referralRouteV1 from "./referral";

const routesV1 = new Hono()

routesV1.route("/auth", authRouteV1)
routesV1.route("/user", userRouteV1)
routesV1.route("/clients", clientRouteV1)
routesV1.route("/invoices", invoiceRouteV1)
routesV1.route("/blobs", blobRouteV1)
routesV1.route("/referral", referralRouteV1)

export default routesV1;
