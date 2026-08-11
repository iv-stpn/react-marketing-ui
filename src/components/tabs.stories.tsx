import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Tabs, type Tab } from "./tabs.js";

const sampleTabs: Tab[] = [
  { id: "monthly", label: "Monthly" },
  { id: "yearly", label: "Yearly", badge: "Save 20%" },
  { id: "lifetime", label: "Lifetime" },
];

function Controlled() {
  const [value, setValue] = useState("monthly");
  return (
    <Tabs
      tabs={sampleTabs}
      value={value}
      onChange={setValue}
      label="Billing period"
    />
  );
}

const meta = {
  title: "Navigation/Tabs",
  component: Controlled,
} satisfies Meta<typeof Controlled>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
