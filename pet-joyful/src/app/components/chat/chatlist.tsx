import Image from "next/image";
import { User } from "../../types";

type Props = {
  users: User[];
  activeUserId: number;
  onSelectUser: (id: number) => void;
};

export default function ChatList({ users, activeUserId, onSelectUser }: Props) {
  return (
    <aside className="w-full bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Header fixo */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <h2 className="text-lg md:text-xl font-bold text-green-700">Conversas</h2>
      </div>

      {/* Lista de conversas com scroll */}
      <div className="flex-1 overflow-y-auto p-2 md:p-4">
        <div className="flex flex-col gap-2">
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => onSelectUser(user.id)}
              className={`flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg transition-colors text-left ${
                user.id === activeUserId
                  ? "bg-green-500 text-white"
                  : "hover:bg-green-100 bg-white"
              }`}
            >
              <Image
                src={user.avatar}
                alt={user.name}
                width={40}
                height={40}
                className="rounded-full border-2 border-gray-200 flex-shrink-0 w-10 h-10 md:w-12 md:h-12"
              />
              <span className="font-medium text-sm md:text-base truncate">{user.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Botão fixo no rodapé */}
      <div className="p-3 md:p-4 border-t border-gray-200 bg-white">
        <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 md:py-2.5 rounded-lg font-semibold transition-colors text-sm md:text-base">
          + Nova conversa
        </button>
      </div>
    </aside>
  );
}
