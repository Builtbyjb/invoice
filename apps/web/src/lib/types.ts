export type Client = {
    id: string;
    organizationId: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    createdAt: Date;
};

export type Currency = {
    symbol: string;
    locale: string;
};

export type User = {
    username: string;
    email: string;
    organizationName: string;
};

export interface AuthState {
    accessToken: string | null;
    user: User | null;
    login: (email: string) => Promise<boolean>;
    logout: () => void;
    refreshToken: () => Promise<AuthResponse>;
    verifyOtp: (otp: string) => Promise<boolean>;
    authenticate: () => Promise<boolean>;
}

export interface Context {
    auth: AuthState | undefined;
}

export interface AuthResponse {
    accessToken: string;
    user: User;
}

export type SignupFormField =
    | "firstname"
    | "lastname"
    | "email"
    | "username"
    | "businessName"
    | "businessType"
    | "website"
    | "businessAddress"
    | "city"
    | "country";

export type FetchInstance = {
    doGET: (url: string) => Promise<Response | Error>;
    doPOST: (url: string, data: any) => Promise<Response | Error>;
    doPUT: (url: string, data: any) => Promise<Response | Error>;
    doDELETE: (url: string) => Promise<Response | Error>;
};

export type SelectData = {
    label: string;
    value: string;
};
