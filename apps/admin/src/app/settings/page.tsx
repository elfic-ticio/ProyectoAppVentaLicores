"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Globe, CreditCard, Bell, Shield, AlertCircle } from "lucide-react";
import AdminLayout from "@/components/admin-layout";
import { cn } from "@/lib/utils";

type Tab = "general" | "payments" | "notifications" | "security";

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "general", label: "General", icon: Globe },
  { id: "payments", label: "Pagos", icon: CreditCard },
  { id: "notifications", label: "Notificaciones", icon: Bell },
  { id: "security", label: "Seguridad", icon: Shield },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold text-white">Ajustes</h1>
          <p className="text-slate-500 text-sm mt-1">Configuración general de la plataforma</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 bg-slate-900 rounded-2xl p-1 border border-white/5 w-fit">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all",
                activeTab === t.id
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-white"
              )}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* General */}
        {activeTab === "general" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <SettingsCard title="Información del marketplace">
              <SettingsField label="Nombre de la plataforma" defaultValue="Merma Marketplace" />
              <SettingsField label="URL del sitio" defaultValue="https://project-m3ygs.vercel.app" />
              <SettingsField label="Correo de soporte" defaultValue="soporte@merma.mx" />
              <SettingsField label="Teléfono de contacto" defaultValue="+52 55 1234 5678" />
            </SettingsCard>

            <SettingsCard title="Configuración de comisiones">
              <SettingsField label="Comisión por venta (%)" defaultValue="8" type="number" />
              <SettingsField label="Comisión vendedores Gold (%)" defaultValue="5" type="number" />
              <SettingsField label="Comisión vendedores Silver (%)" defaultValue="6.5" type="number" />
            </SettingsCard>
          </motion.div>
        )}

        {/* Payments */}
        {activeTab === "payments" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-amber-200 text-sm">
                Las claves de pago son sensibles. Nunca las compartas. Usa claves de <strong>prueba</strong> en desarrollo.
              </p>
            </div>
            <SettingsCard title="Stripe">
              <SettingsField label="Publishable Key" defaultValue="pk_test_••••••••••••••••" secret />
              <SettingsField label="Secret Key" defaultValue="sk_test_••••••••••••••••" secret />
              <SettingsField label="Webhook Secret" defaultValue="whsec_••••••••••••••••" secret />
            </SettingsCard>
            <SettingsCard title="Conekta (OXXO / SPEI)">
              <SettingsField label="API Key Pública" defaultValue="key_eXj••••••••••••••" secret />
              <SettingsField label="API Key Privada" defaultValue="key_priv_••••••••••••" secret />
            </SettingsCard>
          </motion.div>
        )}

        {/* Notifications */}
        {activeTab === "notifications" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <SettingsCard title="Notificaciones por correo">
              <ToggleField label="Nuevo pedido" description="Notificar al equipo cuando llegue un nuevo pedido" defaultChecked />
              <ToggleField label="Pedido completado" description="Cuando el cliente confirme la entrega" defaultChecked />
              <ToggleField label="Nuevo vendedor" description="Cuando un nuevo vendedor se registre" defaultChecked />
              <ToggleField label="Stock crítico" description="Cuando un producto tenga menos de 5 unidades" />
            </SettingsCard>
            <SettingsCard title="Alertas del sistema">
              <ToggleField label="Errores de pago" description="Alertar cuando un pago falle" defaultChecked />
              <ToggleField label="Reportes diarios" description="Resumen diario de ventas a las 8:00 AM" />
            </SettingsCard>
          </motion.div>
        )}

        {/* Security */}
        {activeTab === "security" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <SettingsCard title="Autenticación">
              <ToggleField label="MFA obligatorio para admins" description="Requerir autenticación de dos factores para todos los administradores" defaultChecked />
              <ToggleField label="MFA obligatorio para vendedores" description="Requerir 2FA para cuentas de vendedor" defaultChecked />
              <SettingsField label="Expiración de sesión (minutos)" defaultValue="60" type="number" />
            </SettingsCard>
            <SettingsCard title="Auditoría">
              <ToggleField label="Log de acciones de admin" description="Registrar todas las acciones en el panel de administración" defaultChecked />
              <SettingsField label="Retención de logs (días)" defaultValue="90" type="number" />
            </SettingsCard>
          </motion.div>
        )}

        {/* Save button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all",
              saved
                ? "bg-emerald-600 text-white"
                : "bg-indigo-600 hover:bg-indigo-500 text-white"
            )}
          >
            <Save className="w-4 h-4" />
            {saved ? "¡Guardado!" : "Guardar cambios"}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}

function SettingsCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-slate-900 rounded-2xl border border-white/5 p-6 space-y-5">
      <h3 className="font-bold text-white text-sm">{title}</h3>
      {children}
    </div>
  );
}

function SettingsField({
  label, defaultValue, type = "text", secret = false,
}: {
  label: string; defaultValue: string; type?: string; secret?: boolean;
}) {
  const [show, setShow] = useState(!secret);
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-slate-400">{label}</label>
      <div className="relative">
        <input
          type={secret && !show ? "password" : type}
          defaultValue={defaultValue}
          className="w-full px-4 py-3 bg-slate-800 border border-white/5 rounded-xl text-sm text-white outline-none focus:border-indigo-500/50 transition-all"
        />
        {secret && (
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
          >
            {show ? "Ocultar" : "Mostrar"}
          </button>
        )}
      </div>
    </div>
  );
}

function ToggleField({ label, description, defaultChecked = false }: { label: string; description: string; defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => setChecked((v) => !v)}
        className={cn(
          "w-11 h-6 rounded-full transition-colors relative flex-shrink-0",
          checked ? "bg-indigo-600" : "bg-slate-700"
        )}
      >
        <span
          className={cn(
            "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </div>
  );
}
