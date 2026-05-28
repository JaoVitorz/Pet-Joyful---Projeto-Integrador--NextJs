import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import ProfileHeader from './ProfileHeader';

const meta = {
  title: 'Components/ProfileHeader',

  component: ProfileHeader,

  parameters: {
    layout: 'centered',

    docs: {
      description: {
        component:
          'Cabeçalho de perfil utilizado na área institucional do Pet Joyful. Permite visualizar e atualizar foto de perfil, além de exibir nome e biografia da organização.',
      },
    },
  },

  tags: ['autodocs'],

  argTypes: {
    nome: {
      control: 'text',
      description: 'Nome da instituição ou usuário',
    },

    bio: {
      control: 'text',
      description: 'Descrição do perfil',
    },

    avatar: {
      control: 'text',
      description: 'URL da imagem de perfil',
    },

    onAvatarUpdate: {
      description: 'Callback disparado ao atualizar a foto',
      action: 'avatarUpdated',
    },
  },

  args: {
    onAvatarUpdate: fn(),
  },
} satisfies Meta<typeof ProfileHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    nome: 'AATAN - Sorocaba',

    bio: 'Associação de proteção animal oferecendo abrigo e cuidados para animais em situação de vulnerabilidade.',

    avatar: '/assets/aatan-logo.jpg',
  },

  render: (args) => (
    <div className="max-w-3xl p-6 bg-gray-100">
      <ProfileHeader {...args} />
    </div>
  ),
};

export const LongBio: Story = {
  args: {
    nome: 'ONG Patinhas Felizes',

    bio: 'Organização sem fins lucrativos dedicada ao resgate, tratamento e adoção responsável de cães e gatos abandonados. Atuamos com campanhas de conscientização, feiras de adoção e apoio veterinário para animais em situação de risco.',

    avatar: '/assets/aatan-logo.jpg',
  },

  render: (args) => (
    <div className="max-w-4xl p-6 bg-gray-100">
      <ProfileHeader {...args} />
    </div>
  ),
};

export const WithoutAvatar: Story = {
  args: {
    nome: 'Pet Joyful',

    bio: 'Perfil sem imagem personalizada para demonstração do fallback.',

    avatar: '',
  },

  render: (args) => (
    <div className="max-w-3xl p-6 bg-gray-100">
      <ProfileHeader {...args} />
    </div>
  ),
};

export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },

  args: {
    nome: 'AATAN - Sorocaba',

    bio: 'Visualização mobile do cabeçalho de perfil.',

    avatar: '/assets/aatan-logo.jpg',
  },

  render: (args) => (
    <div className="w-screen min-h-screen bg-gray-100 p-4">
      <ProfileHeader {...args} />
    </div>
  ),
};