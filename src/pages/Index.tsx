import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const TEAM_A = {
  name: "PHANTOM EDGE",
  tag: "PHX",
  color: "#FF4655",
  logo: "⚔️",
  players: [
    { nick: "ShadowByte", role: "Duelist", agent: "Jett", kills: 18, deaths: 7, assists: 4, credits: 4800, alive: true },
    { nick: "NeonPulse", role: "Controller", agent: "Omen", kills: 12, deaths: 9, assists: 11, credits: 3200, alive: true },
    { nick: "GlitchX", role: "Initiator", agent: "Sova", kills: 9, deaths: 8, assists: 14, credits: 2900, alive: false },
    { nick: "VoidWalker", role: "Sentinel", agent: "Cypher", kills: 7, deaths: 6, assists: 8, credits: 5000, alive: true },
    { nick: "CrimsonAce", role: "Duelist", agent: "Reyna", kills: 21, deaths: 11, assists: 2, credits: 4200, alive: false },
  ],
};

const TEAM_B = {
  name: "STEEL RESOLVE",
  tag: "STR",
  color: "#00D4FF",
  logo: "🛡️",
  players: [
    { nick: "IronFist", role: "Duelist", agent: "Phoenix", kills: 15, deaths: 10, assists: 3, credits: 3800, alive: true },
    { nick: "FrostByte", role: "Controller", agent: "Viper", kills: 8, deaths: 7, assists: 13, credits: 4100, alive: true },
    { nick: "QuantumQ", role: "Initiator", agent: "Fade", kills: 11, deaths: 9, assists: 9, credits: 2700, alive: true },
    { nick: "StormShield", role: "Sentinel", agent: "Killjoy", kills: 6, deaths: 5, assists: 10, credits: 5000, alive: false },
    { nick: "TitanX", role: "Duelist", agent: "Neon", kills: 19, deaths: 13, assists: 5, credits: 3500, alive: true },
  ],
};

const ROLE_COLORS: Record<string, string> = {
  Duelist: "#FF4655",
  Controller: "#8B5CF6",
  Initiator: "#F59E0B",
  Sentinel: "#10B981",
};

function useCountdown(initial: number) {
  const [time, setTime] = useState(initial);
  const [running, setRunning] = useState(true);
  useEffect(() => {
    if (!running || time <= 0) return;
    const t = setTimeout(() => setTime((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [time, running]);
  const reset = () => { setTime(initial); setRunning(true); };
  return { time, reset, setRunning };
}

function Timer({ seconds, color }: { seconds: number; color: string }) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  const pct = (seconds / 100) * 360;
  const urgent = seconds <= 15;
  return (
    <div className="relative flex flex-col items-center">
      <div
        className="relative w-28 h-28 flex items-center justify-center rounded-full"
        style={{
          background: `conic-gradient(${urgent ? "#FF4655" : color} ${pct}deg, rgba(255,255,255,0.04) 0deg)`,
          boxShadow: urgent ? `0 0 30px #FF465580` : `0 0 15px ${color}40`,
        }}
      >
        <div className="w-24 h-24 rounded-full bg-[#0a0a0f] flex flex-col items-center justify-center">
          <span
            className="text-2xl font-bold tracking-widest"
            style={{
              color: urgent ? "#FF4655" : color,
              fontFamily: "'Share Tech Mono', monospace",
              animation: urgent ? "pulse-red 1s infinite" : "none",
            }}
          >
            {m}:{s}
          </span>
          <span className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">ROUND</span>
        </div>
      </div>
    </div>
  );
}

function BurnBadge({ burns }: { burns: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: burns }).map((_, i) => (
        <div key={i} className="w-3 h-3 rounded-sm" style={{ background: "#FF4655", boxShadow: "0 0 6px #FF465580" }} />
      ))}
    </div>
  );
}

