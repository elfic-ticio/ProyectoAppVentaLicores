"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Phone, Loader2, Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";

// --- Country detection ---
const COUNTRY_PREFIXES = [
  { prefix: "+52", flag: "🇲🇽", name: "México" },
  { prefix: "+1", flag: "🇺🇸", name: "EE.UU. / Canadá" },
  { prefix: "+34", flag: "🇪🇸", name: "España" },
  { prefix: "+44", flag: "🇬🇧", name: "Reino Unido" },
  { prefix: "+55", flag: "🇧🇷", name: "Brasil" },
  { prefix: "+54", flag: "🇦🇷", name: "Argentina" },
  { prefix: "+57", flag: "🇨🇴", name: "Colombia" },
  { prefix: "+56", flag: "🇨🇱", name: "Chile" },
];

function detectCountry(phone: string) {
  if (!phone.startsWith("+")) return null;
  return COUNTRY_PREFIXES.find((c) => phone.startsWith(c.prefix)) ?? null;
}

// --- Password strength ---
function getPasswordStrength(pwd: string): { score: number; label: string; color: string } {
  if (!pwd) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 1) return { score, label: "Débil", color: "bg-red-500" };
  if (score <= 2) return { score, label: "Regular", color: "bg-orange-500" };
  if (score <= 3) return { score, label: "Buena", color: "bg-yellow-400" };
  return { score, label: "Fuerte", color: "bg-green-500" };
}

