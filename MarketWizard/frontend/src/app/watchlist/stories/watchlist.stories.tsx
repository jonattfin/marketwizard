import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { delay } from "es-toolkit";
import { HttpResponse, http } from "msw";
import { expect, within } from "storybook/test";
import { unitOfWork } from "@/app/database/unit-of-work";
import Watchlist from "@/app/watchlist/components/watchlist";

const meta = {
  title: "MarketWizard/Watchlist/Watchlist",
  component: Watchlist,
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
    msw: {
      handlers: [
        http.get("/api/watchlist", async ({ request }) => {
          const cursor = new URL(request.url).searchParams.get("cursor") ?? "0";
          const watchlists =
            await unitOfWork.watchlistRepository.fetchWatchlist(cursor);
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
