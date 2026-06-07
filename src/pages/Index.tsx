import { useState, useEffect } from "react";

const G = "'Goldman', cursive";

function useTimer(init: number) {
  const [t, setT] = useState(init);
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!on || t <= 0) return;
    const id = setTimeout(() => setT((v) => v - 1), 1000);
    return () => clearTimeout(id);
  }, [t, on]);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return {
    label: `${pad(Math.floor(t / 60))}:${pad(t % 60)}`,
    on,
    toggle: () => setOn((v) => !v),
    reset: (v = init) => { setT(v); setOn(false); },
  };
}

// Декоративная красная штора (SVG-кривая как у SoT)
function Curtain({ side }: { side: "left" | "right" }) {
  const flip = side === "right";
  return (
    <div
      className="absolute top-0 bottom-0 pointer-events-none"
      style={{
        width: 90,
        [side]: 0,
        zIndex: 10,
        transform: flip ? "scaleX(-1)" : "none",
      }}
    >
      {/* Fabric gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, #6b0a0a 0%, #8b1010 30%, #a01515 55%, #7a0e0e 75%, transparent 100%)",
          clipPath: "polygon(0 0, 85% 0, 100% 8%, 78% 22%, 88% 42%, 72% 58%, 82% 75%, 68% 88%, 80% 100%, 0 100%)",
        }}
      />
      {/* Dark edge shadow */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(90deg, rgba(0,0,0,0.5) 0%, transparent 60%)",
          clipPath: "polygon(0 0, 85% 0, 100% 8%, 78% 22%, 88% 42%, 72% 58%, 82% 75%, 68% 88%, 80% 100%, 0 100%)",
        }}
      />
      {/* Sheen lines */}
      {[15, 35, 55].map((x) => (
        <div
          key={x}
          className="absolute top-0 bottom-0"
          style={{
            left: `${x}%`,
            width: 1,
            background: "rgba(180,40,40,0.4)",
            clipPath: "polygon(0 0, 85% 0, 100% 8%, 78% 22%, 88% 42%, 72% 58%, 82% 75%, 68% 88%, 80% 100%, 0 100%)",
          }}
        />
      ))}
      {/* Gold top rail */}
      <div
        className="absolute top-0 left-0 right-0 h-3"
        style={{
          background: "linear-gradient(180deg, #C8A84B 0%, #8B6914 60%, transparent 100%)",
          opacity: 0.85,
        }}
      />
    </div>
  );
}

