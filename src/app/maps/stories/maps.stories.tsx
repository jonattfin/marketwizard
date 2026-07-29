import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import {expect, within} from 'storybook/test';

import Maps from "@/app/maps/page";
import {delay} from "es-toolkit";
import {http, HttpResponse} from "msw";
import {miscRepository} from "@/app/database/repository";

const meta = {
  title: 'MarketWizard/Maps',
  component: Maps,
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
    msw: {
      handlers: [
         http.get('/api/dashboard/performance', async () => {
          const data = await miscRepository.fetchIndicesPerformance();
          return HttpResponse.json(data);
        }),
        http.get('/api/treemap', async () => {
          const data = await miscRepository.fetchMapPerformance();
          return HttpResponse.json(data);
        }),
      ]
    }
  },
} satisfies Meta<typeof Maps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithData: Story = {
  play: async ({canvasElement}) => {
    await delay(1000);

    const canvas = within(canvasElement);

    const selectWatchlist = canvas.getByTestId('maps-link');
    await expect(selectWatchlist).toBeDefined();
  }
}