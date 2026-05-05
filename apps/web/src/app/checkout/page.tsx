"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Landmark, Store, User, Mail, Phone, MapPin, Lock, ShoppingBag, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";

type PaymentMethod = "card" | "oxxo" | "spei";
type Tab = "account" | "guest";

export default function CheckoutPage() {
  const { items, getTotal, getSavings, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [tab, setTab] = useState<Tab>(user ? "account" : "guest");
  const [payment, setPayment] = useState<PaymentMethod>("card");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const [form, setForm] = useState({
    name: (user as { name?: string })?.name ?? "",
    email: user?.email ?? "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    setLoading(false);
    setDone(true);
    clearCart();
  };

  if (items.length === 0 && !done) {
    return (
      <main className="pt-28 pb-20 min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-white mb-2">Tu carrito está vacío</h2>
          <p className="text-slate-400 mb-6">Agrega productos antes de continuar con el pago.</p>
          <Link href="/catalog" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all">
            Explorar catálogo
          </Link>
        </div>
      </main>
    );
  }

  if (done) {
    return (
      <main className="pt-28 pb-20 min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-3xl p-12 border border-emerald-500/20 text-center max-w-md w-full"
        >
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-black text-white mb-3">¡Pedido recibido!</h2>
          <p className="text-slate-400 mb-2">
            Te enviaremos la confirmación y número de rastreo a <strong className="text-white">{form.email}</strong>.
          </p>
          <p className="text-slate-500 text-sm mb-8">Tiempo estimado de entrega: 3-5 días hábiles.</p>
          <Link href="/catalog" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all block">
            Seguir comprando
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="pt-28 pb-20 min-h-screen px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/catalog" className="p-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-black text-white">Finalizar compra</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left — Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            {!user && (
              <div className="glass rounded-2xl p-1 flex border border-white/5">
                <button
                  onClick={() => setTab("guest")}
                  className={cn(
                    "flex-1 py-3 rounded-xl text-sm font-bold transition-all",
                    tab === "guest" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                  )}
                >
                  Comprar sin cuenta
                </button>
                <button
                  onClick={() => setTab("account")}
                  className={cn(
                    "flex-1 py-3 rounded-xl text-sm font-bold transition-all",
                    tab === "account" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                  )}
                >
                  Tengo cuenta
                </button>
              </div>
            )}

            {tab === "account" && !user && (
              <div className="glass rounded-2xl p-6 border border-white/5">
                <p className="text-slate-400 text-sm mb-4">
                  Al iniciar sesión, tus datos de envío y compras quedan guardados.
                </p>
                <Link
                  href={`/auth/login?redirect=/checkout`}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <User className="w-4 h-4" /> Iniciar sesión
                </Link>
                <p className="text-center text-slate-500 text-xs mt-3">
                  ¿No tienes cuenta?{" "}
                  <button onClick={() => setTab("guest")} className="text-indigo-400 font-bold">
                    Compra como invitado
                  </button>
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal data */}
              <div className="glass rounded-2xl p-6 border border-white/5">
                <h2 className="font-bold text-white mb-5 flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-400" /> Datos personales
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field icon={<User className="w-4 h-4" />} label="Nombre completo" value={form.name} onChange={set("name")} placeholder="Ana García" required />
                  <Field icon={<Mail className="w-4 h-4" />} label="Correo electrónico" type="email" value={form.email} onChange={set("email")} placeholder="ana@correo.com" required />
                  <Field icon={<Phone className="w-4 h-4" />} label="Teléfono" type="tel" value={form.phone} onChange={set("phone")} placeholder="55 1234 5678" required />
                </div>
              </div>

              {/* Shipping */}
              <div className="glass rounded-2xl p-6 border border-white/5">
                <h2 className="font-bold text-white mb-5 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-indigo-400" /> Dirección de envío
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Field icon={<MapPin className="w-4 h-4" />} label="Calle y número" value={form.street} onChange={set("street")} placeholder="Av. Insurgentes Sur 1602" required />
                  </div>
                  <Field icon={null} label="Ciudad" value={form.city} onChange={set("city")} placeholder="Ciudad de México" required />
                  <Field icon={null} label="Estado" value={form.state} onChange={set("state")} placeholder="CDMX" required />
                  <Field icon={null} label="Código postal" value={form.zip} onChange={set("zip")} placeholder="06600" required />
                </div>
              </div>

              {/* Payment */}
              <div className="glass rounded-2xl p-6 border border-white/5">
                <h2 className="font-bold text-white mb-5 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-indigo-400" /> Método de pago
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                  {(
                    [
                      { id: "card", label: "Tarjeta", icon: <CreditCard className="w-5 h-5" /> },
                      { id: "oxxo", label: "OXXO", icon: <Store className="w-5 h-5" /> },
                      { id: "spei", label: "SPEI", icon: <Landmark className="w-5 h-5" /> },
                    ] as const
                  ).map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPayment(m.id)}
                      className={cn(
                        "flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all border",
                        payment === m.id
                          ? "bg-indigo-600 border-indigo-500 text-white"
                          : "glass border-white/10 text-slate-400 hover:text-white"
                      )}
                    >
                      {m.icon} {m.label}
                    </button>
                  ))}
                </div>

                {payment === "card" && (
                  <div className="space-y-4">
                    <Field icon={<Lock className="w-4 h-4" />} label="Número de tarjeta" value="" onChange={() => {}} placeholder="1234 5678 9012 3456" />
                    <div className="grid grid-cols-2 gap-4">
                      <Field icon={null} label="Vencimiento" value="" onChange={() => {}} placeholder="MM/AA" />
                      <Field icon={<Lock className="w-4 h-4" />} label="CVV" value="" onChange={() => {}} placeholder="123" />
                    </div>
                  </div>
                )}
                {payment === "oxxo" && (
                  <div className="text-sm text-slate-400 glass rounded-xl p-4">
                    Recibirás una referencia de pago en tu correo. Tienes 24 h para pagar en cualquier OXXO.
                  </div>
                )}
                {payment === "spei" && (
                  <div className="text-sm text-slate-400 glass rounded-xl p-4">
                    Recibirás los datos bancarios CLABE en tu correo. El pedido se procesa en 1-2 h tras la transferencia.
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || (tab === "account" && !user)}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-indigo-500/20"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock className="w-5 h-5" /> Pagar ${getTotal().toLocaleString()} MXN
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right — Summary */}
          <div className="space-y-4">
            <div className="glass rounded-2xl p-6 border border-white/5 sticky top-28">
              <h2 className="font-bold text-white mb-5">Resumen del pedido</h2>
              <div className="space-y-4 max-h-64 overflow-y-auto mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex-shrink-0 overflow-hidden">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-sm text-white font-medium truncate">{item.title}</p>
                      <p className="text-xs text-slate-500">x{item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-white">${(item.salePrice * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3 border-t border-white/5 pt-4">
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Subtotal</span>
                  <span>${getTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-emerald-400 font-medium">
                  <span>Ahorro</span>
                  <span>-${getSavings().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Envío</span>
                  <span className="text-emerald-400">Gratis</span>
                </div>
                <div className="flex justify-between text-white font-black text-lg border-t border-white/5 pt-3">
                  <span>Total</span>
                  <span>${getTotal().toLocaleString()} MXN</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Field({
  icon, label, value, onChange, placeholder, type = "text", required = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-slate-400 ml-1">{label}</label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">{icon}</span>
        )}
        <input
          type={type}
          required={required}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={cn(
            "w-full py-3 glass rounded-xl border border-white/5 focus:border-indigo-500/50 outline-none transition-all text-sm text-white placeholder:text-slate-600",
            icon ? "pl-9 pr-4" : "px-4"
          )}
        />
      </div>
    </div>
  );
}
