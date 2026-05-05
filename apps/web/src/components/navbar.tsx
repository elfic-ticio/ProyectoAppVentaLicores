"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Search, User, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../lib/utils";
import { useCartStore } from "@/store/cart-store";
import { NotificationCenter } from "./notifications/notification-center";

const navLinks = [
  { href: "/catalog", label: "Catálogo" },
  { href: "/sellers", label: "Vendedores" },
  { href: "/about", label: "Nosotros" },
];

export function Navbar() {
  const pathname = usePathname();
  const { toggleCart, items } = useCartStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 w-full z-50 flex justify-center px-4 sm:px-6 pt-4 sm:pt-6"
      >
        <div className="glass w-full max-w-7xl h-14 sm:h-16 rounded-2xl flex items-center justify-between px-4 sm:px-8 border border-white/10 shadow-2xl shadow-black/50">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Merma<span className="text-indigo-400">.</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink key={link.href} href={link.href} active={pathname === link.href}>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="p-2 text-slate-400 hover:text-white transition-colors hidden sm:block">
              <Search className="w-5 h-5" />
            </button>
            <div className="hidden sm:block">
              <NotificationCenter />
            </div>
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
              className="hidden sm:flex items-center gap-2 ml-2 px-4 py-2 bg-white text-black font-semibold rounded-xl hover:bg-slate-200 transition-colors text-sm"
            >
              <User className="w-4 h-4" /> Entrar
            </Link>
            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
              aria-label="Menú"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-72 glass border-l border-white/10 z-50 flex flex-col md:hidden"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <span className="text-lg font-bold text-white">Menú</span>
                <button onClick={() => setMobileOpen(false)} className="p-2 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-grow p-6 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "block px-4 py-3 rounded-xl font-medium transition-all",
                      pathname === link.href
                        ? "bg-indigo-600 text-white"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="p-6 border-t border-white/5 space-y-3">
                <Link
                  href="/auth/login"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-white text-black font-bold rounded-xl"
                >
                  <User className="w-4 h-4" /> Iniciar sesión
                </Link>
                <Link
                  href="/auth/register"
                  className="w-full flex items-center justify-center gap-2 py-3 glass border border-white/10 text-white font-bold rounded-xl"
                >
                  Crear cuenta
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({ href, children, active }: { href: string; children: React.ReactNode; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium transition-colors relative group",
        active ? "text-white" : "text-slate-400 hover:text-white"
      )}
    >
      {children}
      <span
        className={cn(
          "absolute -bottom-1 left-0 h-0.5 bg-indigo-500 transition-all",
          active ? "w-full" : "w-0 group-hover:w-full"
        )}
      />
    </Link>
  );
}
