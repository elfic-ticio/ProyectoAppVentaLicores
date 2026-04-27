"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Mail, Lock, User, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await apiFetch<any>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      setAuth(data.user, data.access_token);
      router.push("/catalog");
    } catch (err: any) {
      setError(err.message || "Error al crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-20 relative">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass w-full max-w-md p-8 rounded-3xl border-white/10 shadow-2xl relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Crear Cuenta</h1>
          <p className="text-slate-400">Únete a la revolución del retail inteligente</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full pl-12 pr-4 py-4 glass rounded-2xl border-white/5 focus:border-purple-500/50 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                className="w-full pl-12 pr-4 py-4 glass rounded-2xl border-white/5 focus:border-purple-500/50 outline-none transition-all"
              />
            </div>
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
            disabled={loading}
            className="w-full py-4 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-purple-500/20"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Empezar Ahora"}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-400 text-sm">
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
