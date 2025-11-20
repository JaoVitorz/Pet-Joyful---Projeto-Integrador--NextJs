"use client";
import { useState } from "react";
import ChatList from "./chatlist";
import ChatHeader from "./chatheader";
import MessageList from "./messagelist";
import MessageInput from "./messageinput";
import { User } from "../../types/index";

export type Message = {
  sender: "me" | "them";
  text: string;
};

const mockUsers: User[] = [
  {
    id: 1,
    name: "Elisabeth",
    avatar: "https://i.pravatar.cc/150?img=1",
    messages: [
  { sender: "them" as const, text: "Bom dia, tudo bem?" },
      {
  sender: "me" as const,
        text: "Bom dia, tudo ótimo e com você? Como podemos ajudar?",
      },
    ],
  },
  {
    id: 2,
    name: "Roberto",
    avatar: "https://i.pravatar.cc/150?img=2",
    messages: [
  { sender: "them" as const, text: "Olá, gostaria de saber mais sobre adoção." },
  { sender: "me" as const, text: "Claro! Como posso ajudar?" },
    ],
  },
];

export default function Chat() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [activeUserId, setActiveUserId] = useState<number>(mockUsers[0].id);
  const [newMessage, setNewMessage] = useState("");
  const [showChatList, setShowChatList] = useState(true);

  const activeUser = users.find((u) => u.id === activeUserId)!;

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const updatedUsers = users.map((user) =>
      user.id === activeUserId
        ? {
            ...user,
            messages: [...user.messages, { sender: "me" as const, text: newMessage }],
          }
        : user
    );

    setUsers(updatedUsers);
    setNewMessage("");
  };

  const handleSelectUser = (id: number) => {
    setActiveUserId(id);
    // Em mobile, oculta a lista após selecionar
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setShowChatList(false);
    }
  };

  const handleBackToList = () => {
    setShowChatList(true);
  };

  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* Lista de conversas - visível em desktop, controlada em mobile */}
      <div
        className={`${
          showChatList ? "flex" : "hidden"
        } md:flex w-full md:w-1/4 lg:w-1/5 xl:w-1/4 flex-col absolute md:relative inset-0 md:inset-auto z-10 md:z-auto`}
      >
        <ChatList
          users={users}
          activeUserId={activeUserId}
          onSelectUser={handleSelectUser}
        />
      </div>

      {/* Área de mensagens */}
      <div
        className={`${
          showChatList ? "hidden" : "flex"
        } md:flex flex-1 flex-col bg-green-50 min-w-0 w-full`}
      >
        <ChatHeader user={activeUser} onBack={handleBackToList} />
        <MessageList messages={activeUser.messages} />
        <MessageInput
          value={newMessage}
          onChange={setNewMessage}
          onSend={handleSendMessage}
        />
      </div>
    </div>
  );
}
