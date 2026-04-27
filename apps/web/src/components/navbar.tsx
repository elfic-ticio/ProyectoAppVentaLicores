"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Search, User, Menu } from "lucide-react";
import Link from "next/link";
import { cn } from "../lib/utils";
import { useCartStore } from "@/store/cart-store";
import { NotificationCenter } from "./notifications/notification-center";

export function Navbar() {
  const { toggleCart, items } = useCartStore();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 w-full z-50 flex justify-center px-6 pt-6"
    >
      <div className="glass w-full max-w-7xl h-16 rounded-2xl flex items-center justify-between px-8 border-white/10 shadow-2xl shadow-black/50">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Merma<span className="text-indigo-400">.</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink href="/catalog">Catálogo</NavLink>
          <NavLink href="/sellers">Vendedores</NavLink>
          <NavLink href="/about">Nosotros</NavLink>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-400 hover:text-white transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <NotificationCenter />
          <button 
            onClick={toggleCart}
            className="p-2 text-slate-400 hover:text-white transition-colors relative"
          >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-indigo-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
          <Link 
            href="/auth/login"
            className="hidden sm:flex items-center gap-2 ml-2 px-5 py-2 bg-white text-black font-semibold rounded-xl hover:bg-slate-200 transition-colors"
          >
            <User className="w-4 h-4" /> Entrar
          </Link>
          <button className="md:hidden p-2 text-slate-400">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </motion.nav>
  );
}

function NavLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="text-sm font-medium text-slate-400 hover:text-white transition-colors relative group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 transition-all group-hover:w-full" />
    </Link>
  );
}
