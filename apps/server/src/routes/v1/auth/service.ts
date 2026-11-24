import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { UserRepository } from "../user/respository";
import { AuthContext } from "./middleware";
import { otpTemplate } from "@/templates/util";
import { fillTemplate } from "@/lib/utils";
import type { TokenPayload, BaseTokenPayload } from "@/lib/types";
import { verify, sign } from "hono/jwt";

export class AuthService {
    private readonly userRepo: UserRepository
    private readonly ACCESS_TOKEN_MAX_AGE = 1800; // 30 mins
    private readonly REFRESH_TOKEN_MAX_AGE = 7_776_000; // 90 days

    constructor(userRepository: UserRepository) {
        this.userRepo = userRepository
    }

    public async signin(c: Context<AuthContext>, email: string): Promise<string> {
        const user = await this.userRepo.findUserByEmail(email)
        if (!user) throw new HTTPException(400, { message: "User with this email does not exist" })

        const otp = await this.sendOTPEmail(c.env.OTP_EMAIL, email, c.env.SEND_EMAIL.send);

        const payload: TokenPayload = {
            userID: user.id,
            email: user.email,
            firstname: user.firstname,
            currentOrgID: user.currentOrgID,
            otp: otp,
            exp: this.getAccessTokenExp(),
        };

        return await sign(payload, c.env.JWT_SECRET);
    }

    public async signup(c: Context<AuthContext>, data: any): Promise<string> {
        // Check if user already exists
        const prevUser = this.userRepo.findUserByEmail(data.email)
        if (prevUser === null) {
            throw new HTTPException(400, { message: "A User with this email address exists" })
        }

        const { user, org } = await this.userRepo.createSuperAdminUser(data)

        const otp = await this.sendOTPEmail(c.env.OTP_EMAIL, user.email, c.env.SEND_EMAIL.send);


        const payload: TokenPayload = {
            userID: user.id,
            email: user.email,
            firstname: user.firstname,
            currentOrgID: org.id,
            otp: otp,
            exp: this.getAccessTokenExp(),
        };

        return await sign(payload, c.env.JWT_SECRET);
    }

    public async verifyOTP(c: Context<AuthContext>, otp: string): Promise<string> {

        const tempAccessToken = AuthService.getTokenFromHeader(c);
        if (!tempAccessToken) throw new HTTPException(404, { message: "Access token not found" })

        const parsed = (await verify(tempAccessToken, c.env.JWT_SECRET, "HS256")) as TokenPayload;

        const basePayload: BaseTokenPayload = {
            userID: parsed.userID,
            firstname: parsed.firstname,
            email: parsed.email,
            currentOrgID: parsed.currentOrgID,
        };

        const accessPayload: TokenPayload = {
            ...basePayload,
            exp: this.getAccessTokenExp(),
        };

        const accessToken = await sign(accessPayload, c.env.JWT_SECRET);

        const refreshPayload: TokenPayload = {
            ...basePayload,
            exp: this.getRefreshTokenExp(),
        };

        const refreshToken = await sign(refreshPayload, c.env.JWT_SECRET);

        // Store refresh token
        c.env.KV_STORE.put(AuthService.get_kv_refresh_token_id(parsed.userID), refreshToken, {
            expirationTtl: this.REFRESH_TOKEN_MAX_AGE
        })

        return accessToken
    }

    public async signout(c: Context<AuthContext>) {
        const accessToken = AuthService.getTokenFromHeader(c);
        if (accessToken) {
            const parsed = (await verify(accessToken, c.env.JWT_SECRET, "HS256")) as TokenPayload;
            c.env.KV_STORE.delete(AuthService.get_kv_refresh_token_id(parsed.userID))
        }
    }

    private async sendOTPEmail(
        senderEmail: string,
        userEmail: string,
        sendFn: (email: {
            to: string;
            from: string;
            subject: string;
            text: string;
            html?: string;
        }) => Promise<any>,
    ): Promise<string> {

        const otp = this.generateOTP()

        const htmlBody = fillTemplate(otpTemplate, { OTP_CODE: otp });

        // Send OTP to user email
        await sendFn({
            from: `ACorp Invoice <${senderEmail}>`,
            to: userEmail,
            subject: "Your OTP code",
            html: htmlBody,
            text: `Your one time passcode is: ${otp}`,
        });

        return otp
    }

    private generateOTP(): string {
        const otp = (crypto.getRandomValues(new Uint32Array(1))[0] % 90000000) + 10000000;
        return otp.toString();
    }

    private getAccessTokenExp() {
        return Math.floor(Date.now() / 1000) + this.ACCESS_TOKEN_MAX_AGE;
    }

    private getRefreshTokenExp() {
        return Math.floor(Date.now() / 1000) + this.REFRESH_TOKEN_MAX_AGE;
    }

    static getTokenFromHeader(c: Context): string | null {
        const auth_header_prefix = "Bearer ";

        const authHeader = c.req.header("Authorization");
        if (authHeader?.startsWith(auth_header_prefix)) {
            return authHeader.slice(auth_header_prefix.length);
        }
        return null;
    }

    static get_kv_refresh_token_id(userID: number): string {
        return `refresh_token:${userID}`
    }
}

// export async function validateReferral(db: NodePgDatabase, referral: string): Promise<number | null> {
//     const org = await db
//         .select()
//         .from(organizations)
//         .where(eq(organizations.referralCode, referral))
//         .then((result) => result[0]);
//
//     return org ? org.id : null;
// }
