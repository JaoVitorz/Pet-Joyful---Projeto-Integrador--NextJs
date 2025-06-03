type Props = {
  value: string;
  onChange: (text: string) => void;
  onSend: () => void;
};

export default function MessageInput({ value, onChange, onSend }: Props) {
  return (
    <div className="p-4 bg-white flex gap-2">
      <input
        type="text"
        placeholder="Escreva uma mensagem..."
        className="flex-1 border border-gray-300 rounded-full px-4 py-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSend()}
      />
      <button
        onClick={onSend}
        className="bg-green-500 text-white px-6 py-2 rounded-full"
      >
        Enviar
      </button>
    </div>
  );
}
