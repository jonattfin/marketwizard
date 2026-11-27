import { QueryClient } from "@tanstack/react-query";
import { createClient } from "graphql-ws";
import { describe, expect, it, vi } from "vitest";
import { subscribeToMarketData } from "./market-data-subscription";

vi.mock("graphql-ws", () => ({ createClient: vi.fn() }));

describe("market data subscription", () => {
  it("refreshes affected queries, catches up on reconnect, and cleans up", () => {
    const unsubscribe = vi.fn();
    const dispose = vi.fn();
    const subscribe = vi.fn().mockReturnValue(unsubscribe);
    vi.mocked(createClient).mockReturnValue({ subscribe, dispose } as never);
    const queryClient = new QueryClient();
    const invalidate = vi
      .spyOn(queryClient, "invalidateQueries")
      .mockResolvedValue();

    const stop = subscribeToMarketData(queryClient, "ws://localhost/graphql");
    const options = vi.mocked(createClient).mock.calls.at(-1)?.[0];
    expect(options?.url).toBe("ws://localhost/graphql");
    expect(subscribe.mock.calls[0][0].query).toContain(
      "marketDataUpdated { updatedAt fields }",
    );
    const sink = subscribe.mock.calls[0][1];
    sink.next({
      data: {
        marketDataUpdated: {
          fields: [
            "indices",
            "topNews",
            "sectorPerformance",
            "mapPerformance",
            "topIndustries",
            "worstIndustries",
            "topGainers",
            "topLosers",
            "topNews",
            "unknown",
          ],
        },
      },
    });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["indices"] });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["top-news"] });
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: ["sector-performance"],
    });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["tree-maps"] });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["top-industries"] });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["worst-industries"] });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["top-gainers"] });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["top-losers"] });
    expect(invalidate).toHaveBeenCalledTimes(8);

    options?.on?.connected?.({} as never, undefined, false);
    expect(invalidate).toHaveBeenCalledTimes(16);
    stop();
    expect(unsubscribe).toHaveBeenCalledOnce();
    expect(dispose).toHaveBeenCalledOnce();
  });

  it("invalidates filtered variants without changing their keys or unrelated data", () => {
    const subscribe = vi.fn().mockReturnValue(vi.fn());
    vi.mocked(createClient).mockReturnValue({
      subscribe,
      dispose: vi.fn(),
    } as never);
    const queryClient = new QueryClient();
    const usa = ["top-gainers", 1, ["USA"]];
    const france = ["top-gainers", 2, ["FRA"]];
    const unrelated = ["top-losers", 1, ["USA"]];
    queryClient.setQueryData(usa, "usa");
    queryClient.setQueryData(france, "france");
    queryClient.setQueryData(unrelated, "losers");

    const stop = subscribeToMarketData(queryClient, "ws://localhost/graphql");
    subscribe.mock.calls[0][1].next({
      data: { marketDataUpdated: { fields: ["topGainers", "constructor"] } },
    });

    expect(queryClient.getQueryState(usa)?.isInvalidated).toBe(true);
    expect(queryClient.getQueryState(france)?.isInvalidated).toBe(true);
    expect(queryClient.getQueryState(unrelated)?.isInvalidated).toBe(false);
    expect(queryClient.getQueryData(usa)).toBe("usa");
    expect(queryClient.getQueryData(france)).toBe("france");
    stop();
  });
});
