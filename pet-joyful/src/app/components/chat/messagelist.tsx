import { Message } from '../../types';

type Props = {
  messages: Message[];
};

export default function MessageList({ messages }: Props) {
  return (
    <div className="flex-1 overflow-y-auto p-3 md:p-4 flex flex-col gap-2 md:gap-3">
      {messages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-500 text-sm md:text-base">
          <p>Nenhuma mensagem ainda. Comece a conversar!</p>
        </div>
      ) : (
        messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[85%] sm:max-w-sm md:max-w-md lg:max-w-lg p-3 md:p-4 rounded-2xl break-words ${
              msg.sender === 'me'
                ? 'self-end bg-green-400 text-white rounded-br-sm'
                : 'self-start bg-white text-gray-800 rounded-bl-sm shadow-sm'
            }`}
          >
            <p className="text-sm md:text-base leading-relaxed">{msg.text}</p>
          </div>
        ))
      )}
    </div>
  );
}
