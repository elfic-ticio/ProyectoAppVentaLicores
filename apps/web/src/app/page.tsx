"use client";

import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight, ShieldCheck, Zap, Star } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative flex flex-col items-center overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full max-w-7xl px-6 pt-24 pb-32 md:pt-32 md:pb-48 flex flex-col items-center text-center">
        {/* Floating Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass px-4 py-1.5 rounded-full text-sm font-medium text-indigo-400 mb-8 flex items-center gap-2"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Nueva Selección de Electrónicos
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-8"
        >
          Segundas oportunidades para <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
            productos de primera
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl text-slate-400 text-lg md:text-xl mb-10"
        >
          Accede a productos nuevos con empaques dañados o defectos cosméticos mínimos. 
          Calidad retail con descuentos de hasta el 70%.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/catalog" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/25 active:scale-95">
            Explorar Catálogo <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/sellers" className="px-8 py-4 glass hover:bg-white/5 text-white rounded-xl font-semibold transition-all active:scale-95">
            Vender en Merma
          </Link>
        </motion.div>

        {/* Feature Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full"
        >
          <FeatureCard 
            icon={<ShieldCheck className="w-6 h-6 text-cyan-400" />}
            title="Calidad Garantizada"
            desc="Cada producto es verificado manualmente por nuestro equipo."
          />
          <FeatureCard 
            icon={<Zap className="w-6 h-6 text-indigo-400" />}
            title="Envío Ultra-rápido"
            desc="Logística optimizada para entregas en menos de 48 horas."
          />
          <FeatureCard 
            icon={<Star className="w-6 h-6 text-purple-400" />}
            title="Precios de Merma"
            desc="Lo que otros descartan, tú lo aprovechas a precio de costo."
          />
        </motion.div>
      </section>

      {/* Decorative Circles */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-[20%] right-[-10%] w-[30%] h-[30%] bg-purple-500/10 blur-[120px] rounded-full -z-10" />
    </main>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="glass p-8 rounded-2xl text-left border-white/5 hover:border-white/10 transition-colors group">
      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
