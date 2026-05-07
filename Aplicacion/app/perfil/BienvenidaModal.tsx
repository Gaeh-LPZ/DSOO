"use client";
import { useEffect, useRef, useState } from "react";

interface WelcomeModalProps {
  nombre: string;
  puntosReales: number;
  onFinish: () => void;
}

const SLOTS = [
  { n: "0", c: "#006400" }, { n: "32", c: "#c0392b" }, { n: "15", c: "#1a1a1a" }, { n: "19", c: "#c0392b" },
  { n: "4", c: "#1a1a1a" }, { n: "21", c: "#c0392b" }, { n: "2", c: "#1a1a1a" }, { n: "25", c: "#c0392b" },
  { n: "17", c: "#1a1a1a" }, { n: "34", c: "#c0392b" }, { n: "6", c: "#1a1a1a" }, { n: "27", c: "#c0392b" },
  { n: "13", c: "#1a1a1a" }, { n: "36", c: "#c0392b" }, { n: "11", c: "#1a1a1a" }, { n: "30", c: "#c0392b" },
  { n: "8", c: "#1a1a1a" }, { n: "23", c: "#c0392b" }, { n: "10", c: "#1a1a1a" }, { n: "100", c: "#c0392b" }, // Índice 19
  { n: "5", c: "#1a1a1a" }, { n: "24", c: "#c0392b" }, { n: "16", c: "#1a1a1a" }, { n: "33", c: "#c0392b" },
  { n: "1", c: "#1a1a1a" }, { n: "20", c: "#c0392b" }, { n: "14", c: "#1a1a1a" }, { n: "31", c: "#c0392b" },
  { n: "9", c: "#1a1a1a" }, { n: "22", c: "#c0392b" }, { n: "18", c: "#1a1a1a" }, { n: "29", c: "#c0392b" },
  { n: "7", c: "#1a1a1a" }, { n: "28", c: "#c0392b" }, { n: "12", c: "#1a1a1a" }, { n: "35", c: "#c0392b" },
  { n: "3", c: "#1a1a1a" }, { n: "26", c: "#c0392b" },
];

const WIN_IDX = 19;
const N = SLOTS.length;
const ARC = (2 * Math.PI) / N;
const CX = 150, CY = 150;

