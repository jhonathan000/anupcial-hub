"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const updateField = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email.trim() || !form.password.trim()) {
      toast.error("Preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Email ou senha incorretos.");
      }

      toast.success("Bem-vindo de volta!");
      router.push("/");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao fazer login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">

          {/* ── Header ─────────────────────────────────────────── */}
          <div className="text-center mb-10">
            <h1 className="font-display text-3xl font-bold text-ivory mb-2">
              Bem-vindo
            </h1>
            <p className="text-sm text-mist">
              Entre na sua conta para acessar a plataforma
            </p>
          </div>

          {/* ── Form ───────────────────────────────────────────── */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-ash mb-2">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-400 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="seu@email.com"
                  className="input-base pl-10"
                  autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="text-xs font-medium text-ash">
                  Senha
                </label>
                <Link
                  href="/auth/recuperar"
                  className="text-2xs text-gold-400 hover:text-gold-300 transition-colors"
                >
                  Esqueceu?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-400 pointer-events-none" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  placeholder="••••••••"
                  className="input-base pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ash hover:text-ivory transition-colors"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={form.rememberMe}
                onChange={(e) => updateField("rememberMe", e.target.checked)}
                className="w-4 h-4 rounded border border-rim bg-raised checked:bg-gold-400 checked:border-gold-400 cursor-pointer"
              />
              <span className="text-sm text-mist group-hover:text-ivory transition-colors">
                Manter-me conectado
              </span>
            </label>

            {/* Submit */}
            <Button
              type="submit"
              variant="gold"
              size="lg"
              fullWidth
              loading={loading}
            >
              {loading ? "Entrando..." : "Entrar na Conta"}
            </Button>
          </form>

          {/* ── Divider ────────────────────────────────────────── */}
          <div className="my-8 flex items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-rim" />
            <span className="text-xs text-ash">ou</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-rim" />
          </div>

          {/* ── Sign Up Link ───────────────────────────────────── */}
          <div className="card p-5 text-center">
            <p className="text-sm text-mist mb-3">
              Ainda não tem conta?
            </p>
            <Link href="/auth/cadastro">
              <Button
                variant="outline"
                size="md"
                fullWidth
              >
                Criar conta
              </Button>
            </Link>
          </div>

          {/* ── Footer text ────────────────────────────────────── */}
          <p className="text-center text-2xs text-ash mt-6">
            Ao entrar, você concorda com nossos{" "}
            <Link href="#" className="text-gold-400 hover:text-gold-300">
              Termos de Uso
            </Link>{" "}
            e{" "}
            <Link href="#" className="text-gold-400 hover:text-gold-300">
              Política de Privacidade
            </Link>
            .
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
