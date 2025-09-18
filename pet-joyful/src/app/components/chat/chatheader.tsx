import Image from "next/image";
// Update the import path below to the correct relative path where your User type is defined.
// For example, if types.ts is in src/app/types.ts, use:
import { User } from "../../types";
// Or adjust the path as needed.

type Props = {
  user: User;
};

export default function ChatHeader({ user }: Props) {
  return (
    <div className="bg-green-500 text-white p-4 flex items-center gap-2">
      <Image
        src={user.avatar}
        alt={user.name}
        width={32}
        height={32}
        className="w-8 h-8 rounded-full"
      />
      <span className="text-lg font-semibold">{user.name}</span>
    </div>
  );
}