export default function WelcomeModal({ nombre, puntosReales, onFinish }: WelcomeModalProps) {
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<"idle" | "spinning" | "won">("idle");
  const [displayPts, setDisplayPts] = useState(0);
  const wheelRef = useRef<HTMLCanvasElement>(null);
  const ballRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);

  useEffect(() => {
    setVisible(true);
  }, []);

  useEffect(() => {
    if (visible) drawWheel(0);
  }, [visible]);

  function drawWheel(rotation: number) {
    const ctx = wheelRef.current?.getContext("2d");
    if (!ctx) return;
    const outerR = 145, trackR = 125, innerR = 92, numR = 110;
    ctx.clearRect(0, 0, 300, 300);

    // Marco exterior de la ruleta (Dorado/Bronce)
    ctx.beginPath(); ctx.arc(CX, CY, 148, 0, 2 * Math.PI);
    ctx.fillStyle = "#8a7055"; ctx.fill();
    ctx.strokeStyle = "#b8960c"; ctx.lineWidth = 3; ctx.stroke();

    SLOTS.forEach((slot, i) => {
      // El + rotation hace que gire
      const angle = rotation + (i * ARC);
      const start = angle - ARC / 2 - Math.PI / 2;
      const end = angle + ARC / 2 - Math.PI / 2;

      ctx.beginPath(); ctx.moveTo(CX, CY);
      ctx.arc(CX, CY, trackR, start, end); ctx.closePath();
      ctx.fillStyle = slot.c; ctx.fill();

      // Números bien centrados
      ctx.save();
      ctx.translate(CX, CY);
      ctx.rotate(angle);
      ctx.textAlign = "center";
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 9px Arial";
      ctx.fillText(slot.n, 0, -numR);
      ctx.restore();
    });

    // Centro de la ruleta (Café Madera)
    const grad = ctx.createRadialGradient(CX, CY, 0, CX, CY, innerR);
    grad.addColorStop(0, "#5a2d00");
    grad.addColorStop(1, "#2a1000");
    ctx.beginPath(); ctx.arc(CX, CY, innerR, 0, 2 * Math.PI);
    ctx.fillStyle = grad; ctx.fill();
    ctx.strokeStyle = "#b8960c"; ctx.lineWidth = 2; ctx.stroke();
  }

  function drawBall(angle: number, r: number) {
    const ctx = ballRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, 300, 300);
    const bx = CX + r * Math.cos(angle - Math.PI / 2);
    const by = CY + r * Math.sin(angle - Math.PI / 2);
    ctx.beginPath(); ctx.arc(bx, by, 6, 0, 2 * Math.PI);
    ctx.fillStyle = "#FFFFFF"; ctx.fill();
    ctx.shadowBlur = 5; ctx.shadowColor = "black";
  }

  function startSpin() {
    if (phase !== "idle") return;
    setPhase("spinning");

    const duration = 5000;
    const startTime = performance.now();

    // Vueltas completas + compensación para que el WIN_IDX quede en 0 radianes (arriba)
    const spins = 8 * 2 * Math.PI;
    const finalRotation = spins - (WIN_IDX * ARC);

    function animate(now: number) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3); // easeOutCubic

      const currentRotation = finalRotation * ease;
      rotationRef.current = currentRotation;
      drawWheel(currentRotation);

      // La bolita gira en sentido contrario y se acomoda
      const ballAngle = -(spins * 1.5 * (1 - ease));
      const ballRadius = 135 - (15 * t);
      drawBall(ballAngle, ballRadius);

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        setPhase("won");
        // Conteo de puntos
        let s = 0;
        const inv = setInterval(() => {
          s += Math.ceil(puntosReales / 20);
          if (s >= puntosReales) { setDisplayPts(puntosReales); clearInterval(inv); }
          else setDisplayPts(s);
        }, 40)
      }
    }
    requestAnimationFrame(animate);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* Contenedor*/}
      <div className="rounded-4xl p-8 max-w-sm w-full text-center shadow-2xl border-4 border-[#e6d5b8]"
        style={{ background: "#FDFBF7" }}>

        <p className="text-[10px] font-bold tracking-[0.3em] uppercase mb-1 text-[#8a7055]">
          Monedero Atelier
        </p>
        <h2 className="text-2xl font-bold mb-1 text-[#3d1f00]">
          ¡Bienvenido, {nombre.split(" ")[0]}!
        </h2>
        <p className="text-sm mb-6 text-[#5a2d00]">
          Lanza a la suerte y gana tus puntos
        </p>

        <div className="relative mx-auto mb-8" style={{ width: 300, height: 300 }}>
          <canvas ref={wheelRef} width={300} height={300} />
          <canvas ref={ballRef} width={300} height={300} className="absolute top-0 left-0 pointer-events-none" />
          {/* Marcador superior */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-2xl" style={{ zIndex: 30 }}>▼</div>
        </div>

        {phase === "idle" && (
          <button onClick={startSpin}
            className="w-full py-4 rounded-xl text-white font-bold transition-transform hover:scale-105 active:scale-95"
            style={{ background: "#b8960c" }}>
            Lanzar a la suerte
          </button>
        )}

        {phase === "won" && (
          <div className="animate-in zoom-in duration-500">
            <div className="bg-[#f5e6c8] rounded-2xl p-4 mb-4 border-2 border-[#b8960c]">
              <p className="text-xs uppercase text-[#8a7055]">Has ganado</p>
              <p className="text-5xl font-black text-[#3d1f00]">{displayPts}</p>
              <p className="text-xs text-[#b8960c]">puntos de regalo</p>
            </div>
            <button
              onClick={() => {
                setVisible(false);
                onFinish();
              }}
              className="w-full py-4 rounded-xl text-white font-bold transition-colors hover:bg-[#4ea386]"
              style={{ background: "#449678" }}
            >
              Reclamar puntos
            </button>
          </div>
        )}
      </div>
    </div>
  );
}