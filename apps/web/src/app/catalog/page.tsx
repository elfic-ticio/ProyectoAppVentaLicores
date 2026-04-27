"use client";

import { useQuery } from "@tanstack/react-query";
import { catalogApi } from "@/lib/api-client";
import { ProductCard } from "@/components/catalog/product-card";
import { motion } from "framer-motion";
import { Filter, SlidersHorizontal, Search as SearchIcon } from "lucide-react";

export default function CatalogPage() {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: () => catalogApi.getProducts(),
  });

  const categories = ["Todos", "Tequila", "Mezcal", "Whisky", "Ginebra", "Vino"];

  return (
    <main className="pt-28 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-white mb-2">Catálogo de Licores</h1>
          <p className="text-slate-400">Encuentra las mejores marcas con descuentos exclusivos por merma.</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input 
            type="text" 
            placeholder="Buscar por marca o tipo..."
            className="w-full pl-12 pr-4 py-4 glass rounded-2xl border-white/5 focus:border-indigo-500/50 outline-none transition-all"
          />
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex gap-3 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {categories.map((cat) => (
          <button 
            key={cat}
            className="px-6 py-2.5 glass rounded-xl text-sm font-medium hover:bg-white/5 border-white/5 hover:border-white/10 transition-all whitespace-nowrap active:scale-95"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="glass rounded-2xl aspect-[3/4] animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-rose-400">Error al cargar el catálogo. Verifica que la API esté corriendo.</p>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {products?.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      )}

      {products?.length === 0 && !isLoading && (
        <div className="text-center py-20">
          <p className="text-slate-500">No se encontraron productos en esta categoría.</p>
        </div>
      )}
    </main>
  );
}
