"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Eye, Truck, CheckCircle, Clock, XCircle, Package } from "lucide-react";
import AdminLayout from "@/components/admin-layout";
import { cn } from "@/lib/utils";

const STATUSES = ["Todos", "Pendiente", "En camino", "Entregado", "Cancelado"] as const;

const STATUS_CONFIG: Record<string, { color: string; icon: React.ElementType }> = {
  Pendiente: { color: "text-amber-400 bg-amber-500/10", icon: Clock },
  "En camino": { color: "text-indigo-400 bg-indigo-500/10", icon: Truck },
  Entregado: { color: "text-emerald-400 bg-emerald-500/10", icon: CheckCircle },
  Cancelado: { color: "text-rose-400 bg-rose-500/10", icon: XCircle },
};

const mockOrders = [
  { id: "ORD-0001", customer: "Ana García", email: "ana@email.com", items: 2, total: 1820, status: "Entregado", payment: "Tarjeta", date: "2026-05-01", tracking: "FEDEX12345" },
  { id: "ORD-0002", customer: "Carlos López", email: "carlos@email.com", items: 1, total: 600, status: "En camino", payment: "OXXO", date: "2026-05-02", tracking: "DHL98765" },
  { id: "ORD-0003", customer: "María Torres", email: "maria@email.com", items: 3, total: 2190, status: "Pendiente", payment: "SPEI", date: "2026-05-03", tracking: "" },
  { id: "ORD-0004", customer: "Roberto Núñez", email: "roberto@email.com", items: 1, total: 490, status: "Cancelado", payment: "Tarjeta", date: "2026-05-03", tracking: "" },
  { id: "ORD-0005", customer: "Sofía Ramírez", email: "sofia@email.com", items: 2, total: 1400, status: "En camino", payment: "Tarjeta", date: "2026-05-04", tracking: "ESTAFETA44321" },
];

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const filtered = mockOrders.filter((o) => {
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "Todos" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Pedidos</h1>
            <p className="text-slate-500 text-sm mt-1">{mockOrders.length} pedidos totales</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-white/5 text-slate-300 rounded-xl font-semibold text-sm transition-all">
              <Package className="w-4 h-4" /> Exportar CSV
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por ID o cliente..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-white/5 rounded-xl text-sm text-white outline-none focus:border-indigo-500/50 transition-all"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {STATUSES.map((s) => {
              const cfg = s !== "Todos" ? STATUS_CONFIG[s] : null;
              return (
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
              );
            })}
          </div>
        </div>

        {/* Table */}
        <div className="bg-slate-900 rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="text-left px-6 py-4 font-medium">Pedido</th>
                  <th className="text-left px-4 py-4 font-medium">Cliente</th>
                  <th className="text-center px-4 py-4 font-medium">Artículos</th>
                  <th className="text-right px-4 py-4 font-medium">Total</th>
                  <th className="text-left px-4 py-4 font-medium">Estado</th>
                  <th className="text-left px-4 py-4 font-medium">Pago</th>
                  <th className="text-left px-4 py-4 font-medium">Fecha</th>
                  <th className="px-6 py-4" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => {
                  const cfg = STATUS_CONFIG[o.status];
                  const Icon = cfg.icon;
                  return (
                    <motion.tr
                      key={o.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-mono font-bold text-white text-xs">{o.id}</p>
                        {o.tracking && <p className="text-slate-600 text-xs mt-0.5">{o.tracking}</p>}
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium text-white">{o.customer}</p>
                        <p className="text-slate-500 text-xs">{o.email}</p>
                      </td>
                      <td className="px-4 py-4 text-center text-slate-400">{o.items}</td>
                      <td className="px-4 py-4 text-right font-bold text-white">
                        ${o.total.toLocaleString()}
                      </td>
                      <td className="px-4 py-4">
                        <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold", cfg.color)}>
                          <Icon className="w-3 h-3" /> {o.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-slate-400 text-sm">{o.payment}</td>
                      <td className="px-4 py-4 text-slate-500 text-xs">{o.date}</td>
                      <td className="px-6 py-4">
                        <button className="p-1.5 text-slate-500 hover:text-white transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-500">No se encontraron pedidos.</div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
