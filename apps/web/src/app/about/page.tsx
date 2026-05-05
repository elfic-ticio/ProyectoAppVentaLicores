"use client";

import { motion } from "framer-motion";
import { Heart, Eye, Shield, Leaf, Mail, MapPin, Phone } from "lucide-react";

const values = [
  { icon: Eye, title: "Transparencia", desc: "Cada grado de condición está claramente definido. Sin sorpresas, sin engaños." },
  { icon: Shield, title: "Confianza", desc: "Verificamos a cada vendedor y garantizamos la autenticidad de todos los productos." },
  { icon: Heart, title: "Impacto social", desc: "Reducimos el desperdicio retail en México y hacemos accesible el consumo de calidad." },
  { icon: Leaf, title: "Sustentabilidad", desc: "Extender el ciclo de vida de productos que de otro modo irían al relleno sanitario." },
];

const team = [
  { name: "Ana García", role: "CEO & Co-fundadora", initials: "AG" },
  { name: "Carlos López", role: "CTO", initials: "CL" },
  { name: "María Torres", role: "Directora de Operaciones", initials: "MT" },
  { name: "Roberto Núñez", role: "Head of Growth", initials: "RN" },
];

export default function AboutPage() {
  return (
    <main className="pt-28 pb-20 min-h-screen">
      {/* Hero */}
      <section className="px-6 max-w-7xl mx-auto mb-24 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm text-purple-400 font-medium mb-6 border border-purple-500/20">
            <Heart className="w-4 h-4" /> Nuestra historia
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            Nacimos para{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
              no desperdiciar
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            En México, millones de pesos en productos de calidad se pierden cada año por defectos de empaque, obsolescencia
            o exceso de inventario. Merma Marketplace existe para cambiar eso.
          </p>
        </motion.div>
      </section>

      {/* Mission */}
      <section className="px-6 max-w-7xl mx-auto mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}>
            <h2 className="text-3xl font-black text-white mb-6">Nuestra misión</h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              Conectar a compradores que buscan calidad a precios accesibles con retailers que necesitan liquidar su
              inventario de merma de forma digna y eficiente.
            </p>
            <p className="text-slate-400 leading-relaxed">
              No somos una tienda de segunda mano. Somos un marketplace especializado en productos <strong className="text-white">nuevos</strong> que
              por alguna razón menor —empaque dañado, modelo descontinuado, exceso de stock— no llegan a los anaqueles
              tradicionales.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="glass rounded-3xl p-8 border border-white/5"
          >
            <div className="space-y-6">
              {[
                { label: "Productos salvados del desperdicio", value: "12,400+" },
                { label: "Ahorro total generado a compradores", value: "$2.1M MXN" },
                { label: "Toneladas de residuos evitadas", value: "18 ton" },
                { label: "Familias beneficiadas", value: "8,000+" },
              ].map((s) => (
                <div key={s.label} className="flex justify-between items-center border-b border-white/5 pb-4 last:border-0 last:pb-0">
                  <span className="text-sm text-slate-400">{s.label}</span>
                  <span className="text-lg font-black text-white">{s.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="px-6 max-w-7xl mx-auto mb-24">
        <h2 className="text-3xl font-black text-white mb-3 text-center">Nuestros valores</h2>
        <p className="text-slate-400 text-center mb-12">Los principios que guían cada decisión en Merma.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v) => (
            <motion.div
              key={v.title}
              whileHover={{ y: -4 }}
              className="glass p-6 rounded-2xl border border-white/5"
            >
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
                <v.icon className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-bold text-white mb-2">{v.title}</h3>
              <p className="text-sm text-slate-400">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="px-6 max-w-7xl mx-auto mb-24">
        <h2 className="text-3xl font-black text-white mb-3 text-center">El equipo</h2>
        <p className="text-slate-400 text-center mb-12">Las personas detrás de Merma Marketplace.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {team.map((member) => (
            <motion.div
              key={member.name}
              whileHover={{ y: -4 }}
              className="glass rounded-2xl p-6 text-center border border-white/5"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-black text-lg">{member.initials}</span>
              </div>
              <p className="font-bold text-white text-sm">{member.name}</p>
              <p className="text-xs text-slate-500 mt-1">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="px-6 max-w-7xl mx-auto">
        <div className="glass rounded-3xl p-10 border border-white/5 max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-black text-white mb-2">¿Tienes alguna pregunta?</h2>
          <p className="text-slate-400 mb-8">Estamos aquí para ayudarte.</p>
          <div className="space-y-4 text-left max-w-sm mx-auto">
            <a href="mailto:hola@merma.mx" className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors">
              <Mail className="w-5 h-5 text-indigo-400 flex-shrink-0" />
              hola@merma.mx
            </a>
            <a href="tel:+525512345678" className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors">
              <Phone className="w-5 h-5 text-indigo-400 flex-shrink-0" />
              +52 55 1234 5678
            </a>
            <div className="flex items-center gap-3 text-slate-300">
              <MapPin className="w-5 h-5 text-indigo-400 flex-shrink-0" />
              CDMX, México
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
