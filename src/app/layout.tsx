import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Comfort Mebel — Anonim Taklif va E'tirozlar",
  description: "Mebel ustalari va xaridorlar uchun anonim fikr-mulohaza platformasi",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className="h-full">
      <body className="min-h-full bg-slate-950 text-slate-100 font-sans antialiased selection:bg-amber-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
