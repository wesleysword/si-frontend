"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Loader2 } from "lucide-react";
import { api } from "@/services/api";
import ReactMarkdown from "react-markdown";

type Message = {
  id: string;
  role: "user" | "bot";
  content: string;
};

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "bot",
      content:
        "Olá! Sou a SIA, sua assistente virtual. Como posso ajudar você a analisar os clientes e o mercado hoje?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userMsg,
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const response = await api.post("/ai/chat", { question: userMsg });

      const newBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: response.data.reply,
      };

      setMessages((prev) => [...prev, newBotMessage]);
    } catch (error) {
      console.error("Erro no chat", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "bot",
          content:
            "Desculpe, estou com problemas para me conectar ao servidor no momento.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full bg-[#EA580C] text-white shadow-xl shadow-[#EA580C]/30 hover:scale-105 transition-all duration-300 z-40 ${isOpen ? "opacity-0 pointer-events-none scale-75" : "opacity-100"}`}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      <div
        className={`fixed bottom-6 right-6 w-[380px] h-[600px] max-h-[80vh] bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl flex flex-col z-50 transition-all duration-300 origin-bottom-right ${isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-brand-surfaceLight dark:bg-brand-surfaceDark rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#EA580C]/10 flex items-center justify-center">
              <Bot className="w-5 h-5 text-[#EA580C]" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900 dark:text-white font-title">
                SIA Assistant
              </h3>
              <p className="text-[10px] text-green-500 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>{" "}
                Online
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-900/50 scroll-smooth">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "user" ? "bg-[#EA580C] text-white" : "bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300"}`}
              >
                {msg.role === "user" ? (
                  <User className="w-3 h-3" />
                ) : (
                  <Bot className="w-3 h-3" />
                )}
              </div>
              <div
                className={`p-3 rounded-2xl text-sm font-sans shadow-sm ${msg.role === "user" ? "bg-[#EA580C] text-white rounded-tr-sm" : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-tl-sm"}`}
              >
                {msg.role === "user" ? (
                  msg.content
                ) : (
                  <div className="prose dark:prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-gray-800 prose-pre:text-gray-100">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300">
                <Bot className="w-3 h-3" />
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-700 rounded-tl-sm flex gap-1">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={handleSendMessage}
          className="p-3 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-gray-800 rounded-b-2xl"
        >
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              placeholder="Pergunte sobre seus leads..."
              className="w-full pl-4 pr-12 py-3 bg-gray-100 dark:bg-slate-800 border-transparent rounded-xl outline-none focus:ring-2 focus:ring-[#EA580C]/50 text-sm text-gray-900 dark:text-white transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-1.5 bg-[#EA580C] text-white rounded-lg hover:bg-[#c24100] disabled:opacity-50 disabled:hover:bg-[#EA580C] transition-colors"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4 -ml-0.5 mt-0.5" />
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
