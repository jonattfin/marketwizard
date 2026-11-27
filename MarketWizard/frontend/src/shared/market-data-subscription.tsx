"use client";

import { type QueryClient, useQueryClient } from "@tanstack/react-query";
import { createClient } from "graphql-ws";
import { useEffect } from "react";

const queryKeys: Record<string, string> = {
  indices: "indices",
  topNews: "top-news",
  sectorPerformance: "sector-performance",
  mapPerformance: "tree-maps",
  topIndustries: "top-industries",
  worstIndustries: "worst-industries",
  topGainers: "top-gainers",
  topLosers: "top-losers",
};

export function subscribeToMarketData(queryClient: QueryClient, url: string) {
  const refresh = (fields: string[]) => {
    for (const field of new Set(fields)) {
      const key = Object.hasOwn(queryKeys, field)
        ? queryKeys[field]
        : undefined;
      if (key) void queryClient.invalidateQueries({ queryKey: [key] });
    }
  };

  const client = createClient({
    url,
    retryAttempts: Infinity,
    on: {
      connected: () => refresh(Object.keys(queryKeys)),
    },
  });
  const unsubscribe = client.subscribe<{
    marketDataUpdated: { fields: string[] };
  }>(
    {
      query:
        "subscription MarketDataUpdated { marketDataUpdated { updatedAt fields } }",
    },
    {
      next: (result) => {
        if (result.data?.marketDataUpdated)
          refresh(result.data.marketDataUpdated.fields);
      },
      error: (error) => console.error("Market data subscription failed", error),
      complete: () => {},
    },
  );

  return () => {
    unsubscribe();
    void client.dispose();
  };
}

export function MarketDataSubscription() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const url =
      process.env.NEXT_PUBLIC_GRAPHQL_WS_URL ||
      `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}/graphql`;
    return subscribeToMarketData(queryClient, url);
  }, [queryClient]);

  return null;
}
