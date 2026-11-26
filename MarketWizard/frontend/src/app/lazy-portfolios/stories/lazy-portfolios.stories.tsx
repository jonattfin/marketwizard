import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { delay } from "es-toolkit";
import { graphql, HttpResponse } from "msw";
import { expect, within } from "storybook/test";
import { PortfolioRepository } from "@/app/database/repositories/in-memory/portfolio-repository";
import LazyPortfolios from "@/app/lazy-portfolios/page";

const repository = new PortfolioRepository();

const meta = {
  title: "MarketWizard/Lazy Portfolios/Lazy Portfolios List",
  component: LazyPortfolios,
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
    msw: {
      handlers: [
        graphql.query("LazyPortfolios", async () => {
          const [numberOfLazyPortfolios, items] =
            await repository.fetchLazyPortfolios(1, Number.MAX_SAFE_INTEGER);
          return HttpResponse.json({
            data: {
              lazyPortfolios: {
                numberOfLazyPortfolios,
                items: items.map(({ "1d": oneDay, ...portfolio }) => ({
                  ...portfolio,
                  oneDay,
                })),
              },
            },
          });
        }),
      ],
    },
  },
} satisfies Meta<typeof LazyPortfolios>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithData: Story = {
  play: async ({ canvasElement }) => {
    await delay(1000);

    const canvas = within(canvasElement);

    await expect(
      await canvas.findByText("Ray Dalio All Weather Portfolio"),
    ).toBeInTheDocument();
  },
};
