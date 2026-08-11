import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import Watchlist from "@/app/watchlist/components/watchlist";
import { delay } from "es-toolkit";

import { http, HttpResponse } from "msw";
import { watchlistRepository } from "@/app/database/repository";

const meta = {
  title: "MarketWizard/Watchlist/Watchlist",
  component: Watchlist,
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
    msw: {
      handlers: [
        http.get("/api/watchlists", async () => {
          const watchlists = await watchlistRepository.fetchWatchlist();
          return HttpResponse.json(watchlists);
        }),
      ],
    },
  },
} satisfies Meta<typeof Watchlist>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on component testing: https://storybook.js.org/docs/writing-tests/interaction-testing
export const WithData: Story = {
  play: async ({ canvasElement }) => {
    await delay(1000);

    const canvas = within(canvasElement);
    const selectWatchlist = canvas.getByTestId("watchlist-link");
    await expect(selectWatchlist).toBeDefined();
  },
};
