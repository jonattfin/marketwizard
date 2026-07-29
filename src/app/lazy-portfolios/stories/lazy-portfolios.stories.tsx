import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import {expect, within} from 'storybook/test';

import {delay} from "es-toolkit";
import LazyPortfolios from "@/app/lazy-portfolios/page";
import {http, HttpResponse} from "msw";
import {portfolioRepository} from "@/app/database/repository";

const meta = {
  title: 'MarketWizard/Lazy Portfolios/Lazy Portfolios List',
  component: LazyPortfolios,
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
    msw: {
      handlers: [
        http.get('api/lazy-portfolios/all', async () => {
          const portfolios = await portfolioRepository.fetchLazyPortfolios();
          return HttpResponse.json(portfolios);
        }),
      ]
    }
  },
} satisfies Meta<typeof LazyPortfolios>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithData: Story = {
  play: async ({canvasElement}) => {
    await delay(1000);

    const canvas = within(canvasElement);

    const title = canvas.getByTestId('lazy-portfolio-link');
    await expect(title).toBeDefined();
  }
}