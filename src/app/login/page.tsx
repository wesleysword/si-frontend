"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });
      
      localStorage.setItem("@SI:token", response.data.access_token);
      localStorage.setItem("@SI:user", JSON.stringify(response.data.user));

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Credenciais inválidas. Tente novamente.");
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
            Soluções <span className="text-primary-orange">Imobiliárias</span>
          </h1>
          <p className="font-sans text-sm text-gray-500 dark:text-gray-400">
            Acesse sua conta para gerenciar seus leads
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 text-sm font-sans">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5 font-sans">
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
              placeholder="seu.nome@si.com"
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
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary-orange hover:bg-opacity-90 text-white font-medium shadow-lg shadow-primary-orange/20 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Autenticando..." : "Entrar no Sistema"}
          </button>
        </form>

        <div className="mt-6 text-center font-sans text-sm text-gray-500 dark:text-gray-400">
          Ainda não tem acesso?{" "}
          <Link href="/register" className="text-primary-orange hover:underline font-medium">
            Cadastre-se aqui
          </Link>
        </div>
      </div>
    </div>
  );
}