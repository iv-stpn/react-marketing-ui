import type { Meta, StoryObj } from "@storybook/react";
import { RainbowButton } from "./rainbow-button.js";

const meta = {
  title: "Buttons/RainbowButton",
  component: RainbowButton,
  args: { children: "Rainbow" },
} satisfies Meta<typeof RainbowButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
