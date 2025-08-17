import React, { useEffect, useMemo, useRef, useState } from "react";

// 👉 Put your three images in /public and use those paths:
const WALLPAPERS = [
                      "/7fedff9aab09413f30711c500e2b07ce.jpg", 
                      "/d0a44e04864daa008ee8a3803dd1abe4.jpg", 
                      "/375fff127fbc42ea2c95ad3118c779ba.jpg", 
                      "/3c6efe60e326157d72ff4ef31e7a789e.jpg", 
                      '/4d21575094429dacf4750b22cfaa99de.jpg', 
                      '/543d8b0302b4ffb7231227fbe4d58468.jpg', 
                      '/59270e918760cb811226e6901706643f.jpg', 
                      '/5c9579311801730d7c67e861136fe9cf.jpg', 
                      '/7fedff9aab09413f30711c500e2b07ce.jpg', 
                      '/_.jpeg', 
                      '/ab36f0eabb3979e104a122a7fa4330e0.jpg', 
                      '/af184a5bfc0ddffeaeecd9459eb0a1ac.jpg', 
                      '/b45381505ff89aa0d66179570fa13e2a.jpg', 
                      '/b45381505ff89aa0d66179570fa13e2a.jpg', 
                      '/b49026185e6892587b236a0da0feeb2a.jpg', 
                      '/be4345358b39fed4d88c8044c6ba4852.jpg', 
                      '/cb1b968312201131e0010d1a1565e04a.jpg', 
                      '/d0a44e04864daa008ee8a3803dd1abe4.jpg', 
                      '/d13556ec053cffc2410a682ee33436d6.jpg', 
                      '/d914b30f-9f46-4909-b636-4b26d4ec3646.jpeg', 
                      '/d9b9c6935ce4a5025e4fd5ac37b5c3bc.jpg', 
                      '/✰𝐘𝐄𝐀𝐆𝐄𝐑𝐍𝐗.jpeg', 
                      '/⚝•.jpeg', 
                      '/The closest known black hole to Earth is just….jpeg', 
                      '/ohtani.jpeg', 
                      '/howls moving castle.jpeg', 
                      '/home.jpg', 
                      '/home.jpeg', 
                      '/going merry.jpg', 
                      '/girl2.jpg', 
                      '/girl1.jpeg', 
                      '/girl.jpg', 
                      '/fb7fec8ebd2caf9a96d39e6a9d1acaae.jpg', 
                      '/deck.jpeg',]; 
