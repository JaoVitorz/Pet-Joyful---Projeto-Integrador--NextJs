import Image from "next/image";

type User = {
  name: string;
  avatar: string;
};

type Props = {
  user: User;
};

export default function ChatHeader({ user }: Props) {
  return (
    <div className="bg-green-500 text-white p-4 flex items-center gap-2">
      <Image
        src={user.avatar}
        alt={`Avatar de ${user.name}`}
        width={32}
        height={32}
        className="w-8 h-8 rounded-full"
      />
      <span className="text-lg font-semibold">{user.name}</span>
    </div>
  );
}
