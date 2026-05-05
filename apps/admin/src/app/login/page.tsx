"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, ShoppingBag, Loader2, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/api-client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await adminFetch<any>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (!["ADMIN", "SUPER_ADMIN", "MODERATOR"].includes(data.user?.role)) {
        setError("No tienes permisos de administrador.");
        return;
      }
      await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: data.access_token }),
      });
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white mb-1">Panel Admin</h1>
          <p className="text-slate-500 text-sm">Acceso restringido — solo personal autorizado</p>
        </div>

        <div className="bg-slate-900 border border-white/5 rounded-3xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-400 ml-1">Correo electrónico</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@merma.mx"
                  className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-white/5 rounded-2xl text-white outline-none focus:border-indigo-500/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-400 ml-1">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                <input
                  type={showPwd ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contraseña"
                  className="w-full pl-12 pr-12 py-4 bg-slate-800 border border-white/5 rounded-2xl text-white outline-none focus:border-indigo-500/50 transition-all"
                />
                <button type="button" onClick={() => setShowPwd((v) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                  {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-rose-400 text-sm text-center font-medium">{error}</p>
            )}

            <button
              disabled={loading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Ingresar al panel"}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-700 text-xs mt-6">
          Merma Marketplace — Panel de administración
        </p>
      </motion.div>
    </main>
  );
}
