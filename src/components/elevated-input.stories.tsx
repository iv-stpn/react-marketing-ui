import type { Meta, StoryObj } from '@storybook/react';
import { ElevatedInput } from './elevated-input.js';

const meta = {
  title: 'Form/ElevatedInput',
  component: ElevatedInput,
  args: { placeholder: 'Type something...' },
} satisfies Meta<typeof ElevatedInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
