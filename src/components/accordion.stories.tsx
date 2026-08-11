import type { Meta, StoryObj } from '@storybook/react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion.js';

const meta = {
  title: 'Navigation/Accordion',
  component: Accordion,
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Accordion>
      <AccordionItem>
        <AccordionTrigger>What is this?</AccordionTrigger>
        <AccordionContent>A reusable landing-page accordion component.</AccordionContent>
      </AccordionItem>
      <AccordionItem>
        <AccordionTrigger>Can I customize it?</AccordionTrigger>
        <AccordionContent>Yes — use the variant prop for different visual styles.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
