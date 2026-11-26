import { afterEach, describe, expect, it, vi } from "vitest";
import { getLazyPortfolioById, getTopGainers } from "./graphql";

afterEach(() => vi.unstubAllGlobals());

describe("GraphQL requests", () => {
  it("sends variables and converts sector enums", async () => {
    const fetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          data: {
            topGainers: {
              date: null,
              items: [{ type: "BASIC_MATERIALS", change: 2, country: "US" }],
            },
          },
        }),
        { headers: { "content-type": "application/json" } },
      ),
    );
    vi.stubGlobal("fetch", fetch);
    const result = await getTopGainers(["US"], "1d");
    expect(result.items[0].type).toBe("Basic Materials");
    const [url, options] = fetch.mock.calls[0];
    expect(url).toBe("/graphql");
    expect(JSON.parse(options.body).variables).toEqual({
      countries: ["US"],
      period: "1d",
    });
  });

  it("normalizes portfolio fields and preserves null results", async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            data: {
              lazyPortfolioById: {
                id: 1,
                name: "Portfolio",
                oneDay: 3,
                items: [{ id: 2, type: "S" }],
              },
            },
          }),
          { headers: { "content-type": "application/json" } },
        ),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ data: { lazyPortfolioById: null } }), {
          headers: { "content-type": "application/json" },
        }),
      );
    vi.stubGlobal("fetch", fetch);
    const result = await getLazyPortfolioById(1);
    expect(result?.["1d"]).toBe(3);
    expect(result?.items[0].type).toBe("s");
    expect(await getLazyPortfolioById(2)).toBeNull();
  });

  it("propagates GraphQL errors", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          new Response(
            JSON.stringify({ errors: [{ message: "backend failed" }] }),
            { headers: { "content-type": "application/json" } },
          ),
        ),
    );
    await expect(getTopGainers([], "1d")).rejects.toThrow("backend failed");
  });
});
