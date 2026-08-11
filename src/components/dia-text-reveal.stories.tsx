import type { Meta, StoryObj } from '@storybook/react';
import { DiaTextReveal } from './dia-text-reveal.js';

const meta = {
  title: 'Text/DiaTextReveal',
  component: DiaTextReveal,
  args: { text: 'Dia Text Reveal', startOnView: false },
} satisfies Meta<typeof DiaTextReveal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Rotating: Story = {
  args: {
    text: ['Design', 'Build', 'Ship'],
    repeat: true,
    startOnView: false,
  },
};
