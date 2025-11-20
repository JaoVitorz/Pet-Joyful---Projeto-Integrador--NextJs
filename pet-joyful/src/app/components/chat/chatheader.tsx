import Image from "next/image";
import { User } from "../../types";

type Props = {
  user: User;
  onBack?: () => void;
};

export default function ChatHeader({ user, onBack }: Props) {
  return (
    <div className="bg-green-500 text-white p-3 md:p-4 flex items-center gap-2 md:gap-3 border-b border-green-600 shadow-sm">
      {/* Botão voltar - apenas em mobile */}
      {onBack && (
        <button
          onClick={onBack}
          className="md:hidden p-2 hover:bg-green-600 rounded-lg transition-colors"
          aria-label="Voltar para lista de conversas"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}
      
      <Image
        src={user.avatar}
        alt={user.name}
        width={40}
        height={40}
        className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white flex-shrink-0"
      />
      <span className="text-base md:text-lg font-semibold truncate flex-1">
        {user.name}
      </span>
    </div>
  );
}
