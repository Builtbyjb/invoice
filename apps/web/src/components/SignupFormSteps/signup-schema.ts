import * as z from "zod";
import { COUNTRY_VALUES } from "@/lib/constant";

export const signupSchema = z.object({
    firstname: z.string().min(2),
    lastname: z.string().min(2),
    email: z.string().email(),
    username: z.string().min(2),
    businessName: z.string().min(2),
    businessType: z.string().min(2),
    businessAddress: z.string().min(2),
    city: z.string().min(2),
    country: z.enum(COUNTRY_VALUES),
    website: z.string(),
});

export type SignupFormSchema = z.infer<typeof signupSchema>;
