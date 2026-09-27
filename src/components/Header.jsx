import { useState, useEffect } from "react";
import { Radio, Compass, Clock, Sliders, Database } from "lucide-react";

export default function Header({
  activeBasin,
  onSelectBasin,
  isSidebarOpen,
  onToggleSidebar
}) {
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
            <span className="badge-moes">MoES • SIH26067</span>
          </div>
          <p className="brand-sub">3D Interactive Ocean Model Output & In-Situ Observation Platform</p>
        </div>
      </div>

      {/* Basin quick jump chips */}
      <div className="basin-selector-nav">
        <div className="nav-label">
          <Compass size={13} />
          <span>BASIN</span>
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

      {/* Prototype System Status & Telemetry Clock */}
      <div className="header-telemetry">
        <div className="telemetry-pill prov-pill">
          <Database size={13} className="text-cyan" />
          <span className="telemetry-text">PROTOTYPE • SAMPLE DATA</span>
        </div>

        <div className="telemetry-clock">
          <Clock size={13} />
          <span>{utcTime || "CALCULATING UTC..."}</span>
        </div>

        {/* Mobile/Tablet sidebar toggle button */}
        <button
          className={`sidebar-toggle-btn ${isSidebarOpen ? "active" : ""}`}
          onClick={onToggleSidebar}
          title="Toggle Telemetry Sidebar"
        >
          <Sliders size={16} />
          <span className="btn-text">{isSidebarOpen ? "DATA PANEL" : "DATA PANEL"}</span>
        </button>
      </div>
    </header>
  );
}
