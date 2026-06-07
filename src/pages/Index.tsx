import { useState, useEffect } from "react";

function useTimer(init: number) {
  const [t, setT] = useState(init);
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!on || t <= 0) return;
    const id = setTimeout(() => setT((v) => v - 1), 1000);
    return () => clearTimeout(id);
  }, [t, on]);
  const pad = (n: number) => n.toString().padStart(2, "0");
  const label = `${pad(Math.floor(t / 60))}:${pad(t % 60)}`;
  return {
    label,
    on,
    toggle: () => setOn((v) => !v),
    reset: (v = init) => { setT(v); setOn(false); },
  };
}

const G = "'Goldman', cursive";

export default function Index() {
  const { label, on, toggle, reset } = useTimer(14 * 60 + 14);
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const teamA = "LEAN ADDICTS";
  const teamB = "FEART ATTACK";

  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{ background: "#1c1828", fontFamily: G, userSelect: "none" }}
    >
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
        .blink { animation: blink 1.2s ease-in-out infinite; }
      `}</style>

      {/* ── TOP: team names + timer ───────────────────────── */}
      <div
        className="grid shrink-0"
        style={{
          gridTemplateColumns: "1fr auto 1fr",
          background: "#221e30",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Team A */}
        <div
          className="flex items-center px-8 py-4"
          style={{ borderBottom: "3px solid #4a7fd4" }}
        >
          <span
            className="text-2xl font-bold text-white tracking-widest uppercase"
            style={{ fontFamily: G }}
          >
            {teamA}
          </span>
        </div>

        {/* Center: score + timer */}
        <div
          className="flex flex-col items-center justify-center px-10 py-3 gap-1"
          style={{ borderBottom: "3px solid transparent" }}
        >
          {/* Score */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setScoreA((v) => v + 1)}
              onContextMenu={(e) => { e.preventDefault(); setScoreA((v) => Math.max(0, v - 1)); }}
              className="text-5xl font-bold text-white hover:opacity-60 transition-opacity"
              style={{ fontFamily: G, lineHeight: 1 }}
            >
              {scoreA}
            </button>
            <span className="text-3xl text-white/20 font-bold" style={{ fontFamily: G }}>—</span>
            <button
              onClick={() => setScoreB((v) => v + 1)}
              onContextMenu={(e) => { e.preventDefault(); setScoreB((v) => Math.max(0, v - 1)); }}
              className="text-5xl font-bold text-white hover:opacity-60 transition-opacity"
              style={{ fontFamily: G, lineHeight: 1 }}
            >
              {scoreB}
            </button>
          </div>

          {/* Timer */}
          <button
            onClick={toggle}
            className="text-lg tracking-widest transition-opacity hover:opacity-60"
            style={{
              fontFamily: G,
              color: on ? "#C8A84B" : "rgba(255,255,255,0.35)",
            }}
            title="клик — пауза/старт"
          >
            {label}
          </button>

          {/* Reset */}
          <button
            onClick={() => reset(14 * 60 + 14)}
            className="text-[9px] uppercase tracking-widest text-white/20 hover:text-white/50 transition-colors"
            style={{ fontFamily: G }}
          >
            ↺ reset
          </button>
        </div>

        {/* Team B */}
        <div
          className="flex items-center justify-end px-8 py-4"
          style={{ borderBottom: "3px solid #cc4a4a" }}
        >
          <span
            className="text-2xl font-bold text-white tracking-widest uppercase"
            style={{ fontFamily: G }}
          >
            {teamB}
          </span>
        </div>
      </div>

      {/* ── MAIN: two streams side by side ───────────────── */}
      <div className="flex flex-1 overflow-hidden" style={{ minHeight: 0 }}>

        {/* Stream A */}
        <div
          className="relative flex-1 flex items-center justify-center"
          style={{ background: "#15121f", borderRight: "1px solid rgba(255,255,255,0.06)" }}
        >
          {/* scanlines */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg,rgba(0,0,0,.18) 0px,rgba(0,0,0,.18) 1px,transparent 1px,transparent 3px)",
            }}
          />
          {/* placeholder label */}
          <span
            className="text-xs uppercase tracking-[.4em] text-white/10"
            style={{ fontFamily: G }}
          >
            STREAM A
          </span>
          {/* top accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-0.5"
            style={{ background: "linear-gradient(90deg,#4a7fd4,transparent)" }}
          />
          {/* player name tag — like SoT overlay */}
          <div
            className="absolute top-4 left-1/2 -translate-x-1/2 px-5 py-1 rounded-sm"
            style={{
              background: "rgba(30,25,50,0.75)",
              border: "1px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(6px)",
            }}
          >
            <span className="text-sm font-bold text-white tracking-widest uppercase" style={{ fontFamily: G }}>
              SHADOW
            </span>
          </div>
          {/* live dot */}
          <div className="absolute top-4 left-4 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 blink" />
            <span className="text-[10px] text-white/40 uppercase tracking-widest" style={{ fontFamily: G }}>live</span>
          </div>
        </div>

        {/* Stream B */}
        <div
          className="relative flex-1 flex items-center justify-center"
          style={{ background: "#15121f" }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg,rgba(0,0,0,.18) 0px,rgba(0,0,0,.18) 1px,transparent 1px,transparent 3px)",
            }}
          />
          <span
            className="text-xs uppercase tracking-[.4em] text-white/10"
            style={{ fontFamily: G }}
          >
            STREAM B
          </span>
          <div
            className="absolute top-0 left-0 right-0 h-0.5"
            style={{ background: "linear-gradient(90deg,transparent,#cc4a4a)" }}
          />
          <div
            className="absolute top-4 left-1/2 -translate-x-1/2 px-5 py-1 rounded-sm"
            style={{
              background: "rgba(30,25,50,0.75)",
              border: "1px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(6px)",
            }}
          >
            <span className="text-sm font-bold text-white tracking-widest uppercase" style={{ fontFamily: G }}>
              MATT
            </span>
          </div>
          <div className="absolute top-4 left-4 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 blink" />
            <span className="text-[10px] text-white/40 uppercase tracking-widest" style={{ fontFamily: G }}>live</span>
          </div>
        </div>
      </div>

      {/* ── BOTTOM: webcams ───────────────────────────────── */}
      <div
        className="grid shrink-0"
        style={{
          gridTemplateColumns: "1fr 1fr",
          background: "#1a1626",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          height: 160,
        }}
      >
        {/* Webcam A — bottom-left */}
        <div
          className="flex items-end gap-3 p-4"
          style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div
            className="relative rounded overflow-hidden shrink-0"
            style={{
              width: 200,
              height: 128,
              background: "#0f0c1a",
              border: "1px solid rgba(74,127,212,0.35)",
              boxShadow: "0 0 20px rgba(74,127,212,0.1)",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.06]">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
            </div>
            <div
              className="absolute bottom-0 left-0 right-0 px-2 py-1"
              style={{ background: "rgba(10,8,20,0.8)" }}
            >
              <span className="text-[10px] text-white/60 uppercase tracking-widest" style={{ fontFamily: G }}>
                Shadow · Lean Addicts
              </span>
            </div>
            <div className="absolute top-2 left-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 blink" />
            </div>
          </div>
        </div>

        {/* Webcam B — bottom-right */}
        <div className="flex items-end justify-end gap-3 p-4">
          <div
            className="relative rounded overflow-hidden shrink-0"
            style={{
              width: 200,
              height: 128,
              background: "#0f0c1a",
              border: "1px solid rgba(204,74,74,0.35)",
              boxShadow: "0 0 20px rgba(204,74,74,0.1)",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.06]">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
            </div>
            <div
              className="absolute bottom-0 left-0 right-0 px-2 py-1"
              style={{ background: "rgba(10,8,20,0.8)" }}
            >
              <span className="text-[10px] text-white/60 uppercase tracking-widest" style={{ fontFamily: G }}>
                Matt · Feart Attack
              </span>
            </div>
            <div className="absolute top-2 left-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 blink" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
