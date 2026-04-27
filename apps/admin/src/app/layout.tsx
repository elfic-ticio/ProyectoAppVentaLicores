import type { Metadata } from "next";
import "./globals.css";
import AdminLayout from "@/components/admin-layout";

export const metadata: Metadata = {
  title: "Admin Panel | Merma Marketplace",
  description: "Panel de administración para Merma Marketplace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        <AdminLayout>{children}</AdminLayout>
      </body>
    </html>
  );
}
