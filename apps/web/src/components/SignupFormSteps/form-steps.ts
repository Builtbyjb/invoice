export const STEPS = [
    {
        id: "user",
        fields: ["firstname", "lastname", "email", "username"],
    },
    {
        id: "business",
        fields: ["businessName", "businessType", "website"],
    },
    {
        id: "other",
        fields: ["businessAddress", "city", "country"],
    },
] as const;
