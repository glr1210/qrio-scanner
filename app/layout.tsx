import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://tgappstudio.com"),
  title: "Qrio Toolbox — 20 outils gratuits et privés",
  description: "QR codes, sécurité, images, outils développeur et calculs rapides. Gratuit, sans compte et directement dans ton navigateur.",
  openGraph: {
    title: "Qrio Toolbox",
    description: "20 outils. 100% local & privé.",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Qrio Toolbox",
    description: "20 outils. 100% local & privé.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
