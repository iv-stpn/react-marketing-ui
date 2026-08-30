import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './input.js';

const meta = {
  title: 'Form/Input',
  component: Input,
  args: { label: 'Email', placeholder: 'you@example.com' },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
  args: { error: 'Please enter a valid email', label: 'Email' },
};

export const WithHint: Story = {
  args: { hint: 'We will never share your email', label: 'Email' },
};
