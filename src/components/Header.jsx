import { useState, useEffect } from "react";
import { Radio, Compass, Clock, ShieldCheck } from "lucide-react";

export default function Header({ activeBasin, onSelectBasin }) {
  const [utcTime, setUtcTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().replace("GMT", "UTC"));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const basins = [
    { id: "ALL", label: "Indian Ocean" },
    { id: "Arabian Sea", label: "Arabian Sea" },
    { id: "Bay of Bengal", label: "Bay of Bengal" },
    { id: "Equatorial Indian Ocean", label: "Equatorial Array" }
  ];

  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="brand-icon-wrapper">
          <div className="brand-pulse-ring" />
          <Radio className="brand-icon" size={20} />
        </div>
        <div>
          <div className="brand-title-row">
            <h1>BLUE VECTOR</h1>
            <span className="badge-sih">SIH 2026</span>
          </div>
          <p className="brand-sub">Autonomous Ocean Intelligence & In-Situ Validation Platform</p>
        </div>
      </div>

      {/* Basin quick jump chips */}
      <div className="basin-selector-nav">
        <div className="nav-label">
          <Compass size={13} />
          <span>BASIN FOCUS</span>
        </div>
        <div className="basin-chips">
          {basins.map((b) => (
            <button
              key={b.id}
              className={`basin-chip ${activeBasin === b.id ? "active" : ""}`}
              onClick={() => onSelectBasin(b.id)}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Live System Status & Telemetry Clock */}
      <div className="header-telemetry">
        <div className="telemetry-pill">
          <span className="live-pulse" />
          <span className="telemetry-text">6/6 BUOYS ONLINE</span>
        </div>

        <div className="telemetry-pill qc-pill">
          <ShieldCheck size={14} className="text-emerald" />
          <span>QC LEVEL-3 VERIFIED</span>
        </div>

        <div className="telemetry-clock">
          <Clock size={13} />
          <span>{utcTime || "CALCULATING UTC..."}</span>
        </div>
      </div>
    </header>
  );
}
