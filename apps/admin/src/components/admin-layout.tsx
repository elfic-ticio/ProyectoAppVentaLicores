"use client";

import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Settings,
  LogOut,
  ShoppingBag,
  Bell
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Package, label: "Productos", href: "/products" },
  { icon: Users, label: "Vendedores", href: "/sellers" },
  { icon: ShoppingCart, label: "Pedidos", href: "/orders" },
  { icon: Settings, label: "Ajustes", href: "/settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/session", { method: "DELETE" });
    sessionStorage.removeItem("merma-admin-auth");
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-50">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 flex flex-col fixed h-full bg-slate-950/50 backdrop-blur-xl">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">Admin<span className="text-indigo-500">.</span></span>
        </div>

        <nav className="flex-grow px-4 space-y-2 mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
                pathname === item.href 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6 mt-auto">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-rose-400 transition-colors w-full">
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-grow flex flex-col">
        {/* Top Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-slate-950/20 backdrop-blur-sm sticky top-0 z-10">
          <h2 className="text-sm font-medium text-slate-400">Panel de Control &gt; {pathname === '/' ? 'Dashboard' : pathname.slice(1)}</h2>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-white relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10" />
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
