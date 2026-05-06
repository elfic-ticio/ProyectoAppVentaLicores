"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Edit2, Trash2, Eye, Package, X, Loader2 } from "lucide-react";
import AdminLayout from "@/components/admin-layout";
import { adminFetch } from "@/lib/api-client";
import { cn } from "@/lib/utils";

const GRADES = ["A", "B", "C", "D"] as const;
const GRADE_COLORS: Record<string, string> = {
  A: "text-emerald-400 bg-emerald-500/10",
  B: "text-indigo-400 bg-indigo-500/10",
  C: "text-amber-400 bg-amber-500/10",
  D: "text-rose-400 bg-rose-500/10",
};

const EMPTY_FORM = {
  sku: "",
  title: "",
  description: "",
  conditionGrade: "A" as const,
  originalPrice: "",
  salePrice: "",
  stock: "",
  images: "",
};

export default function ProductsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("Todos");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const { data: products = [], isLoading } = useQuery<any[]>({
    queryKey: ["admin-products"],
    queryFn: () => adminFetch("/catalog?limit=100"),
  });

  const filtered = (products as any[]).filter((p) => {
    const matchSearch =
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase());
    const matchGrade =
      gradeFilter === "Todos" || p.conditionGrade === gradeFilter;
    return matchSearch && matchGrade;
  });

  const setField = (k: keyof typeof EMPTY_FORM) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      await adminFetch("/catalog", {
        method: "POST",
        body: JSON.stringify({
          sku: form.sku,
          title: form.title,
          description: form.description,
          conditionGrade: form.conditionGrade,
          originalPrice: Number(form.originalPrice),
          salePrice: Number(form.salePrice),
          stock: Number(form.stock),
          images: form.images.split(",").map((s) => s.trim()).filter(Boolean),
        }),
      });
      await qc.invalidateQueries({ queryKey: ["admin-products"] });
      setShowModal(false);
      setForm(EMPTY_FORM);
    } catch (err: any) {
      setFormError(err.message || "Error al guardar el producto");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este producto?")) return;
    try {
      await adminFetch(`/catalog/${id}`, { method: "DELETE" });
      await qc.invalidateQueries({ queryKey: ["admin-products"] });
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Productos</h1>
            <p className="text-slate-500 text-sm mt-1">
              {isLoading ? "Cargando..." : `${products.length} productos en el catálogo`}
            </p>
          </div>
          <button
            onClick={() => { setShowModal(true); setForm(EMPTY_FORM); setFormError(""); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-sm transition-all"
          >
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
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-slate-500" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="text-left px-6 py-4 font-medium">Producto</th>
                    <th className="text-left px-4 py-4 font-medium">Grado</th>
                    <th className="text-right px-4 py-4 font-medium">Precio original</th>
                    <th className="text-right px-4 py-4 font-medium">Precio venta</th>
                    <th className="text-right px-4 py-4 font-medium">Stock</th>
                    <th className="px-6 py-4" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p: any) => (
                    <motion.tr
                      key={p.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {p.images?.[0] ? (
                              <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                            ) : (
                              <Package className="w-5 h-5 text-slate-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-white text-sm">{p.title}</p>
                            <p className="text-slate-600 text-xs">{p.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={cn("px-2 py-1 rounded-lg text-xs font-bold", GRADE_COLORS[p.conditionGrade] ?? GRADE_COLORS.A)}>
                          Grado {p.conditionGrade}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right text-slate-500 line-through">
                        ${Number(p.originalPrice).toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-right font-bold text-white">
                        ${Number(p.salePrice).toLocaleString()}
                      </td>
                      <td className={cn("px-4 py-4 text-right font-bold", p.stock === 0 ? "text-rose-400" : p.stock <= 5 ? "text-amber-400" : "text-white")}>
                        {p.stock}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 justify-end">
                          <button className="p-1.5 text-slate-500 hover:text-white transition-colors"><Eye className="w-4 h-4" /></button>
                          <button className="p-1.5 text-slate-500 hover:text-indigo-400 transition-colors"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(p.id)} className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="text-center py-16 text-slate-500">No se encontraron productos.</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal Agregar Producto */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <h2 className="text-lg font-bold text-white">Agregar Producto</h2>
                <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-400">SKU *</label>
                    <input required value={form.sku} onChange={setField("sku")} placeholder="TEQ-001" className="w-full px-3 py-2.5 bg-slate-800 border border-white/5 rounded-xl text-sm text-white outline-none focus:border-indigo-500/50" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-400">Grado *</label>
                    <select required value={form.conditionGrade} onChange={setField("conditionGrade")} className="w-full px-3 py-2.5 bg-slate-800 border border-white/5 rounded-xl text-sm text-white outline-none focus:border-indigo-500/50">
                      {GRADES.map((g) => <option key={g} value={g}>Grado {g}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-400">Título *</label>
                  <input required value={form.title} onChange={setField("title")} placeholder="Tequila Don Julio 70 Añejo Cristalino 750ml" className="w-full px-3 py-2.5 bg-slate-800 border border-white/5 rounded-xl text-sm text-white outline-none focus:border-indigo-500/50" />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-400">Descripción * (mín. 20 caracteres)</label>
                  <textarea required value={form.description} onChange={setField("description")} rows={3} placeholder="Describe el estado del producto, defectos, empaque, etc." className="w-full px-3 py-2.5 bg-slate-800 border border-white/5 rounded-xl text-sm text-white outline-none focus:border-indigo-500/50 resize-none" />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-400">Precio original *</label>
                    <input required type="number" min="1" value={form.originalPrice} onChange={setField("originalPrice")} placeholder="1000" className="w-full px-3 py-2.5 bg-slate-800 border border-white/5 rounded-xl text-sm text-white outline-none focus:border-indigo-500/50" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-400">Precio venta *</label>
                    <input required type="number" min="1" value={form.salePrice} onChange={setField("salePrice")} placeholder="750" className="w-full px-3 py-2.5 bg-slate-800 border border-white/5 rounded-xl text-sm text-white outline-none focus:border-indigo-500/50" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-400">Stock *</label>
                    <input required type="number" min="0" value={form.stock} onChange={setField("stock")} placeholder="10" className="w-full px-3 py-2.5 bg-slate-800 border border-white/5 rounded-xl text-sm text-white outline-none focus:border-indigo-500/50" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-400">URL de imagen * (separa varias con coma)</label>
                  <input required value={form.images} onChange={setField("images")} placeholder="https://images.unsplash.com/..." className="w-full px-3 py-2.5 bg-slate-800 border border-white/5 rounded-xl text-sm text-white outline-none focus:border-indigo-500/50" />
                </div>

                {formError && (
                  <p className="text-rose-400 text-sm">{formError}</p>
                )}

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-semibold transition-all">
                    Cancelar
                  </button>
                  <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar producto"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
