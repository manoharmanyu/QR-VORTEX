import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QRShield — 3D Cybersecurity & Quishing Defense Platform",
  description:
    "QRShield detects, analyzes, and neutralizes QR phishing (Quishing) destinations before users connect. Premium 3D cyber threat intelligence matrix.",
  keywords: [
    "QR Phishing",
    "Quishing",
    "Cybersecurity",
    "Threat Intelligence",
    "QR Code Scanner",
    "Zero Trust",
    "SOC",
  ],
  authors: [{ name: "QRShield Security Labs" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#020617",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-cyber-950 text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
