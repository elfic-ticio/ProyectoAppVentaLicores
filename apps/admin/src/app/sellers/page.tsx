"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Eye, Edit2, CheckCircle, Clock, XCircle, Store } from "lucide-react";
import AdminLayout from "@/components/admin-layout";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<string, string> = {
  Verificado: "text-emerald-400 bg-emerald-500/10",
  Pendiente: "text-amber-400 bg-amber-500/10",
  Suspendido: "text-rose-400 bg-rose-500/10",
};

const mockSellers = [
  { id: "S-001", name: "Licores Premium MX", rfc: "LPM200101ABC", email: "ventas@licores.mx", products: 45, sales: 128430, level: "Gold", status: "Verificado" },
  { id: "S-002", name: "Distribuidora Sur", rfc: "DSU180601XYZ", email: "contacto@distrsur.com", products: 22, sales: 54200, level: "Silver", status: "Verificado" },
  { id: "S-003", name: "Viñedos del Norte", rfc: "VNO190301DEF", email: "admin@viñedos.mx", products: 8, sales: 12000, level: "Bronze", status: "Pendiente" },
  { id: "S-004", name: "Premium Imports", rfc: "PIM210501GHI", email: "imports@premium.mx", products: 31, sales: 89000, level: "Gold", status: "Verificado" },
  { id: "S-005", name: "Craft Spirits MX", rfc: "CSM220801JKL", email: "info@craftspirits.mx", products: 0, sales: 0, level: "Bronze", status: "Suspendido" },
];

const LEVEL_COLORS: Record<string, string> = {
  Gold: "text-yellow-400 bg-yellow-500/10",
  Silver: "text-slate-300 bg-slate-500/10",
  Bronze: "text-orange-400 bg-orange-500/10",
};

export default function SellersAdminPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const filtered = mockSellers.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rfc.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "Todos" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Vendedores</h1>
            <p className="text-slate-500 text-sm mt-1">{mockSellers.length} vendedores registrados</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-sm transition-all">
            <Plus className="w-4 h-4" /> Invitar vendedor
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre o RFC..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-white/5 rounded-xl text-sm text-white outline-none focus:border-indigo-500/50 transition-all"
            />
          </div>
          <div className="flex gap-2">
            {["Todos", "Verificado", "Pendiente", "Suspendido"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "px-3 py-2.5 rounded-xl text-xs font-bold transition-all border",
                  statusFilter === s
                    ? "bg-indigo-600 border-indigo-500 text-white"
                    : "bg-slate-900 border-white/5 text-slate-400 hover:text-white"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-slate-900 rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="text-left px-6 py-4 font-medium">Vendedor</th>
                  <th className="text-left px-4 py-4 font-medium">RFC</th>
                  <th className="text-center px-4 py-4 font-medium">Productos</th>
                  <th className="text-right px-4 py-4 font-medium">Ventas</th>
                  <th className="text-left px-4 py-4 font-medium">Nivel</th>
                  <th className="text-left px-4 py-4 font-medium">Estado</th>
                  <th className="px-6 py-4" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <motion.tr
                    key={s.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                          <Store className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{s.name}</p>
                          <p className="text-slate-500 text-xs">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-mono text-slate-400 text-xs">{s.rfc}</td>
                    <td className="px-4 py-4 text-center text-white font-bold">{s.products}</td>
                    <td className="px-4 py-4 text-right font-bold text-white">
                      ${s.sales.toLocaleString()}
                    </td>
                    <td className="px-4 py-4">
                      <span className={cn("px-2.5 py-1 rounded-lg text-xs font-bold", LEVEL_COLORS[s.level])}>
                        {s.level}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={cn("px-2.5 py-1 rounded-lg text-xs font-bold", STATUS_CONFIG[s.status])}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button className="p-1.5 text-slate-500 hover:text-white transition-colors"><Eye className="w-4 h-4" /></button>
                        <button className="p-1.5 text-slate-500 hover:text-indigo-400 transition-colors"><Edit2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-500">No se encontraron vendedores.</div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
