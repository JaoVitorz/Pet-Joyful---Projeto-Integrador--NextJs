import { Message } from '@/types';

type Props = {
  messages: Message[];
};

export default function MessageList({ messages }: Props) {
  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`max-w-sm p-3 rounded-2xl ${
            msg.sender === 'me'
              ? 'self-end bg-green-400 text-white'
              : 'self-start bg-white'
          }`}
        >
          {msg.text}
        </div>
      ))}
    </div>
  );
}
