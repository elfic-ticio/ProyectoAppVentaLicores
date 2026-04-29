import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Merma Marketplace | Productos Premium con Defectos Menores",
  description: "El primer marketplace en México dedicado a la merma retail. Encuentra productos de alta gama a precios increíbles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased bg-background bg-gradient-mesh min-h-screen text-foreground">
        <Providers>
          <Toaster position="top-right" richColors theme="dark" />
          <Navbar />
          <CartDrawer />
          {children}
        </Providers>
      </body>
    </html>
  );
}
