import { useMemo } from "react";
import {
  Thermometer,
  Droplets,
  Waves,
  Wind,
  Radio,
  Battery,
  Wifi,
  ChevronRight,
  TrendingUp,
  Activity,
  CheckCircle2
} from "lucide-react";
import {
  OCEAN_VARIABLES,
  DEPTH_PRESETS,
  getDepthZone,
  computeDepthTelemetry
} from "../data/stations";

// Helper for dynamic icons
function VariableIcon({ name, size = 16, className = "" }) {
  switch (name) {
    case "Thermometer":
      return <Thermometer size={size} className={className} />;
    case "Droplets":
      return <Droplets size={size} className={className} />;
    case "Waves":
      return <Waves size={size} className={className} />;
    case "Wind":
      return <Wind size={size} className={className} />;
    default:
      return <Activity size={size} className={className} />;
  }
}

// Mini Sparkline Generator
function MiniSparkline({ baseValue, color }) {
  const points = useMemo(() => {
    const pts = [];
    const count = 12;
    for (let i = 0; i < count; i++) {
      // Natural diurnal variation curve
      const offset = Math.sin((i / count) * Math.PI * 2) * 0.4 + (Math.sin(i * 1.5) * 0.15);
      const val = baseValue + offset;
      pts.push({ x: (i / (count - 1)) * 140, y: 30 - ((val - (baseValue - 0.6)) / 1.2) * 24 });
    }
    return pts;
  }, [baseValue]);

  const pathD = useMemo(() => {
    return points.reduce((acc, pt, i) => `${acc} ${i === 0 ? "M" : "L"} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`, "");
  }, [points]);

  return (
    <div className="sparkline-wrapper">
      <div className="sparkline-label">
        <TrendingUp size={12} className="text-cyan" />
        <span>24H DIURNAL TREND</span>
      </div>
      <svg viewBox="0 0 140 36" className="sparkline-svg">
        <defs>
          <linearGradient id="sparkGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Fill area */}
        <path
          d={`${pathD} L 140 36 L 0 36 Z`}
          fill="url(#sparkGradient)"
        />
        {/* Line stroke */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Last point pulse */}
        {points.length > 0 && (
          <circle
            cx={points[points.length - 1].x}
            cy={points[points.length - 1].y}
            r="3"
            fill={color}
          />
        )}
      </svg>
    </div>
  );
}

