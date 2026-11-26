import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { delay } from "es-toolkit";
import { graphql, HttpResponse } from "msw";
import { expect, within } from "storybook/test";
import { PortfolioRepository } from "@/app/database/repositories/in-memory/portfolio-repository";
import LazyPortfolioDetails from "@/app/lazy-portfolios/[id]/components/lazy-portfolio-details";

const repository = new PortfolioRepository();

const id = 1;

const meta = {
  title: "MarketWizard/Lazy Portfolios/Lazy Portfolio Details",
  component: LazyPortfolioDetails,
  args: { id: id.toString() },
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
    msw: {
      handlers: [
        graphql.query<{ lazyPortfolioById: unknown }, { id: number }>(
          "LazyPortfolioById",
          async ({ variables }) => {
            const portfolio = await repository.fetchLazyPortfolioById(
              variables.id,
            );
            if (!portfolio)
              return HttpResponse.json({ data: { lazyPortfolioById: null } });
            const { "1d": oneDay, ...rest } = portfolio;
            return HttpResponse.json({
              data: { lazyPortfolioById: { ...rest, oneDay } },
            });
          },
        ),
      ],
    },
  },
} satisfies Meta<typeof LazyPortfolioDetails>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithData: Story = {
  play: async ({ canvasElement }) => {
    await delay(1000);

    const canvas = within(canvasElement);

    const title = await canvas.findByTestId("portfolio-title");
    await expect(title).toHaveTextContent("Ray Dalio All Weather Portfolio");
  },
};