function PlayerRow({ player, side, teamColor }: { player: typeof TEAM_A.players[0]; side: "left" | "right"; teamColor: string }) {
  const kda = ((player.kills + player.assists * 0.5) / Math.max(player.deaths, 1)).toFixed(1);
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 transition-all duration-300"
      style={{
        flexDirection: side === "right" ? "row-reverse" : "row",
        opacity: player.alive ? 1 : 0.3,
        filter: player.alive ? "none" : "grayscale(1)",
        background: player.alive ? `${teamColor}08` : "transparent",
        borderLeft: side === "left" && player.alive ? `2px solid ${teamColor}` : side === "left" ? "2px solid transparent" : "none",
        borderRight: side === "right" && player.alive ? `2px solid ${teamColor}` : side === "right" ? "2px solid transparent" : "none",
      }}
    >
      <div className="w-7 h-7 rounded flex items-center justify-center text-base shrink-0" style={{ background: `${teamColor}15` }}>
        {player.alive ? "🟢" : "💀"}
      </div>
      <div className="flex-1" style={{ textAlign: side === "right" ? "right" : "left" }}>
        <div className="flex items-center gap-1.5" style={{ justifyContent: side === "right" ? "flex-end" : "flex-start" }}>
          <span className="text-white font-bold text-sm" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{player.nick}</span>
          <span
            className="text-[9px] px-1 rounded font-medium uppercase tracking-wider"
            style={{ background: `${ROLE_COLORS[player.role]}25`, color: ROLE_COLORS[player.role] }}
          >
            {player.agent}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-0.5" style={{ justifyContent: side === "right" ? "flex-end" : "flex-start" }}>
          <span className="text-white/80 text-xs font-mono">{player.kills}<span className="text-white/30">/</span>{player.deaths}<span className="text-white/30">/</span>{player.assists}</span>
          <span className="text-[10px] text-white/30">KDA {kda}</span>
        </div>
      </div>
      <div className="flex flex-col shrink-0" style={{ alignItems: side === "left" ? "flex-end" : "flex-start" }}>
        <span className="text-[10px] text-[#F59E0B] font-mono font-bold">₵{player.credits.toLocaleString()}</span>
        <span className="text-[9px] text-white/30 uppercase">{player.role}</span>
      </div>
    </div>
  );
}