export default function ControlPanel({
  stations,
  selectedStation,
  onSelectStation,
  activeVariable,
  onSelectVariable,
  depth,
  onChangeDepth
}) {
  const depthZone = getDepthZone(depth);
  const activeVarConfig = OCEAN_VARIABLES.find((v) => v.id === activeVariable) || OCEAN_VARIABLES[0];

  // Dynamic telemetry calculated based on depth
  const telemetry = useMemo(() => {
    if (!selectedStation) return null;
    return computeDepthTelemetry(selectedStation, depth);
  }, [selectedStation, depth]);

  // Model comparison metrics
  const modelComparison = useMemo(() => {
    if (!telemetry || !selectedStation) return { observed: 0, model: 0, diff: 0, accuracy: 98 };

    let observed = telemetry.temp;
    let model = telemetry.modelTemp;
    let unit = "°C";

    if (activeVariable === "Salinity") {
      observed = telemetry.salinity;
      model = telemetry.modelSalinity;
      unit = "PSU";
    } else if (activeVariable === "Currents") {
      observed = telemetry.current;
      model = telemetry.modelCurrent;
      unit = "m/s";
    } else if (activeVariable === "Oxygen") {
      observed = telemetry.oxygen;
      model = telemetry.modelOxygen;
      unit = "mg/L";
    }

    const diff = Number((observed - model).toFixed(2));
    const absDiff = Math.abs(diff);
    const accuracy = Math.max(90, (100 - (absDiff / Math.max(observed, 1)) * 100)).toFixed(1);

    return { observed, model, diff, unit, accuracy };
  }, [telemetry, selectedStation, activeVariable]);

  if (!selectedStation || !telemetry) return null;

  return (
    <aside className="control-sidebar">
      {/* 1. Ocean Variables Selector */}
      <section className="panel-card">
        <div className="card-header">
          <div className="card-title-group">
            <span className="card-tag">PHYSICAL PARAMETER</span>
            <h2>Ocean Variable</h2>
          </div>
          <span className="unit-badge">{activeVarConfig.unit}</span>
        </div>

        <div className="variable-grid">
          {OCEAN_VARIABLES.map((v) => {
            const isActive = activeVariable === v.id;
            return (
              <button
                key={v.id}
                className={`variable-tab ${isActive ? "active" : ""}`}
                onClick={() => onSelectVariable(v.id)}
              >
                <VariableIcon
                  name={v.icon}
                  size={16}
                  className={isActive ? "text-cyan" : "text-muted"}
                />
                <span>{v.label}</span>
              </button>
            );
          })}
        </div>

        <p className="param-description">{activeVarConfig.description}</p>
      </section>

      {/* 2. Depth Profile Slider & Zonation */}
      <section className="panel-card">
        <div className="card-header">
          <div className="card-title-group">
            <span className="card-tag">VERTICAL STRATIFICATION</span>
            <h2>Depth Profile</h2>
          </div>
          <div
            className="depth-badge"
            style={{ borderColor: depthZone.color, color: depthZone.color }}
          >
            {depth}m
          </div>
        </div>

        <div className="depth-zone-meta">
          <span className="zone-indicator" style={{ background: depthZone.color }} />
          <span>{depthZone.name}</span>
          <span className="pressure-readout">• {telemetry.pressure} bar</span>
        </div>

        <div className="slider-wrapper">
          <input
            type="range"
            min="0"
            max="1000"
            step="5"
            value={depth}
            onChange={(e) => onChangeDepth(Number(e.target.value))}
            className="depth-range-slider"
          />
          <div className="slider-ticks">
            <span>0m (Surface)</span>
            <span>250m</span>
            <span>500m</span>
            <span>750m</span>
            <span>1000m (Deep)</span>
          </div>
        </div>

        {/* Quick Depth Presets */}
        <div className="depth-presets">
          {DEPTH_PRESETS.map((p) => (
            <button
              key={p.depth}
              className={`preset-btn ${depth === p.depth ? "active" : ""}`}
              onClick={() => onChangeDepth(p.depth)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </section>

      {/* 3. In-Situ Station Telemetry Card */}
      <section className="panel-card station-telemetry-card">
        <div className="station-card-top">
          <div className="station-avatar">
            <Radio size={20} className="text-cyan" />
          </div>
          <div className="station-heading">
            <div className="station-code-row">
              <h3>{selectedStation.code}</h3>
              <span className="station-status-pill">
                <span className="live-dot" /> LIVE
              </span>
            </div>
            <p className="station-fullname">{selectedStation.name}</p>
            <div className="station-meta-row">
              <span>{selectedStation.basin}</span>
              <span>•</span>
              <span>
                {selectedStation.lat.toFixed(1)}°N, {selectedStation.lon.toFixed(1)}°E
              </span>
            </div>
          </div>
        </div>

        {/* Station hardware status metrics */}
        <div className="hardware-metrics">
          <div className="hw-item">
            <Wifi size={12} className="text-cyan" />
            <span>Signal: {selectedStation.signal}%</span>
          </div>
          <div className="hw-item">
            <Battery size={12} className="text-emerald" />
            <span>Battery: {selectedStation.battery}%</span>
          </div>
          <div className="hw-item">
            <span className="text-muted">Updated: {selectedStation.lastTransmission}</span>
          </div>
        </div>

        {/* 4 Sensor Telemetry Tiles */}
        <div className="telemetry-grid">
          {/* Tile 1: Primary Selected Parameter */}
          <div className="telemetry-tile primary-tile">
            <div className="tile-top">
              <span className="tile-label">{activeVarConfig.label.toUpperCase()}</span>
              <VariableIcon name={activeVarConfig.icon} size={14} className="text-cyan" />
            </div>
            <div className="tile-value">
              {modelComparison.observed}
              <small>{modelComparison.unit}</small>
            </div>
            <span className="tile-subtext">AT {depth}m DEPTH</span>
          </div>

          {/* Tile 2: Salinity */}
          <div className="telemetry-tile">
            <div className="tile-top">
              <span className="tile-label">SALINITY</span>
              <Droplets size={14} className="text-cyan" />
            </div>
            <div className="tile-value">
              {telemetry.salinity}
              <small>PSU</small>
            </div>
            <span className="tile-subtext">CONDUCTIVITY</span>
          </div>

          {/* Tile 3: Current Velocity */}
          <div className="telemetry-tile">
            <div className="tile-top">
              <span className="tile-label">CURRENT</span>
              <Waves size={14} className="text-emerald" />
            </div>
            <div className="tile-value">
              {telemetry.current}
              <small>m/s</small>
            </div>
            <span className="tile-subtext">DRIFT VECTOR</span>
          </div>

          {/* Tile 4: Dissolved Oxygen */}
          <div className="telemetry-tile">
            <div className="tile-top">
              <span className="tile-label">DISSOLVED O₂</span>
              <Wind size={14} className="text-purple" />
            </div>
            <div className="tile-value">
              {telemetry.oxygen}
              <small>mg/L</small>
            </div>
            <span className="tile-subtext">OMZ SENSOR</span>
          </div>
        </div>

        {/* 24h Diurnal Trend Sparkline */}
        <MiniSparkline
          baseValue={modelComparison.observed}
          unit={modelComparison.unit}
          color={activeVarConfig.color}
        />
      </section>

      {/* 4. Model vs Observation Validation Card */}
      <section className="panel-card model-validation-card">
        <div className="card-header">
          <div className="card-title-group">
            <span className="card-tag">VALIDATION ENGINE</span>
            <h2>Model vs Observation</h2>
          </div>
          <span className="qc-check-pill">
            <CheckCircle2 size={13} className="text-emerald" />
            <span>ROMS VALIDATED</span>
          </span>
        </div>

        <div className="comparison-dual-row">
          <div className="comp-col">
            <span className="comp-col-label">NUMERICAL MODEL</span>
            <div className="comp-col-val">
              {modelComparison.model} <small>{modelComparison.unit}</small>
            </div>
            <span className="comp-sub">ROMS / HYCOM Forecast</span>
          </div>

          <div className="comp-divider-vs">VS</div>

          <div className="comp-col">
            <span className="comp-col-label">IN-SITU OBSERVATION</span>
            <div className="comp-col-val text-cyan">
              {modelComparison.observed} <small>{modelComparison.unit}</small>
            </div>
            <span className="comp-sub">Moored Array Sensor</span>
          </div>
        </div>

        <div className="difference-banner">
          <div className="diff-header">
            <span>DIVERGENCE DELTA (Δ)</span>
            <span className="diff-val">
              {modelComparison.diff > 0 ? `+${modelComparison.diff}` : modelComparison.diff} {modelComparison.unit}
            </span>
          </div>
          <div className="diff-meter">
            <div
              className="diff-fill"
              style={{
                width: `${Math.min(100, Math.abs(modelComparison.diff) * 40)}%`,
                background: Math.abs(modelComparison.diff) < 0.8 ? "#10b981" : "#f59e0b"
              }}
            />
          </div>
          <div className="diff-footer">
            <span>Confidence: {modelComparison.accuracy}%</span>
            <span>Bias: {(modelComparison.diff / Math.max(1, modelComparison.observed) * 100).toFixed(1)}%</span>
          </div>
        </div>
      </section>

      {/* 5. Station Fleet Quick Switcher */}
      <section className="panel-card fleet-card">
        <div className="card-header">
          <div className="card-title-group">
            <span className="card-tag">TELEMETRY NETWORK</span>
            <h2>Active Buoy Array ({stations.length})</h2>
          </div>
        </div>

        <div className="station-list">
          {stations.map((st) => {
            const isSelected = selectedStation.id === st.id;
            return (
              <button
                key={st.id}
                className={`station-row-item ${isSelected ? "selected" : ""}`}
                onClick={() => onSelectStation(st)}
              >
                <div className="station-row-left">
                  <span className={`status-indicator ${st.qcStatus === "PASSED" ? "status-online" : "status-warning"}`} />
                  <div>
                    <strong>{st.code}</strong>
                    <small>{st.basin}</small>
                  </div>
                </div>

                <div className="station-row-right">
                  <span className="station-val">
                    {activeVariable === "Temperature" && `${st.temp}°C`}
                    {activeVariable === "Salinity" && `${st.salinity} PSU`}
                    {activeVariable === "Currents" && `${st.current} m/s`}
                    {activeVariable === "Oxygen" && `${st.oxygen} mg/L`}
                  </span>
                  <ChevronRight size={14} className="text-muted" />
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </aside>
  );
}
