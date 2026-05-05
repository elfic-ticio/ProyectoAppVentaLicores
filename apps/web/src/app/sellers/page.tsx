"use client";

import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Store, TrendingUp, Shield, Zap, Package, DollarSign } from "lucide-react";
import Link from "next/link";

const benefits = [
  { icon: TrendingUp, title: "Alcance Nacional", desc: "Llega a miles de compradores en toda la república mexicana desde el primer día." },
  { icon: Shield, title: "Pagos Seguros", desc: "Recibe tus pagos vía Stripe, SPEI u OXXO. Liquidación semanal garantizada." },
  { icon: Zap, title: "Alta Rápida", desc: "Crea tu tienda en menos de 24 horas. Proceso digital, sin papeleo innecesario." },
  { icon: Package, title: "Logística Integrada", desc: "Conectamos con los principales paqueteros. Genera guías desde el panel." },
];

const steps = [
  { num: "01", title: "Regístrate", desc: "Crea tu cuenta de vendedor con RFC, datos legales y cuenta bancaria." },
  { num: "02", title: "Sube tu catálogo", desc: "Fotografía tus productos, asigna el grado de condición A-D y establece precios." },
  { num: "03", title: "Vende y cobra", desc: "Cuando el comprador confirma su pedido, te notificamos. Envía y recibe tu pago." },
];

const requirements = [
  "Empresa o persona física con actividad empresarial en México",
  "RFC activo y situación fiscal actualizada ante el SAT",
  "Cuenta bancaria en México para recibir pagos",
  "Fotografías de calidad de los productos a vender",
  "Capacidad para gestionar envíos en un plazo de 48 h",
];

export default function SellersPage() {
  return (
    <main className="pt-28 pb-20 min-h-screen">
      {/* Hero */}
      <section className="px-6 max-w-7xl mx-auto mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm text-indigo-400 font-medium mb-6 border border-indigo-500/20">
            <Store className="w-4 h-4" /> Programa de Vendedores
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            Convierte tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">merma en dinero</span>
          </h1>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Liquida tu inventario con defectos de empaque, obsolescencia o exceso de stock. Miles de compradores te esperan en Merma Marketplace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-indigo-500/20"
            >
              Comenzar a vender <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#como-funciona"
              className="px-8 py-4 glass hover:bg-white/5 text-white rounded-2xl font-bold transition-all"
            >
              Cómo funciona
            </a>
          </div>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20"
        >
          {[
            { label: "Vendedores activos", value: "45+" },
            { label: "Productos listados", value: "1,200+" },
            { label: "Ahorro generado", value: "$42K" },
            { label: "Compradores registrados", value: "8,000+" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-2xl p-6 text-center border border-white/5">
              <p className="text-3xl font-black text-white mb-1">{s.value}</p>
              <p className="text-sm text-slate-400">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Benefits */}
      <section className="px-6 max-w-7xl mx-auto mb-24">
        <h2 className="text-3xl font-black text-white mb-3 text-center">Por qué vender en Merma</h2>
        <p className="text-slate-400 text-center mb-12">Todo lo que necesitas para liquidar tu inventario con dignidad.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b) => (
            <motion.div
              key={b.title}
              whileHover={{ y: -4 }}
              className="glass p-6 rounded-2xl border border-white/5"
            >
              <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4">
                <b.icon className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="font-bold text-white mb-2">{b.title}</h3>
              <p className="text-sm text-slate-400">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="px-6 max-w-7xl mx-auto mb-24">
        <h2 className="text-3xl font-black text-white mb-3 text-center">Cómo funciona</h2>
        <p className="text-slate-400 text-center mb-12">Tres pasos para empezar a vender.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <div key={s.num} className="relative">
              <div className="glass p-8 rounded-2xl border border-white/5 h-full">
                <span className="text-6xl font-black text-indigo-500/20">{s.num}</span>
                <h3 className="text-xl font-bold text-white mt-2 mb-3">{s.title}</h3>
                <p className="text-slate-400 text-sm">{s.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 text-slate-600 z-10">
                  <ArrowRight className="w-8 h-8" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Requirements */}
      <section className="px-6 max-w-7xl mx-auto mb-24">
        <div className="glass rounded-3xl p-10 border border-white/5 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-8 h-8 text-indigo-400" />
            <h2 className="text-2xl font-black text-white">Requisitos para vender</h2>
          </div>
          <ul className="space-y-4">
            {requirements.map((req) => (
              <li key={req} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300 text-sm">{req}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="relative glass rounded-3xl p-12 text-center border border-indigo-500/20 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 -z-0" />
          <div className="relative z-10">
            <h2 className="text-4xl font-black text-white mb-4">¿Listo para empezar?</h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              Únete a los vendedores que ya están convirtiendo su merma en ingresos reales.
            </p>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all active:scale-95 shadow-xl shadow-indigo-500/25"
            >
              Crear cuenta de vendedor <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
