import type { Meta, StoryObj } from '@storybook/react';
import Header from './Header';

const meta: Meta<typeof Header> = {
  title: 'Common/Header',
  component: Header,

  parameters: {
    layout: 'fullscreen',
  },

  tags: ['autodocs'],

  argTypes: {
    activeLink: {
      control: 'select',
      options: ['home', 'perfil', 'chat'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Header>;

export const Home: Story = {
  args: {
    activeLink: 'home',
  },
};

export const Perfil: Story = {
  args: {
    activeLink: 'perfil',
  },
};

export const Chat: Story = {
  args: {
    activeLink: 'chat',
  },
};

export const Mobile: Story = {
  args: {
    activeLink: 'home',
  },

  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};