import { User } from '@/types';

type Props = {
  users: User[];
  activeUserId: number;
  onSelectUser: (id: number) => void;
};

export default function ChatList({ users, activeUserId, onSelectUser }: Props) {
  return (
    <div className="w-1/4 bg-green-100 p-4 flex flex-col gap-4">
      <h2 className="text-xl font-bold mb-2">Suas conversas</h2>
      {users.map((user) => (
        <button
          key={user.id}
          onClick={() => onSelectUser(user.id)}
          className={`flex items-center gap-2 p-2 rounded-full ${
            user.id === activeUserId ? 'bg-green-500 text-white' : 'bg-white'
          }`}
        >
          <img src={user.avatar} className="w-8 h-8 rounded-full" />
          {user.name}
        </button>
      ))}
      <button className="mt-auto bg-green-500 text-white py-2 rounded-full">
        Iniciar conversa
      </button>
    </div>
  );
}
