"use client";

import { useState, useRef, useEffect } from "react";
import { api } from "@/services/api";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ChatMessage {
  role: "user" | "model";
  content: string;
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    
    const newHistory: ChatMessage[] = [...messages, { role: "user", content: userMessage }];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      const response = await api.post("/chat", {
        message: userMessage,
        history: messages,
      });

      setMessages((prev) => [
        ...prev,
        { role: "model", content: response.data.reply },
      ]);
    } catch (error) {
      console.error("Erro ao enviar mensagem para o chatbot", error);
      setMessages((prev) => [
        ...prev,
        { role: "model", content: "Desculpe, tive um problema de conexão. Tente novamente." },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full bg-[#EA580C] text-white shadow-lg shadow-[#EA580C]/40 hover:scale-105 active:scale-95 transition-all z-40 ${isOpen ? "hidden" : "flex"}`}
        aria-label="Abrir Assistente de IA"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      <div
        className={`fixed bottom-6 right-6 w-[350px] sm:w-[400px] h-[500px] bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl flex flex-col z-50 transition-all duration-300 origin-bottom-right ${
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-900 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#EA580C]/10 rounded-lg">
              <Bot className="w-5 h-5 text-[#EA580C]" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">Assistente SI</h3>
              <p className="text-[10px] text-green-500 font-medium">Online (Gemini AI)</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
              <Bot className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <p>Olá! Sou a IA da Soluções Imobiliárias.</p>
              <p className="text-xs mt-1">Como posso te ajudar com os leads hoje?</p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div key={index} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === "user" ? "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300" : "bg-[#EA580C] text-white"}`}>
                {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`p-3 rounded-2xl max-w-[75%] break-words ${msg.role === "user" ? "bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-tr-none" : "bg-[#EA580C]/10 text-gray-800 dark:text-gray-200 border border-[#EA580C]/20 rounded-tl-none"}`}>
                <ReactMarkdown>
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 flex-row">
               <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#EA580C] text-white flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-[#EA580C]/10 border border-[#EA580C]/20 rounded-tl-none flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#EA580C] animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-1.5 h-1.5 rounded-full bg-[#EA580C] animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-1.5 h-1.5 rounded-full bg-[#EA580C] animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua dúvida..."
              className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-slate-900 border border-transparent focus:border-[#EA580C] focus:bg-transparent dark:focus:bg-transparent rounded-xl outline-none text-sm text-gray-900 dark:text-white transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2.5 bg-[#EA580C] text-white rounded-xl hover:bg-opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}