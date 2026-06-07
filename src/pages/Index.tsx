import { useState, useEffect } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const TEAMS = {
  A: {
    name: "LEAN ADDICTS",
    tag:  "LA",
    color: "#4A7ECC",
    streamers: ["Shadow", "Kraken", "Marlow", "Drift"],
  },
  B: {
    name: "FEART ATTACK",
    tag:  "FA",
    color: "#CC4A4A",
    streamers: ["Matt", "Corsair", "Blaze", "Tide"],
  },
};

// ─── TIMER ───────────────────────────────────────────────────────────────────

function useTimer(init: number) {
  const [t, setT] = useState(init);
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!on || t <= 0) return;
    const id = setTimeout(() => setT(v => v - 1), 1000);
    return () => clearTimeout(id);
  }, [t, on]);
  const pad = (n: number) => n.toString().padStart(2, "0");
  const label = `${pad(Math.floor(t / 60))}:${pad(t % 60)}`;
  return { label, on, toggle: () => setOn(v => !v), reset: (v = init) => { setT(v); setOn(false); } };
}

// ─── STREAM WINDOW ───────────────────────────────────────────────────────────

function StreamWindow({
  side, teamName, teamColor, streamers, selectedStreamer, onSelectStreamer,
}: {
  side: "A" | "B";
  teamName: string;
  teamColor: string;
  streamers: string[];
  selectedStreamer: number;
  onSelectStreamer: (i: number) => void;
}) {
  return (
    <div className="flex flex-col" style={{ flex: 1, borderRight: side === "A" ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
      {/* Team label bar */}
      <div
        className="flex items-center px-4 py-2 gap-3"
        style={{
          background: "rgba(255,255,255,0.03)",
          borderBottom: `2px solid ${teamColor}`,
        }}
      >
        <span
          className="text-base font-bold text-white tracking-widest uppercase"
          style={{ fontFamily: "'Goldman', cursive" }}
        >
          {teamName}
        </span>
        <span className="text-xs ml-1" style={{ color: teamColor, fontFamily: "'Goldman', cursive" }}>
          [{side === "A" ? "Team A" : "Team B"}]
        </span>
      </div>

      {/* Video area */}
      <div
        className="relative flex-1 flex items-center justify-center"
        style={{ background: "#111318", minHeight: 0 }}
      >
        {/* scanlines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg,rgba(255,255,255,.8) 0px,rgba(255,255,255,.8) 1px,transparent 1px,transparent 4px)",
          }}
        />
        {/* corner brackets */}
        {[["top-2 left-2","border-t-2 border-l-2"],["top-2 right-2","border-t-2 border-r-2"],
          ["bottom-2 left-2","border-b-2 border-l-2"],["bottom-2 right-2","border-b-2 border-r-2"]
        ].map(([pos, cls], i) => (
          <div key={i} className={`absolute ${pos} w-5 h-5 ${cls}`} style={{ borderColor: `${teamColor}60` }} />
        ))}
        <span
          className="text-xs uppercase tracking-[0.4em] text-white/20"
          style={{ fontFamily: "'Goldman', cursive" }}
        >
          МАТЧ НЕ ЗАПУЩЕН
        </span>
      </div>

      {/* Streamer selector bar */}
      <div
        className="flex items-center gap-0"
        style={{
          background: "#0d0f17",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          minHeight: 40,
        }}
      >
        <span
          className="px-3 text-[10px] uppercase tracking-widest shrink-0"
          style={{ color: "rgba(255,255,255,0.25)", fontFamily: "'Goldman', cursive", borderRight: "1px solid rgba(255,255,255,0.07)" }}
        >
          КАМЕРА
        </span>
        <div className="flex gap-0 overflow-x-auto flex-1">
          {streamers.map((name, i) => (
            <button
              key={name}
              onClick={() => onSelectStreamer(i)}
              className="px-4 py-2 text-xs uppercase tracking-wider transition-all shrink-0"
              style={{
                fontFamily: "'Goldman', cursive",
                background: selectedStreamer === i ? `${teamColor}22` : "transparent",
                color: selectedStreamer === i ? teamColor : "rgba(255,255,255,0.35)",
                borderRight: "1px solid rgba(255,255,255,0.06)",
                borderBottom: selectedStreamer === i ? `2px solid ${teamColor}` : "2px solid transparent",
              }}
            >
              {name}
            </button>
          ))}
          <span className="px-3 py-2 text-xs text-white/15 italic" style={{ fontFamily: "'Goldman', cursive" }}>
            НЕТ СТРИМЕРОВ
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

export default function Index() {
  const { label: timerLabel, on: timerOn, toggle: timerToggle, reset: timerReset } = useTimer(14 * 60 + 14);
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [pool, setPool] = useState<"A" | "B">("A");
  const [streamerA, setStreamerA] = useState(0);
  const [streamerB, setStreamerB] = useState(0);
  const [matchActive, setMatchActive] = useState(false);
  const [glitch, setGlitch] = useState(false);

  // periodic glitch on score
  useEffect(() => {
    const id = setInterval(() => { setGlitch(true); setTimeout(() => setGlitch(false), 120); }, 8000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="h-screen flex flex-col overflow-hidden select-none"
      style={{ background: "#0a0c14", fontFamily: "'Goldman', cursive" }}
    >
      <style>{`
        @keyframes pulse-live { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes glitch {
          0%{transform:translate(0)} 25%{transform:translate(-2px,1px)} 50%{transform:translate(2px,-1px)} 75%{transform:translate(-1px,2px)} 100%{transform:translate(0)}
        }
        @keyframes scan-v { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
        .live-blink { animation: pulse-live .9s ease-in-out infinite; }
        .glitch-fx  { animation: glitch .12s steps(1) infinite; }
        .scan-line  { position:fixed;top:0;left:0;right:0;height:1px;
          background:linear-gradient(90deg,transparent,rgba(200,168,75,.25),transparent);
          animation:scan-v 7s linear infinite;pointer-events:none;z-index:9999; }
      `}</style>

      <div className="scan-line" />

      {/* ── NAVBAR ─────────────────────────────────────────────────── */}
      <div
        className="flex items-center px-4 gap-4 shrink-0"
        style={{
          background: "linear-gradient(180deg,#131725 0%,#0d1020 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          height: 44,
        }}
      >
        {/* Logo + title */}
        <div className="flex items-center gap-2 mr-4">
          <img
            src="https://cdn.poehali.dev/projects/fbb51ae0-9446-4f63-92bd-51fb48883890/bucket/d6f16c6a-393e-4630-9d49-2b5b26baf723.png"
            alt="logo"
            className="h-7 w-7 object-contain"
          />
          <span className="text-sm font-bold text-white tracking-widest uppercase">
            GALLEON WORLD CUP
          </span>
        </div>

        <div className="h-4 w-px bg-white/10" />
        <span className="text-[10px] text-white/30 uppercase tracking-widest">Турнирная трансляция</span>

        <div className="h-4 w-px bg-white/10" />

        {/* Pool tabs */}
        {(["A", "B"] as const).map(p => (
          <button
            key={p}
            onClick={() => setPool(p)}
            className="px-3 py-0.5 rounded text-xs uppercase tracking-widest transition-all"
            style={{
              background: pool === p ? "#C8A84B" : "rgba(255,255,255,0.06)",
              color:      pool === p ? "#0a0c14" : "rgba(255,255,255,0.4)",
              fontFamily: "'Goldman', cursive",
              fontWeight: pool === p ? 700 : 400,
            }}
          >
            Pool {p}
          </button>
        ))}

        <div className="flex-1" />

        {/* LIVE badge */}
        <div
          className="flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold live-blink"
          style={{ background: "rgba(200,60,60,0.15)", border: "1px solid rgba(200,60,60,0.5)", color: "#ff5555" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          LIVE
        </div>
      </div>

      {/* ── SCORE BAR ──────────────────────────────────────────────── */}
      <div
        className="flex items-center shrink-0"
        style={{
          background: "#0e1120",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          height: 52,
        }}
      >
        {/* Team A name */}
        <div className="flex items-center px-6 gap-2" style={{ flex: 1 }}>
          <span
            className="text-lg font-bold text-white uppercase tracking-widest"
            style={{ color: TEAMS.A.color }}
          >
            {TEAMS.A.name}
          </span>
        </div>

        {/* Center: score + timer */}
        <div className="flex items-center gap-4 px-6">
          {/* Score A */}
          <button
            onClick={() => setScoreA(v => v + 1)}
            onContextMenu={e => { e.preventDefault(); setScoreA(v => Math.max(0, v - 1)); }}
            className={`text-3xl font-bold text-white transition-all hover:opacity-70 ${glitch ? "glitch-fx" : ""}`}
            style={{ fontFamily: "'Goldman', cursive", minWidth: 40, textAlign: "center", textShadow: `0 0 16px ${TEAMS.A.color}80` }}
            title="Клик +1 / ПКМ -1"
          >
            {scoreA}
          </button>

          {/* Divider */}
          <div className="flex flex-col items-center gap-0.5">
            <div className="w-px h-3 bg-white/20" />
            <span className="text-white/30 text-xl font-bold">:</span>
            <div className="w-px h-3 bg-white/20" />
          </div>

          {/* Score B */}
          <button
            onClick={() => setScoreB(v => v + 1)}
            onContextMenu={e => { e.preventDefault(); setScoreB(v => Math.max(0, v - 1)); }}
            className={`text-3xl font-bold text-white transition-all hover:opacity-70 ${glitch ? "glitch-fx" : ""}`}
            style={{ fontFamily: "'Goldman', cursive", minWidth: 40, textAlign: "center", textShadow: `0 0 16px ${TEAMS.B.color}80` }}
            title="Клик +1 / ПКМ -1"
          >
            {scoreB}
          </button>

          <div className="w-px h-8 bg-white/10 mx-2" />

          {/* Timer */}
          <button
            onClick={timerToggle}
            className="text-xl font-bold tracking-widest transition-all hover:opacity-70 px-3 py-0.5 rounded"
            style={{
              fontFamily: "'Goldman', cursive",
              color: "#C8A84B",
              background: "rgba(200,168,75,0.08)",
              border: "1px solid rgba(200,168,75,0.2)",
            }}
            title="Клик — пауза/старт"
          >
            {timerLabel}
          </button>
          <button
            onClick={() => timerReset(14 * 60 + 14)}
            className="text-[10px] text-white/25 hover:text-white/50 transition-colors uppercase tracking-wider"
            style={{ fontFamily: "'Goldman', cursive" }}
          >
            ↺
          </button>

          <div className="w-px h-8 bg-white/10 mx-2" />

          {/* Match status */}
          <button
            onClick={() => setMatchActive(v => !v)}
            className="px-3 py-1 rounded text-[10px] uppercase tracking-widest transition-all"
            style={{
              fontFamily: "'Goldman', cursive",
              background: matchActive ? "rgba(80,200,80,0.12)" : "rgba(255,255,255,0.05)",
              border: `1px solid ${matchActive ? "rgba(80,200,80,0.4)" : "rgba(255,255,255,0.1)"}`,
              color: matchActive ? "#50C850" : "rgba(255,255,255,0.3)",
            }}
          >
            {matchActive ? "МАТЧ ИДЁТ" : "WAITING"}
          </button>
        </div>

        {/* Team B name */}
        <div className="flex items-center justify-end px-6 gap-2" style={{ flex: 1 }}>
          <span
            className="text-lg font-bold uppercase tracking-widest"
            style={{ color: TEAMS.B.color }}
          >
            {TEAMS.B.name}
          </span>
        </div>
      </div>

      {/* ── MAIN: two stream windows ───────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden" style={{ minHeight: 0 }}>
        <StreamWindow
          side="A"
          teamName={TEAMS.A.name}
          teamColor={TEAMS.A.color}
          streamers={TEAMS.A.streamers}
          selectedStreamer={streamerA}
          onSelectStreamer={setStreamerA}
        />
        <StreamWindow
          side="B"
          teamName={TEAMS.B.name}
          teamColor={TEAMS.B.color}
          streamers={TEAMS.B.streamers}
          selectedStreamer={streamerB}
          onSelectStreamer={setStreamerB}
        />
      </div>

      {/* ── FOOTER STATUS ──────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-5 shrink-0"
        style={{
          background: "#080a12",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          height: 28,
        }}
      >
        <span className="text-[9px] uppercase tracking-[0.4em] text-white/15" style={{ fontFamily: "'Goldman', cursive" }}>
          Notorious Arena League · EU · Pool {pool}
        </span>
        <img
          src="https://cdn.poehali.dev/projects/fbb51ae0-9446-4f63-92bd-51fb48883890/bucket/d6f16c6a-393e-4630-9d49-2b5b26baf723.png"
          alt="logo"
          className="h-5 w-5 object-contain opacity-30"
        />
        <span className="text-[9px] uppercase tracking-[0.4em] text-white/15" style={{ fontFamily: "'Goldman', cursive" }}>
          Powered by Poehali.dev
        </span>
      </div>
    </div>
  );
}
