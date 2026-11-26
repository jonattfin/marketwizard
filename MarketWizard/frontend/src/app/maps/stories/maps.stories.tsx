import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { delay } from "es-toolkit";
import { graphql, HttpResponse } from "msw";
import { expect, within } from "storybook/test";
import { MiscRepository } from "@/app/database/repositories/in-memory/misc-repository";
import Maps from "@/app/maps/page";

const repository = new MiscRepository();

const meta = {
  title: "MarketWizard/Maps",
  component: Maps,
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
    msw: {
      handlers: [
        graphql.query("Indices", async () => {
          const indices = await repository.fetchIndicesPerformance();
          return HttpResponse.json({ data: { indices } });
        }),
        graphql.query("MapPerformance", async () => {
          const mapPerformance = await repository.fetchMapPerformance();
          return HttpResponse.json({ data: { mapPerformance } });
        }),
      ],
    },
  },
} satisfies Meta<typeof Maps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithData: Story = {
  play: async ({ canvasElement }) => {
    await delay(1000);

    const canvas = within(canvasElement);

    const selectWatchlist = canvas.getByTestId("maps-link");
    await expect(selectWatchlist).toBeDefined();
  },
};
