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
    expect(subscribe.mock.calls[0][0].query).toContain("marketDataUpdated");
    const sink = subscribe.mock.calls[0][1];
    sink.next({
      data: {
        marketDataUpdated: { fields: ["indices", "topNews", "unknown"] },
      },
    });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["indices"] });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["top-news"] });
    expect(invalidate).toHaveBeenCalledTimes(2);

    options?.on?.connected?.({} as never, undefined, false);
    expect(invalidate).toHaveBeenCalledTimes(4);
    stop();
    expect(unsubscribe).toHaveBeenCalledOnce();
    expect(dispose).toHaveBeenCalledOnce();
  });
});
