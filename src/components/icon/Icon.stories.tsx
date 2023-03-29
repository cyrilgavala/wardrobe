import { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';

const meta = {
  title: 'Components/Icon',
  component: Icon,
  tags: ['autodocs'],
  args: {
    name: 'dryerYes',
    size: '5rem',
  },
} satisfies Meta<typeof Icon>;

export default meta;

export const Playground: StoryObj<typeof meta> = {};
