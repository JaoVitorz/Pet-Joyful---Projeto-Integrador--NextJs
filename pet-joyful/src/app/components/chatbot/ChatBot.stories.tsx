import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import ChatBot from './ChatBot';

const meta = {
  title: 'Components/ChatBot',
  component: ChatBot,

  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Chatbot do Pet Joyful com persistência de mensagens, indicador de digitação e integração com o serviço de chat.',
      },
    },
  },

  tags: ['autodocs'],

  argTypes: {
    onClose: {
      description: 'Função chamada ao fechar o chatbot',
      action: 'closed',
    },
  },

  args: {
    onClose: fn(),
  },
} satisfies Meta<typeof ChatBot>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="w-[380px] h-[600px] rounded-2xl overflow-hidden border border-gray-200 shadow-2xl bg-white">
      <ChatBot {...args} />
    </div>
  ),
};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },

  render: (args) => (
    <div className="w-screen h-screen bg-gray-100 flex items-end justify-end p-4">
      <div className="w-full max-w-[360px] h-[600px] rounded-2xl overflow-hidden border border-gray-200 shadow-2xl bg-white">
        <ChatBot {...args} />
      </div>
    </div>
  ),
};

export const Desktop: Story = {
  render: (args) => (
    <div className="w-[420px] h-[700px] rounded-2xl overflow-hidden border border-gray-200 shadow-2xl bg-white">
      <ChatBot {...args} />
    </div>
  ),
};