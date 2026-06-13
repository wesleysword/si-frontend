"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import { Lead } from "@/types/lead";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogOut, User, Plus, X } from "lucide-react";
import { ChatBot } from "@/components/ChatBot";

const COLUMNS: { id: Lead['status']; label: string; color: string }[] = [
  { id: "Novo", label: "Novos Leads", color: "border-t-[#EA580C]" },
  { id: "Em Atendimento", label: "Em Atendimento", color: "border-t-[#EAB308]" },
  { id: "Concluído", label: "Concluídos", color: "border-t-green-500" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Corretor");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLeadName, setNewLeadName] = useState("");
  const [newLeadContact, setNewLeadContact] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("@SI:token");
    const storedUser = localStorage.getItem("@SI:user");
    
    if (!token) {
      router.push("/login");
      return;
    }

    if (storedUser) {
      setUserName(JSON.parse(storedUser).name);
    }

    fetchLeads();
  }, []);

  async function fetchLeads() {
    try {
      const response = await api.get("/leads");
      setLeads(response.data);
    } catch (error) {
      console.error("Erro ao carregar leads", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateLead(e: React.FormEvent) {
    e.preventDefault();
    if (!newLeadName.trim() || !newLeadContact.trim()) return;
    
    setIsCreating(true);
    
    try {
      const response = await api.post("/leads", {
        name: newLeadName,
        contact: newLeadContact,
        status: "Novo"
      });
      
      setLeads(prev => [...prev, response.data]);
      
      setNewLeadName("");
      setNewLeadContact("");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao criar o lead", error);
      alert("Houve um erro ao tentar salvar o lead. Verifique a conexão.");
    } finally {
      setIsCreating(false);
    }
  }

  function handleDragStart(e: React.DragEvent, leadId: string) {
    e.dataTransfer.setData("text/plain", leadId);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  async function handleDrop(e: React.DragEvent, targetStatus: Lead['status']) {
    e.preventDefault();
    const leadId = e.dataTransfer.getData("text/plain");
    
    if (!leadId) return;

    const originalLeads = [...leads];
    setLeads(prev => prev.map(lead => lead.id === leadId ? { ...lead, status: targetStatus } : lead));

    try {
      await api.patch(`/leads/${leadId}`, { status: targetStatus });
    } catch (error) {
      console.error("Erro ao atualizar status do lead", error);
      setLeads(originalLeads); 
    }
  }

  function handleLogout() {
    localStorage.clear();
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-brand-bgLight dark:bg-brand-bgDark text-gray-900 dark:text-white transition-colors duration-300 relative">
      
      <header className="px-8 py-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-brand-surfaceLight dark:bg-brand-surfaceDark transition-colors">
        <h1 className="font-title text-2xl font-bold">
          SI - Soluções <span className="text-[#EA580C]">Imobiliárias</span>
        </h1>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-sans bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-xl">
            <User className="w-4 h-4 text-[#EA580C]" />
            <span>Olá, <strong className="text-[#EA580C]">{userName}</strong></span>
          </div>
          <ThemeToggle />
          <button 
            onClick={handleLogout}
            className="p-2.5 rounded-xl text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
            title="Sair do sistema"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-title text-3xl font-bold">Painel de Negócios</h2>
            <p className="font-sans text-sm text-gray-500 dark:text-gray-400 mt-1">
              Arraste e solte os cards para atualizar o status dos clientes em tempo real.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#EA580C] hover:opacity-90 text-white font-medium text-sm shadow-lg shadow-[#EA580C]/30 transition-all active:scale-[0.98] self-start sm:self-center font-sans"
          >
            <Plus className="w-4 h-4" />
            Novo Lead
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 font-sans text-gray-500">Carregando painel...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {COLUMNS.map((column) => {
              const columnLeads = leads.filter(lead => lead.status === column.id);
              
              return (
                <div
                  key={column.id}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, column.id)}
                  className={`flex flex-col p-4 rounded-2xl bg-brand-surfaceLight dark:bg-brand-surfaceDark border-t-4 ${column.color} shadow-sm min-h-[500px] border border-x-gray-200 border-b-gray-200 dark:border-x-gray-800 dark:border-b-gray-800 transition-colors duration-300`}
                >
                  <div className="flex items-center justify-between mb-4 font-title">
                    <span className="font-bold text-gray-700 dark:text-gray-300">{column.label}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500">
                      {columnLeads.length}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
                    {columnLeads.map((lead) => (
                      <div
                        key={lead.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, lead.id)}
                        className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-brand-bgLight dark:bg-brand-bgDark hover:border-[#EA580C] dark:hover:border-[#EA580C] cursor-grab active:cursor-grabbing transition-all shadow-sm hover:shadow-md font-sans group"
                      >
                        <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-[#EA580C] transition-colors">
                          {lead.name}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {lead.contact}
                        </p>
                        <div className="text-[10px] text-gray-400 mt-3 text-right">
                          {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    ))}
                    {columnLeads.length === 0 && (
                      <div className="text-center py-12 text-xs text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl flex-1 flex items-center justify-center">
                        Nenhum lead nesta etapa
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl text-gray-900 dark:text-white font-title">Cadastrar Novo Lead</h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-4 font-sans">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome do Cliente</label>
                <input 
                  type="text" 
                  required 
                  value={newLeadName} 
                  onChange={e => setNewLeadName(e.target.value)} 
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-[#EA580C] dark:focus:border-[#EA580C] text-gray-900 dark:text-white transition-colors" 
                  placeholder="Ex: João Silva" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contato (E-mail ou Celular)</label>
                <input 
                  type="text" 
                  required 
                  value={newLeadContact} 
                  onChange={e => setNewLeadContact(e.target.value)} 
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-[#EA580C] dark:focus:border-[#EA580C] text-gray-900 dark:text-white transition-colors" 
                  placeholder="Ex: joao@email.com" 
                />
              </div>

              <div className="flex gap-3 mt-8 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="flex-1 py-2.5 rounded-xl text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isCreating} 
                  className="flex-1 py-2.5 rounded-xl text-white bg-[#EA580C] hover:opacity-90 font-medium shadow-lg shadow-[#EA580C]/30 transition-all disabled:opacity-50"
                >
                  {isCreating ? "Salvando..." : "Salvar Lead"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      <ChatBot />
    </div>
  );
}