// --- Email validation ---
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const touch = (k: string) => () => setTouched((t) => ({ ...t, [k]: true }));

  // Derived validation state
  const emailValid = EMAIL_RE.test(form.email);
  const country = detectCountry(form.phone);
  const strength = getPasswordStrength(form.password);
  const passwordsMatch = form.password === form.confirm && form.confirm.length > 0;
  const canSubmit =
    form.name.trim().length >= 2 &&
    emailValid &&
    form.phone.length >= 8 &&
    strength.score >= 2 &&
    passwordsMatch &&
    acceptPrivacy &&
    acceptTerms;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch<any>("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        }),
      });
      setAuth(data.user, data.access_token);
      router.push("/catalog");
    } catch (err: any) {
      setError(err.message || "Error al crear la cuenta. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-20 relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass w-full max-w-md p-8 rounded-3xl border border-white/10 shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Crear Cuenta</h1>
          <p className="text-slate-400">Únete a la revolución del retail inteligente</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Name */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300 ml-1">Nombre completo</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                required
                value={form.name}
                onChange={set("name")}
                onBlur={touch("name")}
                placeholder="Ana García"
                className="w-full pl-12 pr-4 py-4 glass rounded-2xl border border-white/5 focus:border-purple-500/50 outline-none transition-all text-white"
              />
            </div>
            <AnimatePresence>
              {touched.name && form.name.trim().length < 2 && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-rose-400 ml-1"
                >
                  Ingresa tu nombre completo
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300 ml-1">Correo electrónico</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="email"
                required
                value={form.email}
                onChange={set("email")}
                onBlur={touch("email")}
                placeholder="ana@correo.com"
                className={`w-full pl-12 pr-10 py-4 glass rounded-2xl border outline-none transition-all text-white ${
                  touched.email && !emailValid
                    ? "border-rose-500/60"
                    : touched.email && emailValid
                    ? "border-green-500/60"
                    : "border-white/5 focus:border-purple-500/50"
                }`}
              />
              {touched.email && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  {emailValid ? (
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400" />
                  )}
                </div>
              )}
            </div>
            <AnimatePresence>
              {touched.email && !emailValid && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-rose-400 ml-1"
                >
                  Ingresa un correo válido (ej: usuario@dominio.com)
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300 ml-1">
              Teléfono{" "}
              <span className="text-slate-500 font-normal">(incluye código de país, ej: +52)</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="tel"
                required
                value={form.phone}
                onChange={set("phone")}
                onBlur={touch("phone")}
                placeholder="+52 55 1234 5678"
                className="w-full pl-12 pr-4 py-4 glass rounded-2xl border border-white/5 focus:border-purple-500/50 outline-none transition-all text-white"
              />
            </div>
            {country && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-slate-400 ml-1 flex items-center gap-1"
              >
                <span>{country.flag}</span>
                <span>{country.name} detectado</span>
              </motion.p>
            )}
            <AnimatePresence>
              {touched.phone && form.phone.length < 8 && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-rose-400 ml-1"
                >
                  Ingresa un número de teléfono válido
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300 ml-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type={showPwd ? "text" : "password"}
                required
                value={form.password}
                onChange={set("password")}
                onBlur={touch("password")}
                placeholder="Mínimo 8 caracteres"
                className="w-full pl-12 pr-12 py-4 glass rounded-2xl border border-white/5 focus:border-purple-500/50 outline-none transition-all text-white"
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
              >
                {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Password strength bar */}
            {form.password.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1 px-1">
                <div className="flex gap-1 h-1.5">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`flex-1 rounded-full transition-all duration-300 ${
                        strength.score >= level ? strength.color : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>
                <p className={`text-xs ml-0.5 font-medium ${
                  strength.score <= 1 ? "text-red-400"
                  : strength.score <= 2 ? "text-orange-400"
                  : strength.score <= 3 ? "text-yellow-400"
                  : "text-green-400"
                }`}>
                  {strength.label}
                  {strength.score <= 1 && " — Agrega mayúsculas, números o símbolos"}
                  {strength.score === 2 && " — Agrega símbolos o más longitud"}
                </p>
              </motion.div>
            )}
          </div>

          {/* Confirm password */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300 ml-1">Confirmar contraseña</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type={showPwd ? "text" : "password"}
                required
                value={form.confirm}
                onChange={set("confirm")}
                onBlur={touch("confirm")}
                placeholder="Repite tu contraseña"
                className={`w-full pl-12 pr-10 py-4 glass rounded-2xl border outline-none transition-all text-white ${
                  touched.confirm && form.confirm.length > 0
                    ? passwordsMatch
                      ? "border-green-500/60"
                      : "border-rose-500/60"
                    : "border-white/5 focus:border-purple-500/50"
                }`}
              />
              {touched.confirm && form.confirm.length > 0 && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  {passwordsMatch ? (
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400" />
                  )}
                </div>
              )}
            </div>
            <AnimatePresence>
              {touched.confirm && form.confirm.length > 0 && !passwordsMatch && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-rose-400 ml-1"
                >
                  Las contraseñas no coinciden
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Terms & Conditions — LFPDPPP */}
          <div className="space-y-3 pt-2 border-t border-white/5">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative mt-0.5 flex-shrink-0">
                <input
                  type="checkbox"
                  checked={acceptPrivacy}
                  onChange={(e) => setAcceptPrivacy(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${
                    acceptPrivacy ? "bg-purple-600 border-purple-600" : "border-white/20 group-hover:border-white/40"
                  }`}
                >
                  {acceptPrivacy && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-xs text-slate-400 leading-relaxed">
                He leído y acepto el{" "}
                <Link href="/aviso-privacidad" target="_blank" className="text-purple-400 underline hover:text-purple-300">
                  Aviso de Privacidad
                </Link>{" "}
                de Merma, conforme a la{" "}
                <span className="text-slate-300">Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)</span>.
                Consiento el tratamiento de mis datos personales para los fines descritos.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative mt-0.5 flex-shrink-0">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${
                    acceptTerms ? "bg-purple-600 border-purple-600" : "border-white/20 group-hover:border-white/40"
                  }`}
                >
                  {acceptTerms && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-xs text-slate-400 leading-relaxed">
                He leído y acepto los{" "}
                <Link href="/terminos" target="_blank" className="text-purple-400 underline hover:text-purple-300">
                  Términos y Condiciones
                </Link>{" "}
                del servicio, incluyendo las políticas de compra, devolución y uso de la plataforma.
              </span>
            </label>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-rose-400 text-sm font-medium text-center"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading || !canSubmit}
            className="w-full py-4 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-purple-500/20 mt-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Empezar Ahora"}
          </button>
        </form>

        <p className="mt-6 text-center text-slate-400 text-sm">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/auth/login" className="text-purple-400 font-bold hover:underline">
            Inicia sesión
          </Link>
        </p>
      </motion.div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/10 blur-[150px] rounded-full -z-0" />
    </main>
  );
}
