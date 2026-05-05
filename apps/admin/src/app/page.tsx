"use client";

import { motion } from "framer-motion";
import { TrendingUp, Package, Users, DollarSign, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import AdminLayout from "@/components/admin-layout";

export default function DashboardPage() {
  return (
    <AdminLayout>
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Hola, Administrador</h1>
        <p className="text-slate-400 text-sm">Esto es lo que está pasando hoy en el marketplace.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Ventas Totales" 
          value="$128,430" 
          change="+12.5%" 
          icon={<DollarSign className="w-6 h-6 text-emerald-400" />} 
          color="emerald"
        />
        <StatCard 
          title="Productos Activos" 
          value="1,240" 
          change="+3.2%" 
          icon={<Package className="w-6 h-6 text-indigo-400" />} 
          color="indigo"
        />
        <StatCard 
          title="Vendedores" 
          value="45" 
          change="+5.1%" 
          icon={<Users className="w-6 h-6 text-purple-400" />} 
          color="purple"
        />
        <StatCard 
          title="Ahorro Generado" 
          value="$42,100" 
          change="+8.4%" 
          icon={<TrendingUp className="w-6 h-6 text-cyan-400" />} 
          color="cyan"
        />
      </div>

      {/* Tables or Charts Area (Placeholder) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-6 rounded-2xl border-white/5">
          <h3 className="text-lg font-bold mb-6 flex items-center justify-between">
            Ventas Recientes
            <button className="text-xs text-indigo-400 hover:underline">Ver todo</button>
          </h3>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800" />
                  <div>
                    <p className="text-sm font-medium">Pedido #1234{i}</p>
                    <p className="text-xs text-slate-500">Hace 2 horas</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-white">$1,200</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass p-6 rounded-2xl border-white/5">
          <h3 className="text-lg font-bold mb-6 flex items-center justify-between">
            Productos con Poco Stock
            <button className="text-xs text-indigo-400 hover:underline">Gestionar</button>
          </h3>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-800" />
                  <div>
                    <p className="text-sm font-medium">Tequila Don Julio 70</p>
                    <p className="text-xs text-slate-500">Vendedor: Premium MX</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-rose-400">2 uni.</p>
                  <p className="text-[10px] text-slate-600 uppercase">Agotándose</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </AdminLayout>
  );
}

function StatCard({ title, value, change, icon, color }: { title: string, value: string, change: string, icon: React.ReactNode, color: string }) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="glass p-6 rounded-2xl border-white/5 relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 rounded-xl bg-white/5">
          {icon}
        </div>
        <span className={cn(
          "text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1",
          change.startsWith('+') ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
        )}>
          {change} <ArrowUpRight className="w-3 h-3" />
        </span>
      </div>
      <div>
        <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
        <p className="text-2xl font-black text-white">{value}</p>
      </div>
      {/* Decorative gradient blur */}
      <div className={cn(
        "absolute -bottom-4 -right-4 w-16 h-16 blur-2xl rounded-full opacity-20",
        `bg-${color}-500`
      )} />
    </motion.div>
  );
}
