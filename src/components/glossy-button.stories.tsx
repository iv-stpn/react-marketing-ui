import type { Meta, StoryObj } from '@storybook/react';
import { GlossyButton } from './glossy-button.js';

const meta = {
  title: 'Buttons/GlossyButton',
  component: GlossyButton,
  args: { children: 'Click me', actionOrLink: () => {} },
} satisfies Meta<typeof GlossyButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = {};
export const Accent: Story = { args: { variant: 'accent' } };
