import type { Meta, StoryObj } from "@storybook/react";
import { FadeIn, Stagger, StaggerItem } from "./fade-in.js";

const meta = {
  title: "Animation/FadeIn",
  component: FadeIn,
  args: { children: "Faded in content" },
} satisfies Meta<typeof FadeIn>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const StaggerExample: StoryObj = {
  render: () => (
    <Stagger>
      {Array.from({ length: 5 }, (_, i) => (
        <StaggerItem key={i} className="p-4 border-b border-(--color-border)">
          Item {i + 1}
        </StaggerItem>
      ))}
    </Stagger>
  ),
};
