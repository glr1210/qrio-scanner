import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Qrio Toolbox",
    short_name: "Qrio",
    description: "30 outils gratuits, locaux et privés.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f1e9",
    theme_color: "#7057e8",
    orientation: "portrait-primary",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcuts: [
      { name: "Scanner un QR", short_name: "Scanner", url: "/?outil=scan", icons: [{ src: "/icon-192.png", sizes: "192x192" }] },
      { name: "Créer un QR", short_name: "Créer", url: "/?outil=create", icons: [{ src: "/icon-192.png", sizes: "192x192" }] },
      { name: "Mot de passe", short_name: "Mot de passe", url: "/?outil=password", icons: [{ src: "/icon-192.png", sizes: "192x192" }] },
    ],
  };
}
