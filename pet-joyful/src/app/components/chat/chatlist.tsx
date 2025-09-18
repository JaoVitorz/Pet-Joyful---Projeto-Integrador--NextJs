import Image from "next/image";
import { User } from "../../types";

type Props = {
  users: User[];
  activeUserId: number;
  onSelectUser: (id: number) => void;
};

export default function ChatList({ users, activeUserId, onSelectUser }: Props) {
  return (
    <aside className="w-full md:w-1/4 bg-white border-r p-4 flex flex-col gap-4 min-h-screen">
      <h2 className="text-xl font-bold mb-4 text-green-700">Conversas</h2>
      <div className="flex flex-col gap-2">
        {users.map((user) => (
          <button
            key={user.id}
            onClick={() => onSelectUser(user.id)}
            className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
              user.id === activeUserId
                ? "bg-green-500 text-white"
                : "hover:bg-green-100"
            }`}
          >
            <Image
              src={user.avatar}
              alt={user.name}
              width={40}
              height={40}
              className="rounded-full border"
            />
            <span className="font-medium">{user.name}</span>
          </button>
        ))}
      </div>
      <button className="mt-6 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold transition-colors">
        + Nova conversa
      </button>
    </aside>
  );
}
