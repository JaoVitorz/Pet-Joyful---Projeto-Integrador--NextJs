// types/index.ts
export type Message = {
  sender: 'me' | 'them';
  text: string;
};

export type User = {
  id: number;
  name: string;
  avatar: string;
  messages: Message[];
};
