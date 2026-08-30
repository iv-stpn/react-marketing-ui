import type { Meta, StoryObj } from '@storybook/react';
import { PasswordInput } from './password-input.js';

const meta = {
  title: 'Form/PasswordInput',
  component: PasswordInput,
  args: { label: 'Password', placeholder: 'Enter password' },
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
