"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Filter, Edit2, Trash2, Eye, Package } from "lucide-react";
import AdminLayout from "@/components/admin-layout";
import { cn } from "@/lib/utils";

const GRADES = ["A", "B", "C", "D"] as const;
const GRADE_COLORS: Record<string, string> = {
  A: "text-emerald-400 bg-emerald-500/10",
  B: "text-indigo-400 bg-indigo-500/10",
  C: "text-amber-400 bg-amber-500/10",
  D: "text-rose-400 bg-rose-500/10",
};

const STATUS_COLORS: Record<string, string> = {
  Activo: "text-emerald-400 bg-emerald-500/10",
  Pausado: "text-amber-400 bg-amber-500/10",
  Agotado: "text-rose-400 bg-rose-500/10",
};

const mockProducts = [
  { id: "1", sku: "TQ-001", title: "Don Julio 70 Añejo Cristalino", grade: "A", originalPrice: 1800, salePrice: 1200, stock: 12, seller: "Licores Premium MX", status: "Activo" },
  { id: "2", sku: "MC-002", title: "Montelobos Mezcal Joven", grade: "B", originalPrice: 950, salePrice: 600, stock: 5, seller: "Distribuidora Sur", status: "Activo" },
  { id: "3", sku: "WH-003", title: "Glenfiddich 12 Year Old", grade: "A", originalPrice: 1400, salePrice: 980, stock: 0, seller: "Premium Imports", status: "Agotado" },
  { id: "4", sku: "GN-004", title: "Hendrick's Gin Flora Adora", grade: "C", originalPrice: 850, salePrice: 490, stock: 23, seller: "Licores Premium MX", status: "Activo" },
  { id: "5", sku: "VN-005", title: "Baron Balché Rivero González", grade: "B", originalPrice: 650, salePrice: 420, stock: 3, seller: "Viñedos del Norte", status: "Pausado" },
];

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState<string>("Todos");

  const filtered = mockProducts.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchGrade = gradeFilter === "Todos" || p.grade === gradeFilter;
    return matchSearch && matchGrade;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Productos</h1>
            <p className="text-slate-500 text-sm mt-1">{mockProducts.length} productos en el catálogo</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-sm transition-all">
            <Plus className="w-4 h-4" /> Agregar producto
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
              placeholder="Buscar por nombre o SKU..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-white/5 rounded-xl text-sm text-white outline-none focus:border-indigo-500/50 transition-all"
            />
          </div>
          <div className="flex gap-2">
            {["Todos", ...GRADES].map((g) => (
              <button
                key={g}
                onClick={() => setGradeFilter(g)}
                className={cn(
                  "px-3 py-2.5 rounded-xl text-xs font-bold transition-all border",
                  gradeFilter === g
                    ? "bg-indigo-600 border-indigo-500 text-white"
                    : "bg-slate-900 border-white/5 text-slate-400 hover:text-white"
                )}
              >
                {g === "Todos" ? "Todos" : `Grado ${g}`}
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
                  <th className="text-left px-6 py-4 font-medium">Producto</th>
                  <th className="text-left px-4 py-4 font-medium">Grado</th>
                  <th className="text-right px-4 py-4 font-medium">Precio original</th>
                  <th className="text-right px-4 py-4 font-medium">Precio venta</th>
                  <th className="text-right px-4 py-4 font-medium">Stock</th>
                  <th className="text-left px-4 py-4 font-medium">Estado</th>
                  <th className="text-left px-4 py-4 font-medium">Vendedor</th>
                  <th className="px-6 py-4" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                          <Package className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <p className="font-medium text-white text-sm">{p.title}</p>
                          <p className="text-slate-600 text-xs">{p.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={cn("px-2 py-1 rounded-lg text-xs font-bold", GRADE_COLORS[p.grade])}>
                        Grado {p.grade}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right text-slate-500 line-through">
                      ${p.originalPrice.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-right font-bold text-white">
                      ${p.salePrice.toLocaleString()}
                    </td>
                    <td className={cn("px-4 py-4 text-right font-bold", p.stock === 0 ? "text-rose-400" : p.stock <= 5 ? "text-amber-400" : "text-white")}>
                      {p.stock}
                    </td>
                    <td className="px-4 py-4">
                      <span className={cn("px-2 py-1 rounded-lg text-xs font-bold", STATUS_COLORS[p.status])}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-400 text-xs">{p.seller}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button className="p-1.5 text-slate-500 hover:text-white transition-colors"><Eye className="w-4 h-4" /></button>
                        <button className="p-1.5 text-slate-500 hover:text-indigo-400 transition-colors"><Edit2 className="w-4 h-4" /></button>
                        <button className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-500">No se encontraron productos.</div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
