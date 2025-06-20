import { User } from '@/types';

type Props = {
  user: User;
};

export default function ChatHeader({ user }: Props) {
  return (
    <div className="bg-green-500 text-white p-4 flex items-center gap-2">
      <img src={user.avatar} className="w-8 h-8 rounded-full" />
      <span className="text-lg font-semibold">{user.name}</span>
    </div>
  );
}
