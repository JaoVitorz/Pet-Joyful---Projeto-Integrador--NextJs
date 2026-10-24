"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { BiArrowBack, BiSearch, BiSend } from "react-icons/bi";
import {
  ChatUser,
  DirectConversation,
  DirectMessage,
  DirectMessageEvent,
  connectDirectChat,
  directChatService,
} from "@/app/services/directChatService";

export default function Chat() {
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [conversations, setConversations] = useState<DirectConversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<DirectConversation | null>(null);
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [showList, setShowList] = useState(true);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [realtimeConnected, setRealtimeConnected] = useState(false);
  const activeConversationIdRef = useRef<string | null>(null);
  const currentUserIdRef = useRef("");
  const showListRef = useRef(true);

  const refreshConversations = useCallback(async () => {
    const nextConversations = await directChatService.listConversations();
    setConversations(nextConversations);
  }, []);

  useEffect(() => {
    try {
      const rawUser = localStorage.getItem("user");
      if (rawUser) {
        const user = JSON.parse(rawUser) as { id?: string | number; _id?: string };
        const userId = String(user.id ?? user._id ?? "");
        currentUserIdRef.current = userId;
        setCurrentUserId(userId);
      }
    } catch {
      setCurrentUserId("");
    }

    let active = true;
    const load = async () => {
      try {
        const [nextUsers, nextConversations] = await Promise.all([
          directChatService.listUsers(),
          directChatService.listConversations(),
        ]);
        setUsers(nextUsers);
        setConversations(nextConversations);
        if (active) setError("");
      } catch (cause) {
        if (active) setError(cause instanceof Error ? cause.message : "Não foi possível carregar o chat.");
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    activeConversationIdRef.current = activeConversation?.id ?? null;
  }, [activeConversation]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const socket = connectDirectChat(token);
    socket.on("connect", () => setRealtimeConnected(true));
    socket.on("disconnect", () => setRealtimeConnected(false));
    socket.on("connect_error", () => setRealtimeConnected(false));
    socket.on("direct-message:new", (event: DirectMessageEvent) => {
      const isIncoming = event.message.senderId !== currentUserIdRef.current;
      const isSelected = activeConversationIdRef.current === event.conversationId;
      const isOpen = isSelected && !showListRef.current && document.visibilityState === "visible";
      setConversations((previous) => {
        const conversation = previous.find((item) => item.id === event.conversationId);
        if (!conversation) {
          void refreshConversations().catch(() => undefined);
          return previous;
        }
        const updated = {
          ...conversation,
          lastMessage: event.message.text,
          lastMessageAt: event.message.createdAt,
          unreadCount: isIncoming && !isOpen ? (conversation.unreadCount ?? 0) + 1 : 0,
        };
        return [updated, ...previous.filter((item) => item.id !== event.conversationId)]
          .sort((a, b) => new Date(b.lastMessageAt || 0).getTime() - new Date(a.lastMessageAt || 0).getTime());
      });
      if (isSelected) {
        setMessages((previous) => previous.some((message) => message.id === event.message.id)
          ? previous
          : [...previous, event.message]);
      }
      if (isOpen && isIncoming) {
        void directChatService.markRead(event.conversationId).catch(() => undefined);
      }
    });
    return () => {
      socket.disconnect();
      setRealtimeConnected(false);
    };
  }, [refreshConversations]);

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(() => {
      void directChatService.listUsers(search).then((result) => {
        if (active) setUsers(result);
      }).catch((cause) => {
        if (active && search.trim()) {
          setError(cause instanceof Error ? cause.message : "Não foi possível pesquisar usuários.");
        }
      });
    }, 250);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [search]);

  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      const result = await directChatService.listMessages(conversationId);
      setMessages(result);
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível carregar as mensagens.");
    }
  }, []);

  useEffect(() => {
    if (!activeConversation) {
      setMessages([]);
      return;
    }
    setMessages([]);
    setConversations((previous) => previous.map((conversation) => conversation.id === activeConversation.id
      ? { ...conversation, unreadCount: 0 }
      : conversation));
    void directChatService.markRead(activeConversation.id).catch(() => undefined);
    void loadMessages(activeConversation.id);
  }, [activeConversation, loadMessages]);

  const visibleUsers = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("pt-BR");
    return users.filter((user) => (user.name || user.nome || "").toLocaleLowerCase("pt-BR").includes(query))
      .sort((first, second) => {
        const firstConversation = conversations.find((conversation) => conversation.user.id === first.id);
        const secondConversation = conversations.find((conversation) => conversation.user.id === second.id);
        if (!firstConversation && !secondConversation) return (first.name || first.nome || "").localeCompare(second.name || second.nome || "", "pt-BR");
        if (!firstConversation) return 1;
        if (!secondConversation) return -1;
        return new Date(secondConversation.lastMessageAt || 0).getTime() - new Date(firstConversation.lastMessageAt || 0).getTime();
      });
  }, [users, search, conversations]);

  const openUser = async (user: ChatUser) => {
    setError("");
    try {
      let conversation = conversations.find((item) => item.user.id === user.id);
      if (!conversation) {
        conversation = await directChatService.createConversation(user.id);
        setConversations((previous) => [conversation!, ...previous]);
      }
      setActiveConversation(conversation);
      activeConversationIdRef.current = conversation.id;
      showListRef.current = false;
      setShowList(false);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível abrir a conversa.");
    }
  };

  const handleSend = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || !activeConversation || sending) return;

    setSending(true);
    setError("");
    try {
      const sent = await directChatService.sendMessage(activeConversation.id, text);
      setMessages((previous) => previous.some((message) => message.id === sent.id)
        ? previous
        : [...previous, sent]);
      setDraft("");
      void refreshConversations();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível enviar a mensagem.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <main className="flex min-h-[60vh] items-center justify-center text-gray-600">Carregando conversas...</main>;
  }

  if (error && !users.length && !conversations.length) {
    return (
      <main className="mx-auto my-8 max-w-lg rounded-xl bg-white p-6 text-center shadow">
        <p className="mb-4 text-red-700">{error}</p>
        <Link href="/login" className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white">Entrar</Link>
      </main>
    );
  }

  return (
    <main className="mx-auto flex h-[calc(100dvh-120px)] min-h-[480px] max-w-7xl overflow-hidden bg-white md:my-6 md:rounded-2xl md:shadow-lg">
      <aside className={`${showList ? "flex" : "hidden"} w-full flex-col border-r border-gray-200 md:flex md:w-80 lg:w-96`}>
        <div className="border-b border-gray-200 p-4">
          <h1 className="mb-3 text-xl font-bold text-green-800">Mensagens</h1>
          <label className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 focus-within:ring-2 focus-within:ring-green-500">
            <BiSearch className="text-gray-500" aria-hidden="true" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar pessoas"
              aria-label="Buscar usuários para conversar"
              className="min-w-0 flex-1 py-2 outline-none"
            />
          </label>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {visibleUsers.length ? visibleUsers.map((user) => {
            const conversation = conversations.find((item) => item.user.id === user.id);
            const selected = activeConversation?.user.id === user.id;
            return (
              <button
                key={user.id}
                onClick={() => void openUser(user)}
                className={`mb-1 flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${selected ? "bg-green-100" : "hover:bg-gray-100"}`}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100 font-bold text-green-800" aria-hidden="true">
                  {(user.name || user.nome || "?").trim().charAt(0).toLocaleUpperCase("pt-BR")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold text-gray-900">{user.name || user.nome}</span>
                  <span className="block truncate text-sm text-gray-500">{conversation?.lastMessage || user.tipo || "Iniciar conversa"}</span>
                </span>
                {(conversation?.unreadCount ?? 0) > 0 && (
                  <span className="flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full bg-red-600 px-1.5 text-xs font-bold text-white" aria-label={`${conversation?.unreadCount} mensagens não lidas`}>
                    {(conversation?.unreadCount ?? 0) > 99 ? "99+" : conversation?.unreadCount}
                  </span>
                )}
              </button>
            );
          }) : <p className="p-4 text-center text-sm text-gray-500">Nenhum usuário encontrado.</p>}
        </div>
      </aside>

      <section className={`${showList ? "hidden" : "flex"} min-w-0 flex-1 flex-col md:flex`} aria-label="Conversa">
        {activeConversation ? (
          <>
            <header className="flex items-center gap-3 border-b border-gray-200 bg-white p-3 md:p-4">
              <button onClick={() => { showListRef.current = true; setShowList(true); }} className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden" aria-label="Voltar para usuários">
                <BiArrowBack size={22} />
              </button>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 font-bold text-green-800" aria-hidden="true">
                {(activeConversation.user.name || activeConversation.user.nome || "?").trim().charAt(0).toLocaleUpperCase("pt-BR")}
              </span>
              <div className="min-w-0">
                <h2 className="truncate font-semibold text-gray-900">{activeConversation.user.name || activeConversation.user.nome}</h2>
                <p className={`text-xs ${realtimeConnected ? "text-green-700" : "text-amber-700"}`}>{realtimeConnected ? "Conectado em tempo real" : "Reconectando ao chat..."}</p>
              </div>
            </header>
            <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-4" aria-live="polite">
              {messages.length ? messages.map((message) => {
                const mine = message.senderId === currentUserId;
                return (
                  <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 ${mine ? "rounded-br-sm bg-green-600 text-white" : "rounded-bl-sm bg-white text-gray-900 shadow-sm"}`}>
                      <p>{message.text}</p>
                      <time className={`mt-1 block text-right text-[11px] ${mine ? "text-green-100" : "text-gray-500"}`} dateTime={message.createdAt}>
                        {new Date(message.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                      </time>
                    </div>
                  </div>
                );
              }) : <div className="flex h-full items-center justify-center text-center text-gray-500">Nenhuma mensagem ainda. Envie a primeira.</div>}
            </div>
            {error && <p role="alert" className="bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>}
            <form onSubmit={(event) => { void handleSend(event); }} className="flex gap-2 border-t border-gray-200 bg-white p-3 md:p-4">
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                maxLength={2000}
                placeholder="Escreva uma mensagem..."
                aria-label="Mensagem"
                className="min-w-0 flex-1 rounded-full border border-gray-300 px-4 py-2.5 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
              <button type="submit" disabled={!draft.trim() || sending} className="flex items-center gap-2 rounded-full bg-green-600 px-4 py-2.5 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50">
                <BiSend aria-hidden="true" /> <span className="hidden sm:inline">{sending ? "Enviando" : "Enviar"}</span>
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center text-gray-500">
            <span className="mb-3 text-5xl" aria-hidden="true">🐾</span>
            <p className="font-semibold text-gray-700">Escolha alguém para conversar</p>
            <p className="mt-1 text-sm">As mensagens ficam salvas e aparecem para os participantes.</p>
          </div>
        )}
      </section>
      {error && !activeConversation && <p role="alert" className="sr-only">{error}</p>}
    </main>
  );
}
