"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, Trash2, ShoppingCart, Info, AlertCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";

const typeIcons: Record<string, any> = {
  ORDER_CREATED: ShoppingCart,
  PAYMENT_SUCCESS: Check,
  SYSTEM_ALERT: AlertCircle,
  PROMOTION: Info,
};

const typeColors: Record<string, string> = {
  ORDER_CREATED: "text-indigo-400 bg-indigo-500/10",
  PAYMENT_SUCCESS: "text-emerald-400 bg-emerald-500/10",
  SYSTEM_ALERT: "text-rose-400 bg-rose-500/10",
  PROMOTION: "text-cyan-400 bg-cyan-500/10",
};

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => apiFetch<any[]>("/notifications", {
      headers: { Authorization: `Bearer ${token}` }
    }),
    enabled: !!token,
    refetchInterval: 60000, // Refresh every minute
  });

  const markAsRead = useMutation({
    mutationFn: (id: string) => apiFetch(`/notifications/${id}/read`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` }
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const unreadCount = notifications?.filter(n => !n.is_read).length || 0;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-slate-400 hover:text-white transition-colors relative"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-4 w-80 glass border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Notificaciones</h3>
                <span className="text-[10px] text-slate-500 uppercase font-black">{unreadCount} nuevas</span>
              </div>

              <div className="max-h-96 overflow-y-auto no-scrollbar">
                {isLoading ? (
                  <div className="p-8 text-center text-slate-500 text-sm">Cargando...</div>
                ) : notifications?.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-sm">No tienes notificaciones</div>
                ) : (
                  notifications?.map((n) => {
                    const Icon = typeIcons[n.type] || Info;
                    return (
                      <div 
                        key={n.id} 
                        onClick={() => !n.is_read && markAsRead.mutate(n.id)}
                        className={cn(
                          "p-4 flex gap-4 transition-colors cursor-pointer border-b border-white/5",
                          n.is_read ? "opacity-60" : "bg-white/[0.02] hover:bg-white/[0.04]"
                        )}
                      >
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", typeColors[n.type])}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-grow">
                          <h4 className="text-xs font-bold text-white mb-1">{n.title}</h4>
                          <p className="text-[11px] text-slate-400 leading-relaxed mb-2">{n.message}</p>
                          <span className="text-[9px] text-slate-600 font-medium">Hace un momento</span>
                        </div>
                        {!n.is_read && <div className="w-2 h-2 bg-indigo-500 rounded-full mt-1 flex-shrink-0" />}
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