// Мини-виджет команды в левой панели (как в NAL)
function TeamPanel() {
  const teams = [
    { name: "Triumphant", tag: "TR", score: 23, color: "#4A9ECC", icon: "⚓" },
    { name: "Ordinary",   tag: "OR", score: 6,  color: "#888",    icon: "🐟" },
    { name: "GHG",        tag: "GH", score: 21, color: "#C8A84B", icon: "⚔️" },
    { name: "Reapers",    tag: "RE", score: 19, color: "#cc4a4a", icon: "💀" },
  ];
  return (
    <div
      className="absolute top-12 left-0 flex flex-col gap-1 z-20"
      style={{ width: 190 }}
    >
      {teams.map((t) => (
        <div
          key={t.tag}
          className="flex items-center gap-2 px-3 py-1.5"
          style={{
            background: "rgba(10,8,28,0.82)",
            borderLeft: `3px solid ${t.color}`,
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <span className="text-base shrink-0">{t.icon}</span>
          <span className="text-xs text-white/70 flex-1 truncate" style={{ fontFamily: G }}>{t.name}</span>
          <span className="text-sm font-bold" style={{ fontFamily: G, color: t.color }}>{t.score}</span>
        </div>
      ))}
    </div>
  );
}

export default function Index() {
  const { label, on, toggle, reset } = useTimer(14 * 60 + 14);
  const [scoreA, setScoreA] = useState(3);
  const [scoreB, setScoreB] = useState(1);
  const [game, setGame] = useState(4);

  const teamA = "LEAN ADDICTS";
  const teamB = "FEART ATTACK";
  const playerA = "SHADOW";
  const playerB = "MATT";

  return (
    <div
      className="h-screen flex flex-col overflow-hidden relative"
      style={{ background: "#100e1a", fontFamily: G }}
    >
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.25} }
        .blink { animation: blink 1.1s ease-in-out infinite; }
        @keyframes shimmer { 0%{opacity:.5} 50%{opacity:1} 100%{opacity:.5} }
        .shimmer { animation: shimmer 3s ease-in-out infinite; }
      `}</style>

      {/* ── TOP BAR — Notorious Arena League style ─────────── */}
      <div
        className="relative flex items-center shrink-0 z-30"
        style={{
          background: "linear-gradient(180deg, #0e0c1e 0%, #161228 100%)",
          borderBottom: "2px solid rgba(200,168,75,0.35)",
          height: 56,
        }}
      >
        {/* Left: logo + league name */}
        <div className="flex items-center gap-3 px-5" style={{ minWidth: 220 }}>
          <img
            src="https://cdn.poehali.dev/projects/fbb51ae0-9446-4f63-92bd-51fb48883890/bucket/d6f16c6a-393e-4630-9d49-2b5b26baf723.png"
            alt="logo"
            className="h-9 w-9 object-contain shimmer"
          />
          <div>
            <div className="text-[10px] text-white/35 uppercase tracking-[.3em]" style={{ fontFamily: G }}>
              Notorious Arena League
            </div>
            <div className="text-sm font-bold text-white leading-tight" style={{ fontFamily: G }}>
              EU · Sloopetition
            </div>
          </div>
        </div>

        {/* Gold divider */}
        <div className="h-8 w-px mx-2" style={{ background: "rgba(200,168,75,0.3)" }} />

        {/* Game indicator */}
        <div className="flex items-center gap-2 px-4">
          <span className="text-white/30 text-xs uppercase tracking-widest" style={{ fontFamily: G }}>Game</span>
          <div className="flex gap-1">
            {[1,2,3,4,5].map((n) => (
              <button
                key={n}
                onClick={() => setGame(n)}
                className="w-6 h-6 rounded text-xs font-bold transition-all"
                style={{
                  fontFamily: G,
                  background: game === n ? "#C8A84B" : "rgba(255,255,255,0.07)",
                  color:      game === n ? "#0e0c1e" : "rgba(255,255,255,0.3)",
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Center: Team A — SCORE — Team B */}
        <div className="flex-1 flex items-center justify-center gap-0">
          {/* Team A */}
          <div
            className="flex items-center gap-3 px-6 py-2"
            style={{ borderRight: "1px solid rgba(255,255,255,0.08)" }}
          >
            <span className="text-base font-bold text-white tracking-widest uppercase" style={{ fontFamily: G }}>
              {teamA}
            </span>
            <div className="w-6 h-6 rounded-sm flex items-center justify-center text-sm"
              style={{ background: "rgba(74,127,212,0.2)", border: "1px solid rgba(74,127,212,0.4)" }}>
              ⚓
            </div>
          </div>

          {/* Score */}
          <div className="flex items-center gap-2 px-6">
            <button
              onClick={() => setScoreA((v) => v + 1)}
              onContextMenu={(e) => { e.preventDefault(); setScoreA((v) => Math.max(0, v - 1)); }}
              className="text-4xl font-bold text-white hover:opacity-60 transition-opacity"
              style={{ fontFamily: G, lineHeight: 1, textShadow: "0 0 20px rgba(74,127,212,0.6)" }}
            >
              {scoreA}
            </button>
            <span className="text-xl text-white/25 font-bold" style={{ fontFamily: G }}>·</span>
            <button
              onClick={() => setScoreB((v) => v + 1)}
              onContextMenu={(e) => { e.preventDefault(); setScoreB((v) => Math.max(0, v - 1)); }}
              className="text-4xl font-bold text-white hover:opacity-60 transition-opacity"
              style={{ fontFamily: G, lineHeight: 1, textShadow: "0 0 20px rgba(204,74,74,0.6)" }}
            >
              {scoreB}
            </button>
          </div>

          {/* Team B */}
          <div
            className="flex items-center gap-3 px-6 py-2"
            style={{ borderLeft: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="w-6 h-6 rounded-sm flex items-center justify-center text-sm"
              style={{ background: "rgba(204,74,74,0.2)", border: "1px solid rgba(204,74,74,0.4)" }}>
              🛡️
            </div>
            <span className="text-base font-bold text-white tracking-widest uppercase" style={{ fontFamily: G }}>
              {teamB}
            </span>
          </div>
        </div>

        {/* Right: timer + live */}
        <div className="flex items-center gap-4 px-5">
          <div className="flex flex-col items-end gap-0.5">
            <button
              onClick={toggle}
              className="text-xl font-bold tracking-widest hover:opacity-60 transition-opacity"
              style={{ fontFamily: G, color: on ? "#C8A84B" : "rgba(255,255,255,0.5)" }}
            >
              {label}
            </button>
            <button
              onClick={() => reset(14 * 60 + 14)}
              className="text-[9px] text-white/20 hover:text-white/50 transition-colors uppercase tracking-widest"
              style={{ fontFamily: G }}
            >
              ↺ reset
            </button>
          </div>

          <div className="h-8 w-px" style={{ background: "rgba(200,168,75,0.25)" }} />

          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold"
            style={{
              background: "rgba(200,40,40,0.15)",
              border: "1px solid rgba(200,40,40,0.45)",
              color: "#ff5555",
              fontFamily: G,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 blink" />
            LIVE
          </div>
        </div>
      </div>

      {/* ── MAIN AREA ─────────────────────────────────────── */}
      <div className="flex flex-1 relative overflow-hidden" style={{ minHeight: 0 }}>

        {/* Red curtains */}
        <Curtain side="left" />
        <Curtain side="right" />

        {/* Left team sidebar (NAL style) */}
        <TeamPanel />

        {/* ── STREAM A ─────────────────────────────────── */}
        <div
          className="relative flex-1 flex items-center justify-center"
          style={{
            background: "#0d0b18",
            borderRight: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {/* Scanlines */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg,rgba(0,0,0,0.22) 0px,rgba(0,0,0,0.22) 1px,transparent 1px,transparent 3px)",
            }}
          />
          {/* Vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)",
            }}
          />

          {/* Placeholder text */}
          <span className="text-xs uppercase tracking-[.5em] text-white/8" style={{ fontFamily: G }}>
            STREAM
          </span>

          {/* Top blue line */}
          <div
            className="absolute top-0 left-0 right-0 h-0.5"
            style={{ background: "linear-gradient(90deg, #4a7fd4 0%, transparent 60%)" }}
          />

          {/* Player name tag — SoT style banner */}
          <div
            className="absolute top-5 left-1/2 -translate-x-1/2 flex flex-col items-center"
            style={{ zIndex: 5 }}
          >
            <div
              className="px-8 py-1.5"
              style={{
                background: "rgba(18,14,36,0.88)",
                border: "1px solid rgba(200,168,75,0.3)",
                borderRadius: 2,
                backdropFilter: "blur(8px)",
              }}
            >
              <span className="text-base font-bold text-white tracking-[.2em] uppercase" style={{ fontFamily: G }}>
                {playerA}
              </span>
            </div>
            {/* Small gold underline accent */}
            <div className="h-px w-16 mt-0.5" style={{ background: "linear-gradient(90deg,transparent,#C8A84B,transparent)" }} />
          </div>

          {/* LIVE dot top-left */}
          <div className="absolute top-5 left-5 flex items-center gap-1.5 z-10">
            <span className="w-2 h-2 rounded-full bg-red-500 blink" />
            <span className="text-[10px] text-white/35 uppercase tracking-widest" style={{ fontFamily: G }}>live</span>
          </div>

          {/* Team label bottom-left */}
          <div
            className="absolute bottom-5 left-5 flex items-center gap-2 z-10 px-3 py-1.5 rounded-sm"
            style={{ background: "rgba(10,8,28,0.75)", border: "1px solid rgba(74,127,212,0.3)" }}
          >
            <div className="w-2 h-2 rounded-full" style={{ background: "#4a7fd4" }} />
            <span className="text-xs text-white/70 uppercase tracking-widest" style={{ fontFamily: G }}>
              {teamA}
            </span>
          </div>
        </div>

        {/* ── STREAM B ─────────────────────────────────── */}
        <div
          className="relative flex-1 flex items-center justify-center"
          style={{ background: "#0d0b18" }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg,rgba(0,0,0,0.22) 0px,rgba(0,0,0,0.22) 1px,transparent 1px,transparent 3px)",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)",
            }}
          />

          <span className="text-xs uppercase tracking-[.5em] text-white/8" style={{ fontFamily: G }}>
            STREAM
          </span>

          {/* Top red line */}
          <div
            className="absolute top-0 left-0 right-0 h-0.5"
            style={{ background: "linear-gradient(90deg, transparent 40%, #cc4a4a 100%)" }}
          />

          <div
            className="absolute top-5 left-1/2 -translate-x-1/2 flex flex-col items-center"
            style={{ zIndex: 5 }}
          >
            <div
              className="px-8 py-1.5"
              style={{
                background: "rgba(18,14,36,0.88)",
                border: "1px solid rgba(200,168,75,0.3)",
                borderRadius: 2,
                backdropFilter: "blur(8px)",
              }}
            >
              <span className="text-base font-bold text-white tracking-[.2em] uppercase" style={{ fontFamily: G }}>
                {playerB}
              </span>
            </div>
            <div className="h-px w-16 mt-0.5" style={{ background: "linear-gradient(90deg,transparent,#C8A84B,transparent)" }} />
          </div>

          <div className="absolute top-5 left-5 flex items-center gap-1.5 z-10">
            <span className="w-2 h-2 rounded-full bg-red-500 blink" />
            <span className="text-[10px] text-white/35 uppercase tracking-widest" style={{ fontFamily: G }}>live</span>
          </div>

          {/* Team label bottom-right */}
          <div
            className="absolute bottom-5 right-5 flex items-center gap-2 z-10 px-3 py-1.5 rounded-sm"
            style={{ background: "rgba(10,8,28,0.75)", border: "1px solid rgba(204,74,74,0.3)" }}
          >
            <div className="w-2 h-2 rounded-full" style={{ background: "#cc4a4a" }} />
            <span className="text-xs text-white/70 uppercase tracking-widest" style={{ fontFamily: G }}>
              {teamB}
            </span>
          </div>
        </div>
      </div>

      {/* ── BOTTOM: webcams ─────────────────────────────── */}
      <div
        className="flex items-end shrink-0 relative z-20"
        style={{
          background: "linear-gradient(180deg, transparent 0%, rgba(10,8,22,0.95) 40%)",
          padding: "0 16px 16px",
          justifyContent: "space-between",
          pointerEvents: "none",
          height: 150,
          marginTop: -150,
        }}
      >
        {/* Webcam A */}
        <div
          className="relative rounded overflow-hidden"
          style={{
            width: 220,
            height: 130,
            background: "#08060f",
            border: "1px solid rgba(74,127,212,0.4)",
            boxShadow: "0 4px 32px rgba(74,127,212,0.15), 0 0 0 1px rgba(200,168,75,0.1)",
            pointerEvents: "all",
          }}
        >
          {/* placeholder */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.05]">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
            </svg>
          </div>
          {/* Gold top line */}
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "#C8A84B" }} />
          {/* Name */}
          <div
            className="absolute bottom-0 left-0 right-0 px-2 py-1.5 flex items-center gap-2"
            style={{ background: "rgba(8,6,20,0.85)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 blink" />
            <span className="text-[10px] text-white/60 uppercase tracking-widest" style={{ fontFamily: G }}>
              {playerA}
            </span>
            <span className="text-[9px] ml-auto" style={{ color: "#4a7fd4", fontFamily: G }}>{teamA}</span>
          </div>
        </div>

        {/* Logo center bottom */}
        <div className="flex flex-col items-center gap-1 opacity-40 pointer-events-none">
          <img
            src="https://cdn.poehali.dev/projects/fbb51ae0-9446-4f63-92bd-51fb48883890/bucket/d6f16c6a-393e-4630-9d49-2b5b26baf723.png"
            alt="logo"
            className="h-10 w-10 object-contain"
          />
          <span className="text-[9px] text-white/30 uppercase tracking-widest" style={{ fontFamily: G }}>
            NAL · EU
          </span>
        </div>

        {/* Webcam B */}
        <div
          className="relative rounded overflow-hidden"
          style={{
            width: 220,
            height: 130,
            background: "#08060f",
            border: "1px solid rgba(204,74,74,0.4)",
            boxShadow: "0 4px 32px rgba(204,74,74,0.15), 0 0 0 1px rgba(200,168,75,0.1)",
            pointerEvents: "all",
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.05]">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
            </svg>
          </div>
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "#C8A84B" }} />
          <div
            className="absolute bottom-0 left-0 right-0 px-2 py-1.5 flex items-center gap-2"
            style={{ background: "rgba(8,6,20,0.85)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 blink" />
            <span className="text-[10px] text-white/60 uppercase tracking-widest" style={{ fontFamily: G }}>
              {playerB}
            </span>
            <span className="text-[9px] ml-auto" style={{ color: "#cc4a4a", fontFamily: G }}>{teamB}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
