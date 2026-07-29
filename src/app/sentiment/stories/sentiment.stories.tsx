import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import {expect, within} from 'storybook/test';

import Sentiment from "@/app/sentiment/page";
import {delay} from "es-toolkit";

const meta = {
  title: 'MarketWizard/Sentiment',
  component: Sentiment,
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
    msw: {
      handlers: []
    }
  },
} satisfies Meta<typeof Sentiment>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithData: Story = {
  play: async ({canvasElement}) => {
    await delay(1000);

    const canvas = within(canvasElement);

    const selectWatchlist = canvas.getByTestId('sentiment-link');
    await expect(selectWatchlist).toBeDefined();
  }
}