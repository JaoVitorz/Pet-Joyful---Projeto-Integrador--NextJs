"use client";
import { useState } from "react";
import ChatList from "./chatlist";
import ChatHeader from "./chatheader";
import MessageList from "./messagelist";
import MessageInput from "./messageinput";
import { User } from "@/types";

const mockUsers: User[] = [
  {
    id: 1,
    name: "Elisabeth",
    avatar: "https://i.pravatar.cc/150?img=1",
    messages: [
      { sender: "them", text: "Bom dia, tudo bem?" },
      {
        sender: "me",
        text: "Bom dia, tudo ótimo e com você? Como podemos ajudar?",
      },
    ],
  },
  {
    id: 2,
    name: "Roberto",
    avatar: "https://i.pravatar.cc/150?img=2",
    messages: [
      { sender: "them", text: "Olá, gostaria de saber mais sobre adoção." },
      { sender: "me", text: "Claro! Como posso ajudar?" },
    ],
  },
];

export default function Chat() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [activeUserId, setActiveUserId] = useState<number>(mockUsers[0].id);
  const [newMessage, setNewMessage] = useState("");

  const activeUser = users.find((u) => u.id === activeUserId)!;

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const updatedUsers = users.map((user) =>
      user.id === activeUserId
        ? {
            ...user,
            messages: [...user.messages, { sender: "me", text: newMessage }],
          }
        : user
    );

    setUsers(updatedUsers);
    setNewMessage("");
  };

  return (
    <div className="flex h-screen">
      <ChatList
        users={users}
        activeUserId={activeUserId}
        onSelectUser={setActiveUserId}
      />
      <div className="flex-1 flex flex-col bg-green-50">
        <ChatHeader user={activeUser} />
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
