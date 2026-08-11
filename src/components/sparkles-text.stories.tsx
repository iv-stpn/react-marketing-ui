import type { Meta, StoryObj } from "@storybook/react";
import { SparklesText } from "./sparkles-text.js";

const meta = {
  title: "Text/SparklesText",
  component: SparklesText,
  args: { children: "Sparkle" },
} satisfies Meta<typeof SparklesText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
