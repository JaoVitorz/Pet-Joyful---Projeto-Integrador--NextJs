// app/components/chatbot/ChatBotWidget.tsx
"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import ChatBot from "./ChatBot";

// Rotas onde o chatbot NÃO deve aparecer
const HIDDEN_ROUTES = ["/login", "/register"];

export default function ChatBotWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  // Evita hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Esconde o widget nas rotas protegidas
  const shouldHide = HIDDEN_ROUTES.some(
    (route) => pathname === route || pathname?.startsWith(route + "/"),
  );

  // Fecha o chat ao navegar
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleOpen = () => {
    setIsOpen(true);
    setHasNewMessage(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!mounted || shouldHide) return null;

  return (
    <>
      {/* Chat Window */}
      <div
        className={`
          fixed bottom-24 right-4 z-50
          w-[340px] h-[480px]
          bg-white rounded-2xl shadow-2xl border border-gray-100
          flex flex-col overflow-hidden
          transition-all duration-300 ease-in-out origin-bottom-right
          ${
            isOpen
              ? "opacity-100 scale-100 pointer-events-auto"
              : "opacity-0 scale-90 pointer-events-none"
          }
        `}
      >
        {isOpen && <ChatBot onClose={handleClose} />}
      </div>

      {/* Floating Button */}
      <button
        onClick={isOpen ? handleClose : handleOpen}
        aria-label={isOpen ? "Fechar chat" : "Abrir chat"}
        className={`
          fixed bottom-4 right-4 z-50
          w-14 h-14 rounded-full
          bg-orange-500 hover:bg-orange-600
          text-white shadow-lg hover:shadow-xl
          flex items-center justify-center
          transition-all duration-300 ease-in-out
          active:scale-90
          ${isOpen ? "rotate-0" : "hover:scale-110"}
        `}
      >
        {/* Notification dot */}
        {hasNewMessage && !isOpen && (
          <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        )}

        {/* Icon: toggle entre pata e X */}
        <div
          className={`transition-transform duration-300 ${isOpen ? "rotate-90 scale-90" : ""}`}
        >
          {isOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <span className="text-2xl">🐾</span>
          )}
        </div>
      </button>
    </>
  );
}

