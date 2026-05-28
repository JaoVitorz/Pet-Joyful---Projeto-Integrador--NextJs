import type { Meta, StoryObj } from '@storybook/react-vite';

import ChatBotWidget from './ChatBotWidget';

const meta = {
  title: 'Components/ChatBotWidget',

  component: ChatBotWidget,

  parameters: {
    layout: 'fullscreen',

    docs: {
      description: {
        component:
          'Widget flutuante do chatbot do Pet Joyful. O componente controla a abertura e fechamento do chat, exibição condicional por rota e animações da interface.',
      },
    },
  },

  tags: ['autodocs'],
} satisfies Meta<typeof ChatBotWidget>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="relative w-full h-screen bg-gray-100 overflow-hidden">
      <div className="p-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Pet Joyful
        </h1>

        <p className="text-gray-600 max-w-xl">
          Página de demonstração do widget de chatbot.
          Clique no botão flutuante no canto inferior direito
          para abrir o assistente virtual.
        </p>
      </div>

      <ChatBotWidget />
    </div>
  ),
};

export const DarkBackground: Story = {
  render: () => (
    <div className="relative w-full h-screen bg-gray-900 overflow-hidden">
      <div className="p-10">
        <h1 className="text-3xl font-bold text-white mb-4">
          Pet Joyful
        </h1>

        <p className="text-gray-300 max-w-xl">
          Exemplo do widget em uma interface escura.
        </p>
      </div>

      <ChatBotWidget />
    </div>
  ),
};

export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },

  render: () => (
    <div className="relative w-screen h-screen bg-gray-100 overflow-hidden">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          Pet Joyful
        </h1>

        <p className="text-gray-600 text-sm">
          Demonstração mobile do chatbot flutuante.
        </p>
      </div>

      <ChatBotWidget />
    </div>
  ),
};