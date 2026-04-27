"use client";

import { motion } from "framer-motion";
import { Tag, ShoppingCart, Percent } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    originalPrice: number;
    salePrice: number;
    images: string[];
    conditionGrade: string;
    stock: number;
  };
}

const conditionColors: Record<string, string> = {
  A: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  B: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  C: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const discount = Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="glass rounded-2xl overflow-hidden border-white/5 flex flex-col group h-full"
    >
      <div className="relative aspect-square overflow-hidden bg-white/5">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Discount Badge */}
        <div className="absolute top-4 left-4 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg">
          <Percent className="w-3 h-3" /> {discount}% OFF
        </div>

        {/* Condition Badge */}
        <div className={cn(
          "absolute top-4 right-4 text-[10px] font-black px-2 py-0.5 rounded border uppercase tracking-wider",
          conditionColors[product.conditionGrade] || "bg-slate-500/10 text-slate-400"
        )}>
          Grado {product.conditionGrade}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-white font-semibold text-lg leading-snug mb-2 line-clamp-2">
          {product.title}
        </h3>
        
        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl font-black text-white">
              ${product.salePrice.toLocaleString()}
            </span>
            <span className="text-sm text-slate-500 line-through">
              ${product.originalPrice.toLocaleString()}
            </span>
          </div>

          <button 
            onClick={() => addItem(product)}
            className="w-full py-3 bg-white hover:bg-slate-100 text-black rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" /> Agregar
          </button>
        </div>
      </div>
    </motion.div>
  );
}
