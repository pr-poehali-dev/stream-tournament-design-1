import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

// ─── DATA ───────────────────────────────────────────────────────────────────

const TEAM_A = {
  name: "LEAN ADDICTS",
  tag: "LA",
  color: "#C8A84B",
  players: [
    { nick: "Shadow",  role: "Captain",  score: 23, alive: true  },
    { nick: "Kraken",  role: "Gunner",   score: 17, alive: true  },
    { nick: "Marlow",  role: "Rigger",   score: 12, alive: false },
    { nick: "Drift",   role: "Navigator",score: 8,  alive: true  },
  ],
};

const TEAM_B = {
  name: "FEART ATTACK",
  tag: "FA",
  color: "#4A9ECC",
  players: [
    { nick: "Matt",    role: "Captain",  score: 19, alive: true  },
    { nick: "Corsair", role: "Gunner",   score: 14, alive: true  },
    { nick: "Blaze",   role: "Rigger",   score: 11, alive: true  },
    { nick: "Tide",    role: "Navigator",score: 6,  alive: false },
  ],
};

// ─── TIMER ──────────────────────────────────────────────────────────────────

function useCountdown(initial: number) {
  const [time, setTime] = useState(initial);
  const [running, setRunning] = useState(true);
  useEffect(() => {
    if (!running || time <= 0) return;
    const t = setTimeout(() => setTime((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [time, running]);
  const reset = (v = initial) => { setTime(v); setRunning(true); };
  const toggle = () => setRunning((r) => !r);
  return { time, reset, toggle, running };
}

function pad(n: number) { return n.toString().padStart(2, "0"); }

// ─── PLAYER ROW ─────────────────────────────────────────────────────────────

function PlayerRow({
  player, align,
}: {
  player: typeof TEAM_A.players[0];
  align: "left" | "right";
}) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 transition-all"
      style={{
        flexDirection: align === "right" ? "row-reverse" : "row",
        opacity: player.alive ? 1 : 0.35,
        borderLeft:  align === "left"  ? `2px solid ${player.alive ? "rgba(200,168,75,0.6)" : "transparent"}` : "none",
        borderRight: align === "right" ? `2px solid ${player.alive ? "rgba(74,158,204,0.6)" : "transparent"}` : "none",
      }}
    >
      {/* skull / anchor */}
      <span className="text-sm shrink-0">{player.alive ? "⚓" : "💀"}</span>
      <div className="flex-1" style={{ textAlign: align }}>
        <div className="text-white font-bold text-sm leading-none" style={{ fontFamily: "'Goldman', cursive" }}>
          {player.nick}
        </div>
        <div className="text-[10px] mt-0.5" style={{ color: "rgba(200,168,75,0.6)" }}>
          {player.role}
        </div>
      </div>
      <div
        className="text-lg font-bold shrink-0"
        style={{ fontFamily: "'Goldman', cursive", color: "#C8A84B", minWidth: 28, textAlign: "center" }}
      >
        {player.score}
      </div>
    </div>
  );
}

// ─── WEBCAM BOX ─────────────────────────────────────────────────────────────

function WebcamBox({ label, side }: { label: string; side: "A" | "B" }) {
  const color = side === "A" ? TEAM_A.color : TEAM_B.color;
  return (
    <div
      className="relative aspect-video rounded overflow-hidden flex-1"
      style={{
        background: "#0d1426",
        border: `2px solid ${color}40`,
        boxShadow: `0 0 12px ${color}20`,
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <Icon name="User" size={36} />
      </div>
      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: color }} />
      <div className="absolute bottom-0 left-0 right-0 px-2 py-1" style={{ background: "rgba(5,10,25,0.75)" }}>
        <span className="text-xs font-bold" style={{ fontFamily: "'Goldman', cursive", color }}>
          {label}
        </span>
      </div>
    </div>
  );
}

// ─── MAIN ───────────────────────────────────────────────────────────────────

export default function Index() {
  const { time, reset, toggle, running } = useCountdown(14 * 60 + 14);
  const [scoreA, setScoreA] = useState(3);
  const [scoreB, setScoreB] = useState(1);
  const [game, setGame]     = useState(4);
  const [phase, setPhase]   = useState("GAME IN PROGRESS");

  const phases = ["GAME IN PROGRESS", "INTERMISSION", "SUDDEN DEATH", "GAME OVER"];
  const phaseColor: Record<string, string> = {
    "GAME IN PROGRESS": "#C8A84B",
    "INTERMISSION":     "#4A9ECC",
    "SUDDEN DEATH":     "#cc4a4a",
    "GAME OVER":        "#888",
  };

  const m = pad(Math.floor(time / 60));
  const s = pad(time % 60);
  const urgent = time <= 60;

  return (
    <div
      className="min-h-screen flex flex-col select-none"
      style={{
        background: "#07102a",
        fontFamily: "'Goldman', cursive",
      }}
    >
      <style>{`
        @keyframes gold-pulse { 0%,100%{opacity:1} 50%{opacity:.55} }
        @keyframes scan { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .scan-line {
          position:fixed;top:0;left:0;right:0;height:1px;
          background:linear-gradient(90deg,transparent,rgba(200,168,75,.3),transparent);
          animation:scan 6s linear infinite;pointer-events:none;z-index:9999;
        }
        .urgent { animation: gold-pulse .7s ease-in-out infinite; }
        .fade-up { animation: fadeUp .45s ease both; }
        .gold-border {
          border-image: linear-gradient(90deg,transparent,#C8A84B,transparent) 1;
        }
        /* декоративные уголки */
        .corner::before,.corner::after {
          content:'';position:absolute;width:12px;height:12px;
          border-color:#C8A84B;border-style:solid;
        }
        .corner-tl::before { top:0;left:0; border-width:2px 0 0 2px; }
        .corner-tr::after  { top:0;right:0; border-width:2px 2px 0 0; }
        .corner-bl::before { bottom:0;left:0; border-width:0 0 2px 2px; }
        .corner-br::after  { bottom:0;right:0; border-width:0 2px 2px 0; }
      `}</style>

      <div className="scan-line" />

      {/* ── TOP BAR ─────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-6 py-2 fade-up"
        style={{
          background: "linear-gradient(180deg,#0d1e45 0%,#07102a 100%)",
          borderBottom: "1px solid rgba(200,168,75,0.2)",
        }}
      >
        {/* League name */}
        <div className="flex items-center gap-3">
          <img
            src="https://cdn.poehali.dev/projects/fbb51ae0-9446-4f63-92bd-51fb48883890/bucket/d6f16c6a-393e-4630-9d49-2b5b26baf723.png"
            alt="World Cup"
            className="h-10 w-10 object-contain"
          />
          <div>
            <div className="text-xs text-white/40 tracking-widest uppercase" style={{ fontFamily: "'Goldman', cursive" }}>
              Notorious Arena League
            </div>
            <div className="text-sm font-bold text-white" style={{ fontFamily: "'Goldman', cursive" }}>
              WORLD CUP · EU
            </div>
          </div>
        </div>

        {/* Phase badge */}
        <button
          className="px-4 py-1 text-xs rounded uppercase tracking-widest transition-all"
          style={{
            background: `${phaseColor[phase]}18`,
            border: `1px solid ${phaseColor[phase]}60`,
            color: phaseColor[phase],
            fontFamily: "'Goldman', cursive",
          }}
          onClick={() => setPhase(phases[(phases.indexOf(phase) + 1) % phases.length])}
        >
          {phase}
        </button>

        {/* Game info */}
        <div className="flex items-center gap-3 text-right">
          <div>
            <div className="text-[10px] text-white/30 uppercase tracking-widest">Sloopetition</div>
            <div className="text-sm text-white font-bold">Game {game}</div>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs text-white/50 uppercase tracking-widest">Live</span>
          </div>
        </div>
      </div>

      {/* ── TEAM HEADERS + SCORE ────────────────────────────────── */}
      <div
        className="grid grid-cols-3 items-stretch fade-up"
        style={{
          background: "linear-gradient(180deg,#0a1835 0%,#071328 100%)",
          borderBottom: "2px solid rgba(200,168,75,0.25)",
          animationDelay: "0.05s",
        }}
      >
        {/* Team A */}
        <div
          className="flex items-center gap-4 px-6 py-4"
          style={{ borderRight: "1px solid rgba(200,168,75,0.15)" }}
        >
          <div
            className="w-12 h-12 rounded flex items-center justify-center text-2xl shrink-0"
            style={{ background: "rgba(200,168,75,0.1)", border: "1px solid rgba(200,168,75,0.3)" }}
          >
            ⚔️
          </div>
          <div>
            <div
              className="text-2xl font-bold text-white leading-none"
              style={{ fontFamily: "'Goldman', cursive" }}
            >
              {TEAM_A.name}
            </div>
            <div className="text-xs mt-1 uppercase tracking-widest" style={{ color: TEAM_A.color }}>
              [{TEAM_A.tag}] · Attackers
            </div>
          </div>
        </div>

        {/* Center score + timer */}
        <div className="flex flex-col items-center justify-center py-4 gap-2">
          {/* Score */}
          <div className="flex items-center gap-0">
            <button
              onClick={() => setScoreA(v => v + 1)}
              className="text-6xl font-bold text-white px-4 hover:opacity-70 transition-opacity"
              style={{ fontFamily: "'Goldman', cursive", textShadow: `0 0 20px ${TEAM_A.color}60` }}
            >
              {scoreA}
            </button>
            <div className="flex flex-col items-center px-3">
              <span className="text-white/20 text-3xl font-bold" style={{ fontFamily: "'Goldman', cursive" }}>:</span>
            </div>
            <button
              onClick={() => setScoreB(v => v + 1)}
              className="text-6xl font-bold text-white px-4 hover:opacity-70 transition-opacity"
              style={{ fontFamily: "'Goldman', cursive", textShadow: `0 0 20px ${TEAM_B.color}60` }}
            >
              {scoreB}
            </button>
          </div>

          {/* Timer */}
          <div
            className={`text-3xl font-bold tracking-widest px-6 py-1 rounded ${urgent ? "urgent" : ""}`}
            style={{
              fontFamily: "'Goldman', cursive",
              color: urgent ? "#cc4a4a" : "#C8A84B",
              background: "rgba(0,0,0,0.3)",
              border: `1px solid ${urgent ? "rgba(204,74,74,0.4)" : "rgba(200,168,75,0.25)"}`,
              boxShadow: urgent ? "0 0 20px rgba(204,74,74,0.3)" : "0 0 15px rgba(200,168,75,0.1)",
            }}
          >
            {m}:{s}
          </div>

          {/* Timer controls */}
          <div className="flex gap-2">
            <button
              onClick={toggle}
              className="px-3 py-0.5 text-[10px] uppercase tracking-widest rounded transition-all"
              style={{
                fontFamily: "'Goldman', cursive",
                background: running ? "rgba(204,74,74,0.15)" : "rgba(200,168,75,0.15)",
                border: `1px solid ${running ? "rgba(204,74,74,0.4)" : "rgba(200,168,75,0.4)"}`,
                color: running ? "#cc4a4a" : "#C8A84B",
              }}
            >
              {running ? "⏸ Пауза" : "▶ Старт"}
            </button>
            <button
              onClick={() => reset(14 * 60 + 14)}
              className="px-3 py-0.5 text-[10px] uppercase tracking-widest rounded text-white/30 hover:text-white/60 transition-all"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "'Goldman', cursive" }}
            >
              ↺ Reset
            </button>
          </div>
        </div>

        {/* Team B */}
        <div
          className="flex items-center gap-4 px-6 py-4 flex-row-reverse"
          style={{ borderLeft: "1px solid rgba(74,158,204,0.15)" }}
        >
          <div
            className="w-12 h-12 rounded flex items-center justify-center text-2xl shrink-0"
            style={{ background: "rgba(74,158,204,0.1)", border: "1px solid rgba(74,158,204,0.3)" }}
          >
            🛡️
          </div>
          <div className="text-right">
            <div
              className="text-2xl font-bold text-white leading-none"
              style={{ fontFamily: "'Goldman', cursive" }}
            >
              {TEAM_B.name}
            </div>
            <div className="text-xs mt-1 uppercase tracking-widest text-right" style={{ color: TEAM_B.color }}>
              [{TEAM_B.tag}] · Defenders
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN STREAMS ────────────────────────────────────────── */}
      <div className="flex-1 grid grid-cols-2 gap-0 fade-up" style={{ animationDelay: "0.1s" }}>
        {/* Stream A */}
        <div
          className="relative flex flex-col"
          style={{ borderRight: "1px solid rgba(200,168,75,0.12)" }}
        >
          <div
            className="relative flex-1 bg-[#0d1426] overflow-hidden"
            style={{ minHeight: 0 }}
          >
            {/* placeholder grid */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: "linear-gradient(rgba(200,168,75,1) 1px,transparent 1px),linear-gradient(90deg,rgba(200,168,75,1) 1px,transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2 opacity-[0.07]">
                <Icon name="Monitor" size={80} />
                <span style={{ fontFamily: "'Goldman', cursive", fontSize: 13, letterSpacing: "0.3em" }}>
                  STREAM A
                </span>
              </div>
            </div>
            {/* top gold line */}
            <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: "linear-gradient(90deg,transparent,#C8A84B,transparent)" }} />
            {/* LIVE badge */}
            <div
              className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded"
              style={{ background: "rgba(200,0,0,0.85)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-[10px] text-white font-bold tracking-widest" style={{ fontFamily: "'Goldman', cursive" }}>LIVE</span>
            </div>
            {/* player name tag like SoT */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-2 rounded opacity-20"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.1)",
                fontFamily: "'Goldman', cursive",
                fontSize: 22,
                color: "#fff",
                letterSpacing: "0.1em",
              }}
            >
              {TEAM_A.players[0].nick.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Stream B */}
        <div className="relative flex flex-col">
          <div className="relative flex-1 bg-[#0d1426] overflow-hidden" style={{ minHeight: 0 }}>
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: "linear-gradient(rgba(74,158,204,1) 1px,transparent 1px),linear-gradient(90deg,rgba(74,158,204,1) 1px,transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2 opacity-[0.07]">
                <Icon name="Monitor" size={80} />
                <span style={{ fontFamily: "'Goldman', cursive", fontSize: 13, letterSpacing: "0.3em" }}>
                  STREAM B
                </span>
              </div>
            </div>
            <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: "linear-gradient(90deg,transparent,#4A9ECC,transparent)" }} />
            <div
              className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded"
              style={{ background: "rgba(200,0,0,0.85)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-[10px] text-white font-bold tracking-widest" style={{ fontFamily: "'Goldman', cursive" }}>LIVE</span>
            </div>
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-2 rounded opacity-20"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.1)",
                fontFamily: "'Goldman', cursive",
                fontSize: 22,
                color: "#fff",
                letterSpacing: "0.1em",
              }}
            >
              {TEAM_B.players[0].nick.toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM ROW: webcams + rosters ───────────────────────── */}
      <div
        className="grid grid-cols-2 gap-0 fade-up"
        style={{
          borderTop: "2px solid rgba(200,168,75,0.2)",
          background: "linear-gradient(180deg,#0a1835 0%,#060f26 100%)",
          animationDelay: "0.15s",
        }}
      >
        {/* Left half — Team A */}
        <div className="flex gap-3 p-3" style={{ borderRight: "1px solid rgba(200,168,75,0.12)" }}>
          {/* Webcams */}
          <div className="flex gap-2" style={{ width: 220 }}>
            {TEAM_A.players.slice(0, 2).map((p) => (
              <WebcamBox key={p.nick} label={p.nick} side="A" />
            ))}
          </div>

          {/* Roster */}
          <div className="flex-1 flex flex-col justify-center divide-y divide-white/[0.05]">
            <div className="pb-1 px-3 flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-white/30" style={{ fontFamily: "'Goldman', cursive" }}>
                {TEAM_A.tag} · Состав
              </span>
              <span className="text-xs font-bold ml-auto" style={{ color: TEAM_A.color, fontFamily: "'Goldman', cursive" }}>
                {TEAM_A.players.filter(p => p.alive).length}/4 живых
              </span>
            </div>
            {TEAM_A.players.map((p) => (
              <PlayerRow key={p.nick} player={p} align="left" />
            ))}
          </div>
        </div>

        {/* Right half — Team B */}
        <div className="flex gap-3 p-3 flex-row-reverse">
          {/* Webcams */}
          <div className="flex gap-2" style={{ width: 220 }}>
            {TEAM_B.players.slice(0, 2).map((p) => (
              <WebcamBox key={p.nick} label={p.nick} side="B" />
            ))}
          </div>

          {/* Roster */}
          <div className="flex-1 flex flex-col justify-center divide-y divide-white/[0.05]">
            <div className="pb-1 px-3 flex items-center gap-2">
              <span className="text-xs font-bold" style={{ color: TEAM_B.color, fontFamily: "'Goldman', cursive" }}>
                {TEAM_B.players.filter(p => p.alive).length}/4 живых
              </span>
              <span className="text-[10px] uppercase tracking-widest text-white/30 ml-auto" style={{ fontFamily: "'Goldman', cursive" }}>
                {TEAM_B.tag} · Состав
              </span>
            </div>
            {TEAM_B.players.map((p) => (
              <PlayerRow key={p.nick} player={p} align="right" />
            ))}
          </div>
        </div>
      </div>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-6 py-1.5"
        style={{
          background: "#040d20",
          borderTop: "1px solid rgba(200,168,75,0.12)",
        }}
      >
        <span className="text-[9px] text-white/15 uppercase tracking-[0.4em]" style={{ fontFamily: "'Goldman', cursive" }}>
          Notorious Arena League · EU Region
        </span>
        <img
          src="https://cdn.poehali.dev/projects/fbb51ae0-9446-4f63-92bd-51fb48883890/bucket/d6f16c6a-393e-4630-9d49-2b5b26baf723.png"
          alt="logo"
          className="h-6 w-6 object-contain opacity-40"
        />
        <span className="text-[9px] text-white/15 uppercase tracking-[0.4em]" style={{ fontFamily: "'Goldman', cursive" }}>
          Powered by Poehali.dev
        </span>
      </div>
    </div>
  );
}
