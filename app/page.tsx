"use client";

import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import QRCode from "qrcode";

type Mode = "scan" | "create";

function classify(value: string) {
  if (/^https?:\/\//i.test(value)) return { label: "Lien web", icon: "↗" };
  if (/^WIFI:/i.test(value)) return { label: "Réseau Wi-Fi", icon: "⌁" };
  if (/^mailto:/i.test(value)) return { label: "E-mail", icon: "@" };
  if (/^tel:/i.test(value)) return { label: "Téléphone", icon: "☎" };
  return { label: "Texte", icon: "T" };
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("scan");
  const [result, setResult] = useState("");
  const [status, setStatus] = useState("Prêt à scanner");
  const [cameraOn, setCameraOn] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const [text, setText] = useState("https://");
  const [qrImage, setQrImage] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef<number | null>(null);

  const stopCamera = () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraOn(false);
  };

  useEffect(() => () => stopCamera(), []);

  const decodeCanvas = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return false;
    const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(image.data, image.width, image.height, {
      inversionAttempts: "attemptBoth",
    });
    if (!code) return false;
    setResult(code.data);
    setStatus("QR code décodé");
    stopCamera();
    return true;
  };

  const scanFrame = () => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) {
      frameRef.current = requestAnimationFrame(scanFrame);
      return;
    }
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    if (!decodeCanvas(canvas)) frameRef.current = requestAnimationFrame(scanFrame);
  };

  const startCamera = async () => {
    try {
      setStatus("Autorisation de la caméra…");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      setCameraOn(true);
      setStatus("Place le QR dans le cadre");
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().then(scanFrame);
        }
      });
    } catch {
      setStatus("Caméra indisponible — essaie avec une image");
    }
  };

  const readFile = (file?: File) => {
    if (!file || !file.type.startsWith("image/")) {
      setStatus("Choisis une image PNG, JPG ou WEBP");
      return;
    }
    const image = new Image();
    image.onload = () => {
      const max = 1800;
      const scale = Math.min(1, max / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);
      if (!decodeCanvas(canvas)) setStatus("Aucun QR code trouvé dans cette image");
      URL.revokeObjectURL(image.src);
    };
    image.src = URL.createObjectURL(file);
    setStatus("Analyse de l’image…");
  };

  const generate = async () => {
    if (!text.trim()) return;
    setQrImage(
      await QRCode.toDataURL(text.trim(), {
        width: 720,
        margin: 2,
        errorCorrectionLevel: "H",
        color: { dark: "#0b1020", light: "#ffffff" },
      }),
    );
  };

  const copy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  const info = classify(result);

  return (
    <main>
      <nav className="nav">
        <a className="brand" href="#" aria-label="Qrio accueil">
          <span className="brandMark" aria-hidden="true"><i /><i /><i /></span>
          <span>Qrio</span>
        </a>
        <span className="privacy"><i /> 100% local &amp; privé</span>
      </nav>

      <section className="hero">
        <p className="eyebrow"><span>✦</span> LE QR, SANS FRICTION</p>
        <h1>Scanne. Décode.<br /><em>C’est fait.</em></h1>
        <p className="lede">Lis n’importe quel QR code en une seconde — depuis ta caméra ou une image. Rien ne quitte ton appareil.</p>
      </section>

      <section className="workspace">
        <div className="tabs" role="tablist">
          <button className={mode === "scan" ? "active" : ""} onClick={() => setMode("scan")}>⌗ Scanner</button>
          <button className={mode === "create" ? "active" : ""} onClick={() => { stopCamera(); setMode("create"); }}>＋ Créer</button>
        </div>

        {mode === "scan" ? (
          <div className="scanGrid">
            <div className="scanner">
              <div className={`viewport ${cameraOn ? "live" : ""}`}>
                <video ref={videoRef} muted playsInline />
                <div className="scanCorners"><i /><i /><i /><i /></div>
                {!cameraOn && (
                  <div className="cameraPrompt">
                    <span className="cameraIcon">⌾</span>
                    <strong>Scanner avec la caméra</strong>
                    <small>Rapide, sécurisé, instantané</small>
                    <button onClick={startCamera}>Activer la caméra <b>→</b></button>
                  </div>
                )}
                {cameraOn && <button className="stop" onClick={stopCamera}>Arrêter</button>}
              </div>

              <div className="or"><span /> ou <span /></div>

              <button
                className={`dropzone ${dragging ? "dragging" : ""}`}
                onClick={() => fileRef.current?.click()}
                onDragOver={(e: DragEvent) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e: DragEvent) => { e.preventDefault(); setDragging(false); readFile(e.dataTransfer.files[0]); }}
              >
                <span>⇧</span>
                <strong>Dépose une image ici</strong>
                <small>ou clique pour parcourir · PNG, JPG, WEBP</small>
              </button>
              <input ref={fileRef} hidden type="file" accept="image/*" onChange={(e: ChangeEvent<HTMLInputElement>) => readFile(e.target.files?.[0])} />
              <p className="status">{status}</p>
            </div>

            <aside className={`result ${result ? "hasResult" : ""}`}>
              <div className="resultTitle"><span>Résultat</span>{result && <button onClick={() => setResult("")}>Effacer</button>}</div>
              {!result ? (
                <div className="empty">
                  <div className="emptyQr"><i /><i /><i /></div>
                  <strong>En attente d’un QR</strong>
                  <p>Le contenu décodé apparaîtra ici, prêt à être copié ou ouvert.</p>
                </div>
              ) : (
                <div className="decoded">
                  <div className="type"><span>{info.icon}</span><div><small>TYPE DÉTECTÉ</small><strong>{info.label}</strong></div></div>
                  <div className="payload">{result}</div>
                  <div className="actions">
                    <button onClick={copy}>{copied ? "✓ Copié" : "□ Copier"}</button>
                    {/^https?:\/\//i.test(result) && <a href={result} target="_blank" rel="noopener noreferrer">Ouvrir ↗</a>}
                  </div>
                  <p className="safe">✓ Décodé localement sur ton appareil</p>
                </div>
              )}
            </aside>
          </div>
        ) : (
          <div className="creator">
            <div className="createForm">
              <label htmlFor="qrText">Contenu du QR code</label>
              <textarea id="qrText" value={text} onChange={(e) => setText(e.target.value)} placeholder="Lien, texte, e-mail, numéro…" />
              <div className="quickTypes">
                <button onClick={() => setText("https://")}>Lien</button>
                <button onClick={() => setText("WIFI:T:WPA;S:NomDuWifi;P:MotDePasse;;")}>Wi-Fi</button>
                <button onClick={() => setText("mailto:bonjour@exemple.com")}>E-mail</button>
                <button onClick={() => setText("tel:+32")}>Téléphone</button>
              </div>
              <button className="generate" onClick={generate}>Générer le QR <b>→</b></button>
            </div>
            <div className="qrPreview">
              {qrImage ? (
                <>
                  <img src={qrImage} alt="QR code généré" />
                  <a href={qrImage} download="mon-qr-code.png">Télécharger en PNG ↓</a>
                </>
              ) : (
                <div className="empty">
                  <div className="emptyQr"><i /><i /><i /></div>
                  <strong>Ton QR apparaîtra ici</strong>
                  <p>Il sera généré localement, en haute définition.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      <footer><span>Qrio — simple, rapide, privé.</span><span>Aucune donnée collectée · Aucun compte</span></footer>
    </main>
  );
}
