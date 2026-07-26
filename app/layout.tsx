import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Qrio — Scanner et créer des QR codes",
  description: "Scanne, décode et crée des QR codes directement sur ton appareil. Rapide, gratuit et privé.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
