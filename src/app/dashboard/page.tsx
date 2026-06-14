"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import { Lead } from "@/types/lead";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogOut, User, Plus, X, Pencil, Send } from "lucide-react";
import { ChatBot } from "@/components/ChatBot";

const COLUMNS: { id: Lead['status']; label: string; color: string }[] = [
  { id: "Novo", label: "Novos Leads", color: "border-t-[#EA580C]" },
  { id: "Em Atendimento", label: "Em Atendimento", color: "border-t-[#EAB308]" },
  { id: "Concluído", label: "Concluídos", color: "border-t-green-500" },
];

const PRIORITY_WEIGHT: Record<string, number> = {
  "Alta": 3,
  "Média": 2,
  "Baixa": 1,
};

export default function DashboardPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Corretor");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  
  const [leadName, setLeadName] = useState("");
  const [leadContact, setLeadContact] = useState("");
  const [leadDescription, setLeadDescription] = useState("");
  const [leadStatus, setLeadStatus] = useState("Novo");
  const [leadPriority, setLeadPriority] = useState("Média");
  const [isSaving, setIsSaving] = useState(false);

  const [newInteraction, setNewInteraction] = useState("");
  const [isAddingInteraction, setIsAddingInteraction] = useState(false);

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

  function handleOpenCreateModal() {
    setEditingLead(null);
    setLeadName("");
    setLeadContact("");
    setLeadDescription("");
    setLeadStatus("Novo");
    setLeadPriority("Média");
    setIsModalOpen(true);
  }

  function handleOpenEditModal(lead: Lead) {
    setEditingLead(lead);
    setLeadName(lead.name);
    setLeadContact(lead.contact);
    setLeadDescription(lead.description || "");
    setLeadStatus(lead.status);
    setLeadPriority(lead.priority || "Média");
    setIsModalOpen(true);
  }

  async function handleSaveLead(e: React.FormEvent) {
    e.preventDefault();
    if (!leadName.trim() || !leadContact.trim()) return;
    
    setIsSaving(true);
    
    try {
      const payload = {
        name: leadName,
        contact: leadContact,
        description: leadDescription,
        status: leadStatus,
        priority: leadPriority
      };

      if (editingLead) {
        const response = await api.patch(`/leads/${editingLead.id}`, payload);
        const updatedLead = { ...response.data, interactions: editingLead.interactions };
        setLeads(prev => prev.map(lead => lead.id === editingLead.id ? updatedLead : lead));
        setEditingLead(updatedLead);
      } else {
        const response = await api.post("/leads", payload);
        setLeads(prev => [...prev, response.data]);
      }
      
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar o lead", error);
      alert("Houve um erro ao tentar salvar o lead. Verifique se atualizou o backend com o campo priority.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAddInteraction(e: React.FormEvent) {
    e.preventDefault();
    if (!newInteraction.trim() || !editingLead) return;
    
    setIsAddingInteraction(true);
    
    try {
      const response = await api.post(`/leads/${editingLead.id}/interactions`, {
        content: newInteraction
      });
      
      const updatedInteractions = [response.data, ...(editingLead.interactions || [])];
      const updatedLead = { ...editingLead, interactions: updatedInteractions };
      
      setEditingLead(updatedLead);
      setLeads(prev => prev.map(lead => lead.id === editingLead.id ? updatedLead : lead));
      setNewInteraction("");
    } catch (error) {
      console.error("Erro ao adicionar interação", error);
      alert("Houve um erro ao tentar adicionar a nota.");
    } finally {
      setIsAddingInteraction(false);
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
            onClick={handleOpenCreateModal}
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
              
              const columnLeads = leads
                .filter(lead => lead.status === column.id)
                .sort((a, b) => {
                  const weightA = PRIORITY_WEIGHT[a.priority || "Média"] || 0;
                  const weightB = PRIORITY_WEIGHT[b.priority || "Média"] || 0;
                  
                  if (weightA !== weightB) {
                    return weightB - weightA;
                  }
                  
                  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                });
              
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
                        onClick={() => handleOpenEditModal(lead)}
                        className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-brand-bgLight dark:bg-brand-bgDark hover:border-[#EA580C] dark:hover:border-[#EA580C] cursor-grab active:cursor-grabbing transition-all shadow-sm hover:shadow-md font-sans group relative"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <div className="flex flex-col gap-1.5">
                            <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-[#EA580C] transition-colors pr-6">
                              {lead.name}
                            </h4>
                            {/* ETIQUETA VISUAL DE PRIORIDADE */}
                            {lead.priority && (
                              <span className={`text-[10px] px-2 py-0.5 rounded-md w-max font-medium ${
                                lead.priority === 'Alta' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                lead.priority === 'Baixa' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500'
                              }`}>
                                Prioridade {lead.priority}
                              </span>
                            )}
                          </div>
                          <Pencil className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 right-4" />
                        </div>
                        
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          {lead.contact}
                        </p>

                        {lead.description && (
                          <div className="mt-3 p-2 bg-brand-surfaceLight dark:bg-brand-surfaceDark border border-gray-100 dark:border-gray-800 rounded-lg text-xs text-gray-600 dark:text-gray-400 italic line-clamp-2">
                            <span className="not-italic text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 block mb-0.5">Busca:</span>
                            {lead.description}
                          </div>
                        )}

                        <div className="flex justify-between items-center mt-3">
                          <div className="text-[10px] text-gray-400">
                            {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                          </div>
                          {lead.interactions && lead.interactions.length > 0 && (
                             <span className="text-[10px] font-medium text-[#EA580C] px-2 py-0.5 bg-[#EA580C]/10 rounded-full">
                               {lead.interactions.length} nota(s)
                             </span>
                          )}
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
          <div className={`bg-white dark:bg-slate-800 rounded-2xl w-full ${editingLead ? 'max-w-4xl' : 'max-w-md'} p-6 shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]`}>
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl text-gray-900 dark:text-white font-title">
                {editingLead ? "Detalhes e Histórico" : "Cadastrar Novo Lead"}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors bg-gray-100 dark:bg-gray-700 p-1.5 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className={`flex flex-col overflow-y-auto pr-2 ${editingLead ? 'md:flex-row md:gap-8' : ''}`}>
              
              <div className={editingLead ? "md:w-1/2 flex-shrink-0" : "w-full"}>
                <form onSubmit={handleSaveLead} className="space-y-4 font-sans pb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome do Cliente</label>
                    <input 
                      type="text" 
                      required 
                      value={leadName} 
                      onChange={e => setLeadName(e.target.value)} 
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-[#EA580C] dark:focus:border-[#EA580C] text-gray-900 dark:text-white transition-colors" 
                      placeholder="Ex: João Silva" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contato (E-mail ou Celular)</label>
                    <input 
                      type="text" 
                      required 
                      value={leadContact} 
                      onChange={e => setLeadContact(e.target.value)} 
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-[#EA580C] dark:focus:border-[#EA580C] text-gray-900 dark:text-white transition-colors" 
                      placeholder="Ex: joao@email.com" 
                    />
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status no Funil</label>
                      <select 
                        value={leadStatus} 
                        onChange={e => setLeadStatus(e.target.value)} 
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-[#EA580C] dark:focus:border-[#EA580C] text-gray-900 dark:text-white transition-colors"
                      >
                        <option value="Novo">Novo</option>
                        <option value="Em Atendimento">Em Atendimento</option>
                        <option value="Concluído">Concluído</option>
                      </select>
                    </div>

                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prioridade</label>
                      <select 
                        value={leadPriority} 
                        onChange={e => setLeadPriority(e.target.value)} 
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-[#EA580C] dark:focus:border-[#EA580C] text-gray-900 dark:text-white transition-colors font-medium"
                      >
                        <option value="Baixa" className="text-blue-600">Baixa</option>
                        <option value="Média" className="text-yellow-600">Média</option>
                        <option value="Alta" className="text-red-600">Alta</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Perfil do Imóvel Buscado</label>
                    <textarea 
                      value={leadDescription} 
                      onChange={e => setLeadDescription(e.target.value)} 
                      rows={3}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-[#EA580C] dark:focus:border-[#EA580C] text-gray-900 dark:text-white transition-colors resize-none text-sm" 
                      placeholder="Ex: Busca apartamento de 2 dormitórios com vaga..." 
                    />
                  </div>

                  <div className="flex gap-3 mt-8 pt-4">
                    <button 
                      type="button" 
                      onClick={() => setIsModalOpen(false)} 
                      className="flex-1 py-2.5 rounded-xl text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 font-medium transition-colors"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit" 
                      disabled={isSaving} 
                      className="flex-1 py-2.5 rounded-xl text-white bg-[#EA580C] hover:opacity-90 font-medium shadow-lg shadow-[#EA580C]/30 transition-all disabled:opacity-50"
                    >
                      {isSaving ? "Salvando..." : editingLead ? "Atualizar Dados" : "Salvar Lead"}
                    </button>
                  </div>
                </form>
              </div>

              {editingLead && (
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 md:mt-0 md:pt-0 md:border-t-0 md:border-l md:pl-8 md:w-1/2 flex flex-col">
                  <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 font-title uppercase tracking-wider">Histórico de Atendimento</h4>
                  
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 min-h-[250px]">
                    {editingLead.interactions && editingLead.interactions.length > 0 ? (
                      editingLead.interactions.map((interaction) => (
                        <div key={interaction.id} className="relative pl-4 border-l-2 border-[#EA580C]/30">
                          <div className="absolute w-2 h-2 bg-[#EA580C] rounded-full -left-[5px] top-1.5 ring-4 ring-white dark:ring-slate-800"></div>
                          <p className="text-sm text-gray-800 dark:text-gray-200">{interaction.content}</p>
                          <span className="text-[10px] text-gray-400 mt-1 block">
                            {new Date(interaction.createdAt).toLocaleString('pt-BR', {
                              day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10 text-sm text-gray-400 italic bg-gray-50 dark:bg-slate-900 rounded-xl">
                        Nenhuma interação registrada ainda.
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleAddInteraction} className="flex gap-2 relative bg-gray-50 dark:bg-slate-900 p-2 rounded-xl border border-gray-200 dark:border-gray-700">
                    <input 
                      type="text" 
                      value={newInteraction}
                      onChange={(e) => setNewInteraction(e.target.value)}
                      placeholder="Adicionar nota sobre o cliente..."
                      className="flex-1 bg-transparent px-2 text-sm text-gray-900 dark:text-white outline-none"
                      disabled={isAddingInteraction}
                    />
                    <button 
                      type="submit"
                      disabled={isAddingInteraction || !newInteraction.trim()}
                      className="p-2 bg-[#EA580C] text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      <ChatBot />
    </div>
  );
}