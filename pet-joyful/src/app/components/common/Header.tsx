"use client";

import Link from "next/link";
import Image from "next/image";
import {
  BiHome,
  BiUser,
  BiMessageDetail,
  BiBell,
  BiListUl,
  BiLogOut,
  BiImageAlt,
  BiBot,
  BiHeartCircle,
  BiPen,
} from "react-icons/bi";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { connectDirectChat, directChatService, type DirectMessageEvent } from "@/app/services/directChatService";

type HeaderNotification = {
  id: string;
  user: string;
  type: string;
  avatar: string;
  href: string;
  createdAt: string;
  read: boolean;
  conversationId?: string;
};

function playNotificationSound() {
  try {
    const context = new window.AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = 880;
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, context.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.18);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.2);
    oscillator.onended = () => void context.close();
  } catch {
    // O aviso visual continua disponível se o navegador bloquear áudio.
  }
}

interface HeaderProps {
  activeLink?: string;
}

export default function Header({ activeLink }: HeaderProps) {
  const router = useRouter();
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<HeaderNotification[]>([]);
  const [notificationsReady, setNotificationsReady] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("");
  const settingsRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const settingsButtonRef = useRef<HTMLButtonElement>(null);
  const notificationsButtonRef = useRef<HTMLButtonElement>(null);

  const unreadNotificationCount = notifications.filter((notification) => !notification.read).length;

  useEffect(() => {
    const token = localStorage.getItem("token");
    let userId = "";
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null") as { id?: string | number; _id?: string } | null;
      userId = String(user?.id ?? user?._id ?? "");
    } catch {
      userId = "";
    }
    setCurrentUserId(userId);
    if (!token || !userId) {
      setNotificationsReady(true);
      return;
    }

    const notificationKey = `pet-joyful:notifications:${userId}`;
    const seenPostsKey = `pet-joyful:seen-posts:${userId}`;
    try {
      const saved = JSON.parse(localStorage.getItem(notificationKey) || "[]") as HeaderNotification[];
      setNotifications(Array.isArray(saved) ? saved : []);
    } catch {
      setNotifications([]);
    }
    setNotificationsReady(true);

    const publish = (notification: HeaderNotification) => {
      setNotifications((previous) => [notification, ...previous].slice(0, 50));
      playNotificationSound();
    };

    const socket = connectDirectChat(token);
    socket.on("direct-message:new", (event: DirectMessageEvent) => {
      if (event.message.senderId === userId) return;
      publish({
        id: `message:${event.message.id}`,
        user: event.senderName || "Nova mensagem",
        type: "enviou uma mensagem para você.",
        avatar: "/assets/imgPerfilM.png",
        href: "/Chat",
        createdAt: event.message.createdAt,
        read: false,
        conversationId: event.conversationId,
      });
    });

    void directChatService.listConversations().then((conversations) => {
      const unread = conversations.filter((conversation) => (conversation.unreadCount ?? 0) > 0);
      if (!unread.length) return;
      setNotifications((previous) => {
        const existingConversations = new Set(previous.map((notification) => notification.conversationId).filter(Boolean));
        const restored = unread
          .filter((conversation) => !existingConversations.has(conversation.id))
          .map((conversation): HeaderNotification => ({
            id: `unread:${conversation.id}:${conversation.lastMessageAt || "latest"}`,
            user: conversation.user.name || conversation.user.nome || "Contato",
            type: conversation.unreadCount === 1 ? "enviou uma mensagem para você." : `enviou ${conversation.unreadCount} mensagens para você.`,
            avatar: "/assets/imgPerfilM.png",
            href: "/Chat",
            createdAt: conversation.lastMessageAt || new Date().toISOString(),
            read: false,
            conversationId: conversation.id,
          }));
        if (restored.length) playNotificationSound();
        return [...restored, ...previous].slice(0, 50);
      });
    }).catch(() => undefined);

    let postPollRunning = false;
    const pollPosts = async () => {
      if (postPollRunning) return;
      postPollRunning = true;
      try {
        const response = await fetch("/api/posts?limit=10", { cache: "no-store" });
        if (!response.ok) return;
        const data = await response.json() as { data?: Array<Record<string, unknown>>; posts?: Array<Record<string, unknown>> };
        const posts = Array.isArray(data.data) ? data.data : Array.isArray(data.posts) ? data.posts : [];
        const ids = posts.map((post) => String(post._id ?? post.id ?? "")).filter(Boolean);
        let knownIds: string[] = [];
        try {
          knownIds = JSON.parse(localStorage.getItem(seenPostsKey) || "[]") as string[];
        } catch {
          knownIds = [];
        }
        if (!localStorage.getItem(seenPostsKey)) {
          localStorage.setItem(seenPostsKey, JSON.stringify(ids));
          return;
        }
        const known = new Set(knownIds);
        const newPosts = posts.filter((post) => {
          const id = String(post._id ?? post.id ?? "");
          const author = post.autor as { userId?: string } | undefined;
          return id && !known.has(id) && author?.userId !== userId;
        });
        for (const post of newPosts.reverse()) {
          const author = post.autor as { nome?: string; name?: string } | undefined;
          const id = String(post._id ?? post.id);
          publish({
            id: `post:${id}`,
            user: author?.nome || author?.name || "Nova publicação",
            type: "publicou uma postagem.",
            avatar: "/assets/imgPerfilM.png",
            href: "/Home",
            createdAt: String(post.createdAt ?? new Date().toISOString()),
            read: false,
          });
        }
        localStorage.setItem(seenPostsKey, JSON.stringify([...ids, ...knownIds].slice(0, 100)));
      } catch {
        // Uma falha temporária no feed não impede notificações de mensagens.
      } finally {
        postPollRunning = false;
      }
    };
    void pollPosts();
    const pollTimer = window.setInterval(() => void pollPosts(), 15000);
    return () => {
      socket.disconnect();
      window.clearInterval(pollTimer);
    };
  }, []);

  useEffect(() => {
    if (notificationsReady && currentUserId) {
      localStorage.setItem(`pet-joyful:notifications:${currentUserId}`, JSON.stringify(notifications));
    }
  }, [notifications, notificationsReady, currentUserId]);

  // Fechar menus ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node) &&
        settingsButtonRef.current &&
        !settingsButtonRef.current.contains(event.target as Node)
      ) {
        setShowSettings(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node) &&
        notificationsButtonRef.current &&
        !notificationsButtonRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fechar menus com ESC
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowSettings(false);
        setShowNotifications(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <header
      className="bg-success text-white py-3 px-4 d-flex justify-content-between align-items-center position-relative"
      role="banner"
    >
      <Link
        href="/Home"
        className="fw-bold fs-4"
        aria-label="PetJoyful - Ir para página inicial"
      >
        <Image
          src="/assets/pet-joyful.logosmfundo.png"
          alt="Logo PetJoyful - Conectando Corações e Patas"
          width={230}
          height={110}
          priority
        />
      </Link>

      <label htmlFor="header-search" className="visually-hidden">
        Buscar na plataforma
      </label>
      <input
        type="search"
        id="header-search"
        className="form-control w-50"
        placeholder="Buscar posts, usuários, eventos..."
        aria-label="Campo de busca"
      />

      <nav
        className="d-flex align-items-center gap-3"
        aria-label="Navegação principal"
      >
        <NavLink
          href="/Home"
          icon={<BiHome size={24} />}
          label="Início"
          active={activeLink === "home"}
        />
        <NavLink
          href="/Perfil"
          icon={<BiUser size={24} />}
          label="Perfil"
          active={activeLink === "perfil"}
        />
        <NavLink
          href="/Chat"
          icon={<BiMessageDetail size={24} />}
          label="Chat"
          active={activeLink === "chat"}
        />
        <NavLink
          href="/ia-chat"
          icon={<BiBot size={24} />}
          label="IA"
          active={activeLink === "ia-chat"}
        />
        <NavLink
          href="/compatibilidade"
          icon={<BiHeartCircle size={24} />}
          label="Compatibilidade"
          active={activeLink === "compatibilidade"}
        />
        <NavLink
          href="/gerador-conteudo"
          icon={<BiPen size={24} />}
          label="Conteúdo"
          active={activeLink === "gerador-conteudo"}
        />

        {/* Notificações */}
        <div className="position-relative" ref={notificationsRef}>
          <button
            ref={notificationsButtonRef}
            className="bg-transparent border-0 text-white p-2 rounded focus:outline focus:outline-2 focus:outline-white focus:outline-offset-2"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notificações"
            aria-expanded={showNotifications}
            aria-haspopup="true"
          >
            <BiBell size={24} aria-hidden="true" />
            {unreadNotificationCount > 0 && (
              <>
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" aria-hidden="true">
                  {unreadNotificationCount > 99 ? "99+" : unreadNotificationCount}
                </span>
                <span className="visually-hidden">
                  {unreadNotificationCount} notificação não lida
                  {unreadNotificationCount > 1 ? "s" : ""}
                </span>
              </>
            )}
          </button>

          {showNotifications && (
            <div
              style={{ width: "300px", maxHeight: "min(400px, 70vh)" }}
              className="position-absolute end-0 mt-2 bg-white rounded shadow-sm p-2 z-3 overflow-y-auto"
              role="menu"
              aria-label="Lista de notificações"
            >
              <h6 className="px-2 mb-2 text-dark">Notificações</h6>
              {notifications.length === 0 ? (
                <p className="px-3 py-2 text-muted small">
                  Nenhuma notificação
                </p>
              ) : (
                notifications.map((notif) => (
                  <button
                    key={notif.id}
                    className={`d-flex w-100 align-items-center gap-2 px-3 py-2 border-bottom text-start ${notif.read ? "bg-white" : "bg-light"}`}
                    role="menuitem"
                    onClick={() => {
                      setNotifications((previous) => previous.map((item) => item.id === notif.id ? { ...item, read: true } : item));
                      setShowNotifications(false);
                      router.push(notif.href);
                    }}
                  >
                    <Image
                      src={notif.avatar}
                      width={30}
                      height={30}
                      className="rounded-circle"
                      alt={`Avatar de ${notif.user}`}
                    />
                    <div className="text-dark small">
                      <strong>{notif.user}</strong> {notif.type}
                    </div>
                  </button>
                ))
              )}
              <div className="text-center mt-2">
                <button
                  className="btn btn-link text-secondary small"
                  onClick={() => setShowNotifications(false)}
                  aria-label="Fechar notificações"
                >
                  Fechar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Configurações */}
        <div className="position-relative" ref={settingsRef}>
          <button
            ref={settingsButtonRef}
            onClick={() => setShowSettings(!showSettings)}
            className="bg-transparent border-0 text-white p-2 rounded focus:outline focus:outline-2 focus:outline-white focus:outline-offset-2"
            aria-label="Menu de configurações"
            aria-expanded={showSettings}
            aria-haspopup="true"
          >
            <BiListUl size={24} aria-hidden="true" />
          </button>

          {showSettings && (
            <div
              className="position-absolute end-0 mt-2 bg-white rounded shadow-sm py-2 z-3"
              style={{ width: "200px" }}
              role="menu"
              aria-label="Menu de configurações"
            >
              <Link
                href="/albums"
                className="d-flex align-items-center gap-2 px-3 py-2 text-dark text-decoration-none"
                onClick={() => setShowSettings(false)}
                role="menuitem"
              >
                <BiImageAlt size={18} aria-hidden="true" />
                <span>Meus Álbuns</span>
              </Link>
              <Link
                href="/configuracoes"
                className="d-flex align-items-center gap-2 px-3 py-2 text-dark text-decoration-none"
                onClick={() => setShowSettings(false)}
                role="menuitem"
              ></Link>
              <Link
                href="/login"
                className="d-flex align-items-center gap-2 px-3 py-2 text-dark text-decoration-none"
                onClick={() => setShowSettings(false)}
                role="menuitem"
              >
                <BiLogOut size={18} aria-hidden="true" />
                <span>Sair</span>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

function NavLink({
  href,
  icon,
  label,
  active = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`text-white text-decoration-none d-flex flex-column align-items-center p-2 rounded focus:outline focus:outline-2 focus:outline-white focus:outline-offset-2 ${
        active ? "active" : ""
      }`}
      aria-label={`Ir para ${label}`}
      aria-current={active ? "page" : undefined}
    >
      <span aria-hidden="true">{icon}</span>
      <span className="fs-6">{label}</span>
    </Link>
  );
}
