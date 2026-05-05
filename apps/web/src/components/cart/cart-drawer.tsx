"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag, CreditCard } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useRouter } from "next/navigation";

export function CartDrawer() {
  const { items, isOpen, toggleCart, updateQuantity, removeItem, getTotal, getSavings } = useCartStore();
  const router = useRouter();

  const goToCheckout = () => {
    toggleCart();
    router.push("/checkout");
  };

  const exploreCatalog = () => {
    toggleCart();
    router.push("/catalog");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md glass border-l border-white/10 z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-indigo-400" />
                <h2 className="text-xl font-bold text-white">Tu Carrito</h2>
              </div>
              <button onClick={toggleCart} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="w-10 h-10 text-slate-600" />
                  </div>
                  <p className="text-slate-400 mb-4">Tu carrito está vacío</p>
                  <button
                    onClick={exploreCatalog}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all active:scale-95"
                  >
                    Explorar productos
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between mb-1">
                        <h4 className="text-white font-medium text-sm line-clamp-1">{item.title}</h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-slate-500 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-indigo-400 font-bold mb-3">${item.salePrice.toLocaleString()}</p>
                      <div className="flex items-center border border-white/10 rounded-lg overflow-hidden w-fit">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 hover:bg-white/5 text-slate-400"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-3 text-sm font-medium text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 hover:bg-white/5 text-slate-400"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && (
              <div className="p-6 border-t border-white/5 bg-white/[0.02]">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-slate-400 text-sm">
                    <span>Subtotal</span>
                    <span>${getTotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 text-sm font-medium">
                    <span>Tu ahorro total</span>
                    <span>-${getSavings().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-white/5">
                    <span>Total</span>
                    <span>${getTotal().toLocaleString()}</span>
                  </div>
                </div>
                <button
                  onClick={goToCheckout}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-indigo-500/20"
                >
                  <CreditCard className="w-5 h-5" /> Finalizar Pedido
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