export default function Index() {
  const { time, reset } = useCountdown(100);
  const [scoreA, setScoreA] = useState(7);
  const [scoreB, setScoreB] = useState(5);
  const [round, setRound] = useState(13);
  const [phase, setPhase] = useState("BUY PHASE");
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 150);
    }, 7000);
    return () => clearInterval(id);
  }, []);

  const phases = ["BUY PHASE", "LIVE", "ROUND END", "SPIKE PLANTED"];
  const phaseColors: Record<string, string> = {
    "BUY PHASE": "#F59E0B",
    LIVE: "#10B981",
    "ROUND END": "#8B5CF6",
    "SPIKE PLANTED": "#FF4655",
  };

  const allPlayers = [...TEAM_A.players, ...TEAM_B.players].sort((a, b) => b.kills - a.kills);

  return (
    <div
      className="min-h-screen text-white overflow-x-hidden"
      style={{ background: "#06060f", fontFamily: "'Exo 2', sans-serif" }}
    >
      <style>{`
        @keyframes pulse-red { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes scan { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
        @keyframes glitch {
          0%{transform:translate(0)} 20%{transform:translate(-2px,1px)} 40%{transform:translate(2px,-1px)}
          60%{transform:translate(-1px,2px)} 80%{transform:translate(1px,-2px)} 100%{transform:translate(0)}
        }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes neon-pulse { 0%,100%{filter:brightness(1)} 50%{filter:brightness(1.4)} }
        .glitch { animation: glitch 0.15s steps(1) infinite; }
        .neon { animation: neon-pulse 3s ease-in-out infinite; }
        .scan-line {
          position:fixed; top:0; left:0; right:0; height:2px;
          background:linear-gradient(90deg,transparent,rgba(255,70,85,0.25),rgba(0,212,255,0.25),transparent);
          animation:scan 5s linear infinite; pointer-events:none; z-index:9999;
        }
        .f1 { animation: fadeInUp 0.4s ease both; }
        .f2 { animation: fadeInUp 0.4s ease 0.1s both; }
        .f3 { animation: fadeInUp 0.4s ease 0.2s both; }
        .f4 { animation: fadeInUp 0.4s ease 0.3s both; }
        .grid-bg {
          background-image:linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),
            linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px);
          background-size:40px 40px;
        }
      `}</style>

      <div className="scan-line" />

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 50% 35% at 15% 50%, rgba(255,70,85,0.05) 0%, transparent 60%),
          radial-gradient(ellipse 50% 35% at 85% 50%, rgba(0,212,255,0.05) 0%, transparent 60%)`,
      }} />

      {/* TOP BAR */}
      <div className="relative flex items-center justify-between px-6 py-2.5 z-10 f1" style={{
        background: "linear-gradient(180deg,#0c0c1e 0%,#08080f 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-mono text-white/40 tracking-[0.3em] uppercase">LIVE BROADCAST</span>
          </div>
          <div className="h-3 w-px bg-white/10" />
          <span className="text-[10px] text-white/25 font-mono">CHAMPIONS SERIES 2026 • GRAND FINAL</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest transition-all"
            style={{ background: `${phaseColors[phase]}20`, color: phaseColors[phase], border: `1px solid ${phaseColors[phase]}40` }}
            onClick={() => setPhase(phases[(phases.indexOf(phase) + 1) % phases.length])}
          >
            {phase}
          </button>
          <span className="text-[10px] text-white/25 font-mono">ROUND {round} / 24</span>
          <span className="text-[10px] text-white/25 font-mono">MAP 2 • BIND</span>
        </div>
      </div>

      {/* SCOREBOARD ROW */}
      <div className="relative flex items-center justify-between px-6 py-4 z-10 f2" style={{ background: "#09091a" }}>
        {/* Team A */}
        <div className={`flex items-center gap-4 ${glitch ? "glitch" : ""}`}>
          <span className="text-5xl">{TEAM_A.logo}</span>
          <div>
            <div className="text-3xl font-black tracking-wider uppercase neon" style={{ color: TEAM_A.color, fontFamily: "'Rajdhani',sans-serif", lineHeight: 1 }}>
              {TEAM_A.name}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-white/25 tracking-[0.4em] uppercase">[{TEAM_A.tag}]</span>
              <BurnBadge burns={2} />
            </div>
          </div>
        </div>

        {/* Center */}
        <div className="flex flex-col items-center gap-3">
          {/* Score */}
          <div className="flex items-stretch">
            <div className="flex flex-col items-center px-8 py-2" style={{ background: "rgba(255,70,85,0.08)", borderLeft: "3px solid #FF4655" }}>
              <span className="text-7xl font-black text-white" style={{ fontFamily: "'Exo 2',sans-serif", lineHeight: 1 }}>{scoreA}</span>
            </div>
            <div className="flex flex-col items-center justify-center px-5 gap-0.5" style={{ background: "rgba(255,255,255,0.03)" }}>
              <span className="text-[9px] text-white/20 tracking-widest uppercase font-mono">MAP 2</span>
              <span className="text-white/40 font-bold text-sm" style={{ fontFamily: "'Rajdhani',sans-serif" }}>VS</span>
              <span className="text-[9px] text-[#F59E0B] tracking-widest uppercase font-mono">BIND</span>
            </div>
            <div className="flex flex-col items-center px-8 py-2" style={{ background: "rgba(0,212,255,0.08)", borderRight: "3px solid #00D4FF" }}>
              <span className="text-7xl font-black text-white" style={{ fontFamily: "'Exo 2',sans-serif", lineHeight: 1 }}>{scoreB}</span>
            </div>
          </div>

          <Timer seconds={time} color="#FF4655" />

          <div className="flex gap-2">
            <button onClick={reset} className="px-3 py-1 text-[10px] uppercase tracking-widest rounded text-white/40 hover:text-white/70 transition-colors" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              ↺ Reset
            </button>
            <button onClick={() => { setScoreA(s => Math.min(s + 1, 13)); setRound(r => r + 1); }} className="px-3 py-1 text-[10px] uppercase tracking-widest rounded font-bold" style={{ background: "#FF465520", border: "1px solid #FF465540", color: "#FF4655" }}>
              +PHX
            </button>
            <button onClick={() => { setScoreB(s => Math.min(s + 1, 13)); setRound(r => r + 1); }} className="px-3 py-1 text-[10px] uppercase tracking-widest rounded font-bold" style={{ background: "#00D4FF20", border: "1px solid #00D4FF40", color: "#00D4FF" }}>
              +STR
            </button>
          </div>
        </div>

        {/* Team B */}
        <div className={`flex items-center gap-4 flex-row-reverse ${glitch ? "glitch" : ""}`}>
          <span className="text-5xl">{TEAM_B.logo}</span>
          <div className="text-right">
            <div className="text-3xl font-black tracking-wider uppercase neon" style={{ color: TEAM_B.color, fontFamily: "'Rajdhani',sans-serif", lineHeight: 1 }}>
              {TEAM_B.name}
            </div>
            <div className="flex items-center gap-2 mt-1 justify-end">
              <BurnBadge burns={1} />
              <span className="text-[10px] text-white/25 tracking-[0.4em] uppercase">[{TEAM_B.tag}]</span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-12 gap-3 p-4">
        {/* Team A roster */}
        <div className="col-span-3 f3">
          <div className="rounded-lg overflow-hidden" style={{ background: "#0a0a18", border: "1px solid rgba(255,70,85,0.15)" }}>
            <div className="px-3 py-2 flex items-center justify-between" style={{ background: "linear-gradient(90deg,rgba(255,70,85,0.12),transparent)", borderBottom: "1px solid rgba(255,70,85,0.08)" }}>
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">Состав</span>
              <span className="text-xs font-bold" style={{ color: "#FF4655" }}>{TEAM_A.tag}</span>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {TEAM_A.players.map((p) => <PlayerRow key={p.nick} player={p} side="left" teamColor={TEAM_A.color} />)}
            </div>
            <div className="px-3 py-1.5 flex justify-between" style={{ borderTop: "1px solid rgba(255,70,85,0.08)", background: "rgba(255,70,85,0.04)" }}>
              <span className="text-[10px] text-white/25 uppercase tracking-wider">В живых</span>
              <span className="text-xs font-bold" style={{ color: "#FF4655" }}>{TEAM_A.players.filter(p => p.alive).length} / 5</span>
            </div>
          </div>
        </div>

        {/* Center streams */}
        <div className="col-span-6 flex flex-col gap-3 f2">
          {/* Main stream */}
          <div className="relative w-full aspect-video rounded-lg overflow-hidden" style={{ background: "#0d0d1a", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="absolute inset-0 grid-bg" />
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.07]">
              <div className="flex flex-col items-center gap-2">
                <Icon name="Tv" size={72} />
                <span className="text-xs tracking-[0.5em] uppercase font-mono">MAIN BROADCAST</span>
              </div>
            </div>
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg,transparent,#FF4655,#00D4FF,transparent)" }} />
            <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2 py-1 rounded" style={{ background: "rgba(255,70,85,0.85)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-[10px] text-white font-bold tracking-widest">LIVE</span>
            </div>
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <Icon name="Eye" size={11} className="text-white/30" />
              <span className="text-[11px] text-white/30 font-mono">48,291</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between" style={{ background: "linear-gradient(0deg,rgba(0,0,0,0.7),transparent)" }}>
              <span className="text-[10px] text-white/40 font-mono uppercase tracking-widest">MAIN CAMERA • MAP VIEW</span>
            </div>
          </div>

          {/* Player POVs */}
          <div className="grid grid-cols-5 gap-2">
            {[
              { name: "ShadowByte", team: "A" },
              { name: "NeonPulse", team: "A" },
              { name: "IronFist", team: "B" },
              { name: "FrostByte", team: "B" },
              { name: "QuantumQ", team: "B" },
            ].map(({ name, team }) => {
              const color = team === "A" ? "#FF4655" : "#00D4FF";
              return (
                <div key={name} className="relative aspect-video rounded overflow-hidden" style={{ background: "#0d0d1a", border: `1px solid ${color}25` }}>
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.06]">
                    <Icon name="User" size={22} />
                  </div>
                  <div className="absolute top-0 left-0 right-0 h-px" style={{ background: color }} />
                  <div className="absolute bottom-0 left-0 right-0 p-1" style={{ background: "rgba(0,0,0,0.65)" }}>
                    <span className="text-[8px] text-white/60 font-mono truncate block">{name}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map + economy */}
          <div className="grid grid-cols-2 gap-3">
            {/* Minimap */}
            <div className="rounded-lg p-3" style={{ background: "#0a0a18", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-[0.25em] text-white/30">Миникарта</span>
                <span className="text-[9px] text-[#F59E0B] font-mono">BIND</span>
              </div>
              <div className="w-full h-20 rounded relative overflow-hidden" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                <div className="absolute inset-0 grid-bg opacity-50" />
                {[{ x: 20, y: 40 }, { x: 30, y: 60 }, { x: 25, y: 28 }].map((pos, i) => (
                  <div key={`a${i}`} className="absolute w-2.5 h-2.5 rounded-full border-2" style={{ left: `${pos.x}%`, top: `${pos.y}%`, background: "#FF4655", borderColor: "#FF465560", boxShadow: "0 0 6px #FF465560" }} />
                ))}
                {[{ x: 70, y: 38 }, { x: 76, y: 55 }, { x: 80, y: 33 }, { x: 64, y: 50 }].map((pos, i) => (
                  <div key={`b${i}`} className="absolute w-2.5 h-2.5 rounded-full border-2" style={{ left: `${pos.x}%`, top: `${pos.y}%`, background: "#00D4FF", borderColor: "#00D4FF60", boxShadow: "0 0 6px #00D4FF60" }} />
                ))}
              </div>
              <div className="flex gap-3 mt-2">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ background: "#FF4655" }} />
                  <span className="text-[9px] text-white/40">Атака</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ background: "#00D4FF" }} />
                  <span className="text-[9px] text-white/40">Защита</span>
                </div>
              </div>
            </div>

            {/* Economy */}
            <div className="rounded-lg p-3" style={{ background: "#0a0a18", border: "1px solid rgba(245,158,11,0.15)" }}>
              <div className="flex items-center gap-2 mb-3">
                <Icon name="Coins" size={11} className="text-yellow-400/70" />
                <span className="text-[10px] uppercase tracking-[0.25em] text-white/30">Экономика</span>
              </div>
              {[
                { team: "PHX", color: "#FF4655", credits: 18200 },
                { team: "STR", color: "#00D4FF", credits: 21100 },
              ].map(({ team, color, credits }) => (
                <div key={team} className="mb-2.5">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-bold" style={{ color }}>{team}</span>
                    <span className="text-white/50 font-mono">₵{credits.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(credits / 25000) * 100}%`, background: `linear-gradient(90deg,${color},${color}70)` }} />
                  </div>
                </div>
              ))}

              <div className="mt-3 pt-2 border-t border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Flame" size={11} className="text-orange-400/70" />
                  <span className="text-[10px] uppercase tracking-[0.25em] text-white/30">Burns</span>
                </div>
                <div className="flex justify-between">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[9px] text-white/30">PHX</span>
                    <BurnBadge burns={2} />
                  </div>
                  <div className="h-8 w-px bg-white/10" />
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[9px] text-white/30">STR</span>
                    <BurnBadge burns={1} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team B roster */}
        <div className="col-span-3 f3">
          <div className="rounded-lg overflow-hidden" style={{ background: "#0a0a18", border: "1px solid rgba(0,212,255,0.15)" }}>
            <div className="px-3 py-2 flex items-center justify-between" style={{ background: "linear-gradient(270deg,rgba(0,212,255,0.12),transparent)", borderBottom: "1px solid rgba(0,212,255,0.08)" }}>
              <span className="text-xs font-bold" style={{ color: "#00D4FF" }}>{TEAM_B.tag}</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">Состав</span>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {TEAM_B.players.map((p) => <PlayerRow key={p.nick} player={p} side="right" teamColor={TEAM_B.color} />)}
            </div>
            <div className="px-3 py-1.5 flex justify-between" style={{ borderTop: "1px solid rgba(0,212,255,0.08)", background: "rgba(0,212,255,0.04)" }}>
              <span className="text-xs font-bold" style={{ color: "#00D4FF" }}>{TEAM_B.players.filter(p => p.alive).length} / 5</span>
              <span className="text-[10px] text-white/25 uppercase tracking-wider">В живых</span>
            </div>
          </div>
        </div>
      </div>

      {/* KILL LEADERBOARD */}
      <div className="mx-4 mb-4 rounded-lg p-4 f4" style={{ background: "#0a0a18", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2 mb-3">
          <Icon name="BarChart2" size={12} className="text-white/30" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/30">Топ по убийствам</span>
        </div>
        <div className="grid grid-cols-10 gap-2 items-end">
          {allPlayers.slice(0, 10).map((p, i) => {
            const isA = TEAM_A.players.includes(p);
            const color = isA ? TEAM_A.color : TEAM_B.color;
            const maxKills = allPlayers[0].kills;
            return (
              <div key={p.nick} className="flex flex-col items-center gap-1">
                <span className="text-[9px] text-white/20 font-mono">#{i + 1}</span>
                <div className="w-full flex items-end justify-center" style={{ height: 48 }}>
                  <div
                    className="w-full rounded-t"
                    style={{
                      height: `${(p.kills / maxKills) * 100}%`,
                      background: `linear-gradient(0deg,${color},${color}60)`,
                      boxShadow: `0 0 8px ${color}40`,
                    }}
                  />
                </div>
                <span className="text-xs font-bold font-mono text-white">{p.kills}</span>
                <span className="text-[9px] text-white/40 truncate w-full text-center" title={p.nick}>{p.nick.slice(0, 7)}</span>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-center pb-3">
        <span className="text-[8px] text-white/10 tracking-[0.5em] uppercase font-mono">TOURNAMENT BROADCAST • POWERED BY POEHALI.DEV</span>
      </div>
    </div>
  );
}
