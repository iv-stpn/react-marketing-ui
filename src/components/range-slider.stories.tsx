import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { RangeSlider } from './range-slider.js';

function Controlled() {
  const steps = [0, 50, 100, 250, 500];
  const ticks = steps.map((v) => ({
    value: v,
    label: `${v} GB`,
  }));
  const [value, setValue] = useState(100);

  return (
    <div className="max-w-sm">
      <RangeSlider label="Storage" value={value} steps={steps} ticks={ticks} valueLabel={`${value} GB`} onChange={setValue} />
    </div>
  );
}

const meta = {
  title: 'Form/RangeSlider',
  component: Controlled,
} satisfies Meta<typeof Controlled>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
