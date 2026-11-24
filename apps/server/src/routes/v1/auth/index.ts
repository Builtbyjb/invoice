import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { handleZodValidate, } from "@/lib/utils";
import { signinSchema, otpSchema, signupSchema } from "./zod-schema";
import { AuthContext, injectService } from "./middleware";

const authRouteV1 = new Hono<AuthContext>();
authRouteV1.use("*", injectService())

authRouteV1.post(
    "/signin",
    zValidator("json", signinSchema, (result, c) => {
        return handleZodValidate(result, c);
    }),
    async (c) => {
        const { email } = c.req.valid("json");
        const authService = c.get("service");

        // TODO: create effect schema and type for SigninRequest
        const tempAccessToken = authService.signin(c, email)

        return c.json({ message: "OTP sent to your email", accessToken: tempAccessToken }, 200);
    },
);

authRouteV1.post(
    "/signup",
    zValidator("json", signupSchema, (result, c) => {
        return handleZodValidate(result, c);
    }),
    async (c) => {
        const data = c.req.valid("json");
        const authService = c.get("service");

        // console.log(data);
        // TODO: Create effect schema and type for SignupRequest
        const tempAccessToken = await authService.signup(c, data)

        return c.json({ message: "OTP sent to your email", accessToken: tempAccessToken }, 200);
    },
);

authRouteV1.post(
    "/verify-otp",
    zValidator("json", otpSchema, (result, c) => {
        return handleZodValidate(result, c);
    }),
    async (c) => {
        // TODO: create effect schema and type for OTPVerifyRequest and rename code to otp
        const { code } = c.req.valid("json");
        const authService = c.get("service")

        const accessToken = await authService.verifyOTP(c, code)

        return c.json({ message: "OTP verified", accessToken }, 200);
    },
);

authRouteV1.get("/signout", async (c) => {
    const authService = c.get("service")
    await authService.signout(c)

    return c.json({ message: "Signout Successful" }, 200);
});

export default authRouteV1;
