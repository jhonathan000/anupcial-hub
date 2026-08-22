"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User, Mail, Lock, MapPin, Sparkles, Briefcase,
  Upload, CheckCircle2, Eye, EyeOff,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

type UserRole = "BRIDE_GROOM" | "CEREMONIAL";

interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  city: string;
  phone: string;
  // Ceremonial-specific
  yearsExperience: string;
  specialties: string[];
  validationDocUrl: string | null;
}

const CITIES = [
  "Curitiba",
  "Araucária",
  "Colombo",
  "Pinhais",
  "São José dos Pinhais",
  "Campo Largo",
];

const SPECIALTIES = [
  { key: "CASAMENTO", label: "Casamentos" },
  { key: "DEBUTANTE", label: "Debutantes" },
  { key: "CORPORATIVO", label: "Corporativos" },
  { key: "ANIVERSARIO", label: "Aniversários" },
  { key: "FORMATURA", label: "Formaturas" },
];

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState<SignupForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "BRIDE_GROOM",
    city: "",
    phone: "",
    yearsExperience: "",
    specialties: [],
    validationDocUrl: null,
  });

  const updateField = (field: keyof SignupForm, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSpecialty = (key: string) => {
    setForm((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(key)
        ? prev.specialties.filter((s) => s !== key)
        : [...prev.specialties, key],
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Mock: in production, upload to S3/Supabase and get URL
      updateField("validationDocUrl", `file:///${file.name}`);
      toast.success("Documento enviado com sucesso");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!form.name.trim()) {
      toast.error("Informe seu nome.");
      return;
    }
    if (!form.email.includes("@")) {
      toast.error("E-mail inválido.");
      return;
    }
    if (form.password.length < 8) {
      toast.error("A senha deve ter pelo menos 8 caracteres.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }
    if (!form.city) {
      toast.error("Selecione uma cidade.");
      return;
    }
    if (form.role === "CEREMONIAL" && form.specialties.length === 0) {
      toast.error("Selecione pelo menos uma especialidade.");
      return;
    }
    if (form.role === "CEREMONIAL" && !form.validationDocUrl) {
      toast.error("Envie o documento de validação profissional.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          role: form.role,
          phone: form.phone.trim() || null,
          city: form.city,
          ...(form.role === "CEREMONIAL" && {
            yearsExperience: parseInt(form.yearsExperience) || 0,
            specialties: form.specialties,
            validationDocUrl: form.validationDocUrl,
          }),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Erro ao criar conta");
      }

      toast.success("Conta criada! Bem-vindo ao Nupcial Hub.");
      router.push("/");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <div className="w-full max-w-lg">

          {/* ── Header ─────────────────────────────────────────── */}
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold text-ivory mb-2">
              Criar Conta
            </h1>
            <p className="text-sm text-mist">
              Junte-se à comunidade de casamentos e eventos
            </p>
          </div>

          {/* ── Role Selector ──────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {[
              { value: "BRIDE_GROOM" as const, label: "Sou Noivo(a)", icon: Sparkles },
              { value: "CEREMONIAL" as const, label: "Sou Profissional", icon: Briefcase },
            ].map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => updateField("role", opt.value)}
                  className={[
                    "p-4 rounded-xl border transition-all duration-200 flex flex-col items-center gap-2",
                    form.role === opt.value
                      ? "border-gold-400/50 bg-gold-400/5 shadow-gold"
                      : "border-rim bg-raised/40 hover:border-rim hover:bg-raised/60",
                  ].join(" ")}
                >
                  <Icon className={form.role === opt.value ? "text-gold-400" : "text-ash"} />
                  <span className="text-xs font-medium text-ivory text-center">
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ── Form ───────────────────────────────────────────── */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-xs font-medium text-ash mb-1.5">
                Nome completo
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-400 pointer-events-none" />
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="João Silva"
                  className="input-base pl-10"
                  autoFocus
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-ash mb-1.5">
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
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-xs font-medium text-ash mb-1.5">
                WhatsApp
              </label>
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="(41) 99999-0000"
                className="input-base"
              />
            </div>

            {/* City */}
            <div>
              <label htmlFor="city" className="block text-xs font-medium text-ash mb-1.5">
                Cidade
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-400 pointer-events-none" />
                <select
                  id="city"
                  value={form.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  className="input-base pl-10"
                >
                  <option value="">Selecione uma cidade</option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-ash mb-1.5">
                Senha
              </label>
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ash hover:text-ivory"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirm" className="block text-xs font-medium text-ash mb-1.5">
                Confirmar senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-400 pointer-events-none" />
                <input
                  id="confirm"
                  type={showPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(e) => updateField("confirmPassword", e.target.value)}
                  placeholder="••••••••"
                  className="input-base pl-10 pr-10"
                />
              </div>
            </div>

            {/* Conditional fields for Ceremonials */}
            {form.role === "CEREMONIAL" && (
              <>
                {/* Years of Experience */}
                <div>
                  <label htmlFor="years" className="block text-xs font-medium text-ash mb-1.5">
                    Anos de experiência
                  </label>
                  <input
                    id="years"
                    type="number"
                    min="0"
                    value={form.yearsExperience}
                    onChange={(e) => updateField("yearsExperience", e.target.value)}
                    placeholder="5"
                    className="input-base"
                  />
                </div>

                {/* Specialties */}
                <div>
                  <label className="block text-xs font-medium text-ash mb-2.5">
                    Especialidades
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {SPECIALTIES.map((spec) => (
                      <label key={spec.key} className="flex items-center gap-2.5 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={form.specialties.includes(spec.key)}
                          onChange={() => toggleSpecialty(spec.key)}
                          className="w-4 h-4 rounded border border-rim bg-raised checked:bg-gold-400 checked:border-gold-400"
                        />
                        <span className="text-sm text-mist group-hover:text-ivory transition-colors">
                          {spec.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Document Upload */}
                <div>
                  <label className="block text-xs font-medium text-ash mb-2.5">
                    Documento de validação
                  </label>
                  <label className="relative cursor-pointer block">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.png"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div
                      className={[
                        "border-2 border-dashed rounded-xl p-5 text-center transition-all",
                        form.validationDocUrl
                          ? "border-green-500/30 bg-green-500/5"
                          : "border-rim hover:border-gold-400/30 hover:bg-raised",
                      ].join(" ")}
                    >
                      {form.validationDocUrl ? (
                        <div className="flex items-center justify-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                          <span className="text-sm text-ivory font-medium">
                            Arquivo enviado
                          </span>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-5 h-5 text-gold-400 mx-auto mb-2" />
                          <p className="text-sm text-mist">
                            Clique para enviar CNPJ, certidão ou contrato
                          </p>
                          <p className="text-2xs text-ash mt-1">
                            PDF, JPG ou PNG (máx 5MB)
                          </p>
                        </>
                      )}
                    </div>
                  </label>
                </div>
              </>
            )}

            {/* Terms */}
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded border border-rim bg-raised checked:bg-gold-400 checked:border-gold-400 mt-0.5"
              />
              <span className="text-xs text-mist">
                Concordo com os{" "}
                <Link href="#" className="text-gold-400 hover:text-gold-300">
                  Termos de Uso
                </Link>{" "}
                e{" "}
                <Link href="#" className="text-gold-400 hover:text-gold-300">
                  Política de Privacidade
                </Link>
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
              Criar Conta
            </Button>
          </form>

          {/* ── Login Link ─────────────────────────────────────── */}
          <p className="text-center text-sm text-mist mt-6">
            Já tem conta?{" "}
            <Link href="/auth/entrar" className="text-gold-400 hover:text-gold-300 font-medium">
              Entre aqui
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
