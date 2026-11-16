import type { ConfigContext, ExpoConfig } from "expo/config";

type AppEnv = "development" | "staging" | "production";

const APP_ENV = (process.env.EXPO_PUBLIC_APP_ENV as AppEnv | undefined) ?? "development";

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: "ACorp Invoice",
    slug: "acorp-invoice",
    scheme: "acorpinvoice",
    version: "0.1.0",
    orientation: "default",
    userInterfaceStyle: "automatic",
    icon: "./assets/images/icon.png",
    ios: {
        bundleIdentifier: "com.acorp.invoice",
        supportsTablet: true,
        infoPlist: {
            UIBackgroundModes: ["remote-notification"],
            NSAppTransportSecurity: { NSAllowsLocalNetworking: true },
            ITSAppUsesNonExemptEncryption: false,
        },
    },
    android: {
        package: "com.acorp.invoice",
        adaptiveIcon: {
            backgroundColor: "#E6F4FE",
            foregroundImage: "./assets/images/android-icon-foreground.png",
            backgroundImage: "./assets/images/android-icon-background.png",
            monochromeImage: "./assets/images/android-icon-monochrome.png",
        },
        predictiveBackGestureEnabled: false,
    },
    web: {
        output: "static",
        favicon: "./assets/images/favicon.png",
    },
    plugins: [
        "expo-router",
        "expo-secure-store",
        "expo-sharing",
        "@react-native-community/datetimepicker",
        [
            "expo-notifications",
            {
                mode: APP_ENV === "development" ? "development" : "production",
                enableBackgroundRemoteNotifications: true,
            },
        ],
        [
            "expo-splash-screen",
            {
                backgroundColor: "#FFFFFF",
                image: "./assets/images/splash-icon.png",
                imageWidth: 76,
                dark: { backgroundColor: "#000000" },
            },
        ],
    ],
    experiments: {
        typedRoutes: true,
    },
    extra: {
        appEnv: APP_ENV,
    },
});
