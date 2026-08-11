import type { Meta, StoryObj } from "@storybook/react";
import { Highlighter } from "./highlighter.js";

const meta = {
  title: "Text/Highlighter",
  component: Highlighter,
  args: { children: "Highlighted text" },
} satisfies Meta<typeof Highlighter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
