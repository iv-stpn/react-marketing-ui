import type { Meta, StoryObj } from '@storybook/react';
import { FeatureCard } from './feature-card.js';

const meta = {
  title: 'Layout/FeatureCard',
  component: FeatureCard,
  args: {
    icon: <span className="text-lg">★</span>,
    title: 'Feature Title',
    body: 'Feature description goes here.',
  },
} satisfies Meta<typeof FeatureCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
