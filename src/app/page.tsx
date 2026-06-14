import Link from "next/link";
import { ArrowRight, LayoutDashboard, MessageSquare, BarChart3, Building2 } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-brand-bgLight dark:bg-brand-bgDark text-gray-900 dark:text-white transition-colors duration-300 font-sans flex flex-col">
      
      <header className="px-8 py-6 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#EA580C] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#EA580C]/30">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="font-title text-2xl font-bold">
            SI <span className="text-[#EA580C]">Imobiliárias</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-6">
          <ThemeToggle />
          <Link 
            href="/login" 
            className="hidden sm:flex items-center gap-2 font-medium hover:text-[#EA580C] transition-colors"
          >
            Entrar
          </Link>
          <Link 
            href="/register" 
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#c24100] text-white font-medium text-sm shadow-lg shadow-[#EA580C]/30 transition-all active:scale-[0.98]"
          >
            Criar Conta
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-8 mt-12 sm:mt-0">
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EA580C]/10 text-[#EA580C] text-sm font-bold tracking-wide uppercase mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EA580C] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#EA580C]"></span>
            </span>
            Sistema Atualizado 2026
          </div>

          <h2 className="font-title text-5xl sm:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
            Gestão imobiliária movida por <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EA580C] to-yellow-500">Inteligência</span>.
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Abandone as planilhas. Acompanhe seus clientes em tempo real, visualize métricas de conversão e conte com uma assistente de IA exclusiva para o mercado imobiliário.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              href="/login" 
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#EA580C] hover:bg-[#c24100] text-white font-bold text-lg shadow-xl shadow-[#EA580C]/30 transition-all hover:-translate-y-1"
            >
              Acessar CRM <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full mt-24 pb-12">
          
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow text-left group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <h3 className="font-title text-xl font-bold mb-2">Kanban Dinâmico</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Arraste e solte seus leads. Acompanhe o status de cada negociação com organização visual e prioridades claras.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow text-left group">
            <div className="w-12 h-12 rounded-xl bg-[#EA580C]/10 text-[#EA580C] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-title text-xl font-bold mb-2">Assistente IA (SIA)</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Consulte dados, peça resumos ou crie e-mails persuasivos instantaneamente com nossa IA integrada ao banco de dados.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow text-left group">
            <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="font-title text-xl font-bold mb-2">Métricas e Dados</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Tome decisões baseadas em dados. Gráficos em tempo real sobre a saúde do seu funil de vendas e prioridades.
            </p>
          </div>

        </div>
      </main>

    </div>
  );
}