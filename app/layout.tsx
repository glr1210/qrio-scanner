import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://tgappstudio.com"),
  title: "Qrio Toolbox — 31 outils gratuits et privés",
  description: "QR codes, documents, sécurité, images, outils professionnels et calculs rapides. Gratuit, sans compte et directement dans ton navigateur.",
  openGraph: {
    title: "Qrio Toolbox",
    description: "31 outils. 100% local & privé.",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Qrio Toolbox",
    description: "31 outils. 100% local & privé.",
    images: ["/og.png"],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Qrio", statusBarStyle: "black-translucent" },
  icons: {
    icon: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f1e9" },
    { media: "(prefers-color-scheme: dark)", color: "#11131d" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
