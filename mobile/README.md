# ACorp Invoice — React Native (Expo)

React Native rewrite of the SwiftUI app in `../ios/invoice`, following `../instructions/rewrite-plan.md`.
Expo SDK 57 · TypeScript (strict) · expo-router · TanStack Form + Zod · TanStack Query · zustand.

## Run

Expo Go is not supported (remote push, custom native config). Use a development build:

```sh
npm install
npx expo run:ios            # builds the dev client and installs it on the simulator
npx expo start --dev-client # subsequent runs
```

Backend selection (see `.env.example`): `EXPO_PUBLIC_APP_ENV` = `development` | `staging` | `production`
(set per EAS profile in `eas.json`), with an optional `EXPO_PUBLIC_API_URL` override
(physical device → your Mac's LAN IP; Android emulator → `http://10.0.2.2:8585`).

## Checks

```sh
npx tsc --noEmit
npx expo lint
npx jest            # --coverage for the lib/schemas/stores report
```

## Layout

- `src/app/` — routes only (thin screens). `(auth)` = Welcome/Sign In/Sign Up; `(app)/(tabs)` = native tabs with a
  Stack per tab; Help/Notifications/Settings live in the `(app)` Stack so they push over the tab bar.
- `src/features/*` — screen components and React Query hooks per feature.
- `src/lib/api/*` — one function per endpoint; `client.ts` handles bearer auth and the single-flight 401 refresh.
- `src/schemas/*` — Zod schemas (API parsing + form validation) and inferred types.
- `src/stores/*` — zustand stores reachable outside React (auth, notifications, coordinator).

## Deliberate fixes vs. the Swift app (rewrite plan §6)

1–2. The temporary sign-in token stays in memory (`authStore.pendingOtp`) and is passed explicitly to verify-otp;
only the real token is persisted.
5. Search works: Clients uses `GET /clients?name=`, Invoices filters client-side by the client chip and text.
6–7. Invoice and client delete are wired, with confirmation, and the caches update.
8–10. Creating an invoice opens its detail. Save is disabled until a client is chosen. Edit sends the currently
selected client.
11. Edit pre-fills discount and tax.
12–13. The PDF uses the invoice currency and renders "Billed To".
14. The read-only signature scales to fit.
15. Client card shows "City, Country" with no dangling comma.
16. Referral earnings always use one currency format.
17. Save errors show a "Save Failed" alert.
18. New invoices default to the JWT `preferredCurrency`.
19. The client form validates the email format.
20. The Settings footer version comes from `expo-application`.

Other small additions: pull-to-refresh on lists, error states with "Try Again" on the list and detail screens,
and a sign-out confirmation.
A refresh token rejected with any 4xx also signs the user out (Swift only did so on 401); network errors do not.

## Still mocked / open (rewrite plan §8, defaults applied)

- Notifications (`/api/v1/notifications…`) return demo data. Device registration only logs the raw APNs token.
- The PDF keeps the "Your Business Name" / "LOGO" placeholders.
- No pagination (`meta` is parsed but ignored).
- Claim / Setup Payment Method are no-ops. Help, Account, Payment, Legal and Subscriptions are placeholders.
- Android is not polished: date pickers are dialogs, PDF preview falls back to share, push needs FCM credentials.
- App icon and splash are template placeholders until real assets are provided.
