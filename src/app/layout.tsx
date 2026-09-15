import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Comfort Textile — Anonim Taklif va E'tirozlar",
  description: "Comfort Textile: mebel matolari, porolon va sifatli furnituralar bo'yicha anonim fikr-mulohaza markazi",
  icons: {
    icon: "/brand-logo.png?v=7",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1d3b8a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className="h-full">
      <body className="min-h-full bg-slate-950 text-slate-100 font-sans antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
