type Props = {
  value: string;
  onChange: (text: string) => void;
  onSend: () => void;
};

export default function MessageInput({ value, onChange, onSend }: Props) {
  return (
    <div className="p-3 md:p-4 bg-white border-t border-gray-200 flex gap-2 md:gap-3">
      <input
        type="text"
        placeholder="Escreva uma mensagem..."
        className="flex-1 border border-gray-300 rounded-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSend()}
      />
      <button
        onClick={onSend}
        className="bg-green-500 hover:bg-green-600 text-white px-4 md:px-6 py-2 md:py-2.5 rounded-full font-semibold transition-colors text-sm md:text-base min-w-[80px] md:min-w-[100px] disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!value.trim()}
      >
        Enviar
      </button>
    </div>
  );
}
