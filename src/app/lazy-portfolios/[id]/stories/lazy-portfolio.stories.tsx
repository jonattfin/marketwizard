import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import {expect, within} from 'storybook/test';

import {delay} from "es-toolkit";
import LazyPortfolioDetails from "@/app/lazy-portfolios/[id]/components/lazy-portfolio-details";
import {http, HttpResponse} from "msw";
import {portfolioRepository} from "@/app/database/repository";

const id = 1;

const meta = {
  title: 'MarketWizard/Lazy Portfolios/Lazy Portfolio Details',
  component: LazyPortfolioDetails,
  args: {id: id.toString()},
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
    msw: {
      handlers: [
        http.get(`api/lazy-portfolios/${id}`, async () => {
          const portfolio = await portfolioRepository.fetchLazyPortfolioById(id);
          return HttpResponse.json(portfolio);
        }),
      ]
    }
  },
} satisfies Meta<typeof LazyPortfolioDetails>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithData: Story = {
  play: async ({canvasElement}) => {
    await delay(1000);

    const canvas = within(canvasElement);

    const title = canvas.getByTestId('portfolio-title');
    await expect(title).toBeDefined();
  }
}