// (e.g. copy your images as: public/wall1.jpg, public/wall2.jpg, public/wall3.jpg)

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function App() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("focusLogs") || "[]");
    } catch {
      return [];
    }
  });
  const [wallIndex, setWallIndex] = useState(Math.floor(Math.random() * WALLPAPERS.length));

  const totalSeconds = useMemo(
    () => logs.reduce((sum, x) => sum + x.seconds, 0),
    [logs]
  );

  // tick
  const intervalRef = useRef(null);
  useEffect(() => {
    if (running && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    if (!running && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [running]);

  // persist logs
  useEffect(() => {
    localStorage.setItem("focusLogs", JSON.stringify(logs));
  }, [logs]);

  const handleStartPause = () => setRunning((v) => !v);

  const handleReset = () => {
    setSeconds(0);
    setRunning(false);
  };

  // Log current elapsed time, restart timer from 0 and keep it running
  const handleLogSave = () => {
    if (seconds === 0) return;
    setLogs((prev) => [
      { id: crypto.randomUUID(), seconds, at: new Date().toISOString() },
      ...prev,
    ]);
    setSeconds(0);
    setRunning(false); // “restart the clock”
  };

  const nextWallpaper = () =>
    setWallIndex(Math.floor(Math.random() * WALLPAPERS.length));

  const prevWallpaper = () =>
    setWallIndex(prev => prev - 1);

  return (
    <div
      style={{
        minHeight: "100svh",
        display: "grid",
        gridTemplateColumns: "1fr min(360px, 35%)",
      }}
    >
      <div style={{
              position: "fixed",      // keep it pinned
              top: "1rem",            // spacing from top
              left: "40%",            // center horizontally
              transform: "translateX(-50%)",
              opacity: 0.9,
              fontSize: "2rem",       // roughly h2 size
              fontWeight: "bold",     // h2 has bold by default
              zIndex: 1000,           // keep it above other content
              color: "whitesmoke"
           }}
      >
  Time to focus.
</div>
      {/* LEFT: Timer with wallpaper */}
      <div
        style={{
          position: "relative",
          backgroundImage: `url(${WALLPAPERS[wallIndex]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "grid",
          placeItems: "center",
          padding: "2rem",
        }}
      >
        <div
          style={{
            backdropFilter: "blur(.1px) saturate(2)",
            background: "rgba(0,0,0,0.35)",
            color: "white",
            borderRadius: "50%",
            width: "40vmin",   // scales with viewport
            height: "40vmin",  // equal to width -> circle
            display: "grid",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            padding: "2rem",   // inside spacing
          }}
        >
          <div style={{ fontSize: "clamp(3rem, 13vw, 9rem)", fontWeight: 800, letterSpacing: 1, paddingTop: "9rem", }}>
            {formatTime(seconds)}
          </div>
          

          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={handleStartPause}
              style={btnStyle("white", "#111")}
              aria-label={running ? "Pause" : "Start"}
            >
              {running ? "Pause" : "Start"}
            </button>
            <button onClick={handleLogSave} style={btnStyle("#10b981", "white")}>
              Log / Save & Restart
            </button>
          </div>
        

          
        </div>
          <div style={{ position: "fixed",         // fixes it to the viewport
                        bottom: "4rem",            // distance from bottom
                        left: "40%",               // center horizontally
                        transform: "translateX(-50%)", // actually center it
                        display: "flex",
                        gap: ".5rem",
                        justifyContent: "center",
                        zIndex: 1000,     
                      }}>
            <button onClick={prevWallpaper} style={chipStyle}>
              ◀︎ Wallpaper
            </button>
            <button onClick={nextWallpaper} style={chipStyle}>
              Wallpaper ▶︎
            </button>
          </div>

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.35) 100%)",
            pointerEvents: "none",
          }}
        />
      </div>


      {/* RIGHT: Log panel */}
      <aside
        style={{
          background: "#0f172a", // slate-900
          color: "white",
          padding: "1.25rem",
          overflowY: "auto",
        }}
      >
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: ".75rem" }}>
          Focus Log
        </h2>

        <div style={{ marginBottom: ".75rem", opacity: 0.9 }}>
          Sessions: <b>{logs.length}</b> • Total:{" "}
          <b>{formatTime(totalSeconds)}</b>
        </div>

        {logs.length === 0 ? (
          <p style={{ opacity: 0.8 }}>No sessions yet. Press “Log / Save & Restart”.</p>
        ) : (
          <ul style={{ display: "grid", gap: ".5rem", listStyle: "none", padding: 0 }}>
            {logs.map((l, i) => (
              <li
                key={l.id}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 10,
                  padding: ".75rem .9rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ opacity: 0.9 }}>#{logs.length - i}</span>
                <span style={{ fontVariantNumeric: "tabular-nums", fontWeight: 700 }}>
                  {formatTime(l.seconds)}
                </span>
                <time
                  dateTime={l.at}
                  style={{ fontSize: ".8rem", opacity: 0.8 }}
                  title={new Date(l.at).toLocaleString()}
                >
                  {new Date(l.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </time>
              </li>
            ))}
          </ul>
        )}

        {logs.length > 0 && (
          <button
            onClick={() => setLogs([])}
            style={{ ...btnStyle("transparent", "white"), width: "100%", marginTop: "1rem", border: "1px solid rgba(255,255,255,0.2)" }}
          >
            Clear Log
          </button>
        )}
      </aside>
    </div>
  );
}

// ——— styles ———
function btnStyle(bg, fg) {
  return {
    background: bg,
    color: fg,
    border: "none",
    borderRadius: 999,
    padding: ".65rem 1.1rem",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
  };
}
const chipStyle = {
  background: "rgba(255,255,255,0.15)",
  color: "white",
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: 999,
  padding: ".35rem .8rem",
  cursor: "pointer",
};