import type { Meta, StoryObj } from '@storybook/react';
import SkipLink from './SkipLink';


const meta: Meta<typeof SkipLink> = {
  title: 'Components/SkipLink',
  component: SkipLink,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof SkipLink>;

export const Default: Story = {
  render: () => (
    <div className="relative h-screen bg-white p-4">
      <SkipLink />

      <header className="mb-8">
        <h1 className="text-3xl font-bold">Página de Exemplo</h1>
        <p>Navegue usando TAB para visualizar o SkipLink.</p>
      </header>

      <main
        id="main-content"
        className="mt-20 rounded border p-6"
      >
        <h2 className="text-2xl font-semibold">
          Conteúdo Principal
        </h2>

        <p className="mt-4">
          Este é o conteúdo principal da página.
        </p>
      </main>
    </div>
  ),
};