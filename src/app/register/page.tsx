"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/users/register", { name, email, password });
      setSuccess(true);
      
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao realizar o cadastro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-brand-bgLight dark:bg-brand-bgDark transition-colors duration-300">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md p-8 rounded-2xl bg-brand-surfaceLight dark:bg-brand-surfaceDark shadow-xl border border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className="text-center mb-8">
          <h1 className="font-title text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Criar <span className="text-primary-orange">Conta</span>
          </h1>
          <p className="font-sans text-sm text-gray-500 dark:text-gray-400">
            Cadastre-se para começar a gerenciar seus clientes
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 text-sm font-sans">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-lg bg-green-100 dark:bg-green-900/30 border border-green-400 text-green-700 dark:text-green-400 text-sm font-sans">
            Conta criada com sucesso! Redirecionando para o login...
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5 font-sans">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Nome Completo
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-orange focus:border-transparent outline-none transition-all"
              placeholder="Seu Nome"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              E-mail Profissional
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-orange focus:border-transparent outline-none transition-all"
              placeholder="corretor@si.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Senha de Acesso
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-orange focus:border-transparent outline-none transition-all"
              placeholder="Mínimo 6 caracteres"
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full py-3 rounded-xl bg-primary-orange hover:bg-opacity-90 text-white font-medium shadow-lg shadow-primary-orange/20 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Processando..." : "Finalizar Cadastro"}
          </button>
        </form>

        <div className="mt-6 text-center font-sans text-sm text-gray-500 dark:text-gray-400">
          Já possui registro?{" "}
          <Link href="/login" className="text-primary-orange hover:underline font-medium">
            Faça login aqui
          </Link>
        </div>
      </div>
    </div>
  );
}