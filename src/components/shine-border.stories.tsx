import type { Meta, StoryObj } from '@storybook/react';
import { ShineBorder } from './shine-border.js';

const meta = {
  title: 'Effects/ShineBorder',
  component: ShineBorder,
  decorators: [
    (Story) => (
      <div className="relative h-48 w-64 rounded-lg bg-(--color-surface) border border-(--color-border)">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ShineBorder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
