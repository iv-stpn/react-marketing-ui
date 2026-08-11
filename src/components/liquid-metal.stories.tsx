import type { Meta, StoryObj } from "@storybook/react";
import { LiquidMetal } from "./liquid-metal.js";

const meta = {
  title: "Effects/LiquidMetal",
  component: LiquidMetal,
  decorators: [
    (Story) => (
      <div className="relative h-64 w-96 rounded-xl overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-(--color-foreground) font-bold text-xl z-10">
          Liquid Metal
        </div>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LiquidMetal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
