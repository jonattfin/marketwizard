This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The market data queries use Apollo Client against `/graphql`. When running the frontend separately, set `SERVER_HTTPS` or `SERVER_HTTP` to the backend origin (for example, `http://localhost:5329`) before starting Next.js; the Next.js rewrite proxies `/graphql` to that server. Aspire can supply these settings automatically. Endpoints without a corresponding GraphQL operation continue to use REST.

The UI also subscribes to market data refresh notifications over WebSockets at the same origin's `/graphql`. Ensure the frontend proxy supports WebSocket upgrades, or set `NEXT_PUBLIC_GRAPHQL_WS_URL` at build time to the backend's public WebSocket URL (for example, `ws://localhost:5329/graphql`). Use `wss://` for HTTPS pages. Notifications refresh indices and all country-filtered news queries; backend news caching can delay fresh news for up to five minutes. Reconnecting refreshes both datasets to catch up on missed notifications.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
