import { useMemo } from "react";
import {
  Thermometer,
  Droplets,
  Waves,
  Wind,
  Radio,
  ChevronRight,
  TrendingUp,
  Activity,
  Compass,
  Layers,
  Clock,
  MapPin,
  X,
  Scale
} from "lucide-react";
import {
  OCEAN_VARIABLES,
  DEPTH_PRESETS,
  TIME_STEPS,
  getDepthZone,
  computeOceanTelemetry
} from "../data/oceanData";

// Helper for parameter icons
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

// 24-Hour Synthetic Trend Sparkline Generator
function MiniSparkline({ baseValue, color, unit }) {
  const points = useMemo(() => {
    const pts = [];
    const count = 12;
    for (let i = 0; i < count; i++) {
      const offset = Math.sin((i / count) * Math.PI * 2) * 0.4 + Math.sin(i * 1.5) * 0.15;
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
        <span>24H SAMPLE VARIATION TREND ({unit})</span>
      </div>
      <svg viewBox="0 0 140 36" className="sparkline-svg">
        <defs>
          <linearGradient id="sparkGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${pathD} L 140 36 L 0 36 Z`} fill="url(#sparkGradient)" />
        <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
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
  onChangeDepth,
  timeStepIndex = 2,
  isOpen = true,
  onClose
}) {
  const depthZone = getDepthZone(depth);
  const activeVarConfig = OCEAN_VARIABLES.find((v) => v.id === activeVariable) || OCEAN_VARIABLES[0];
  const currentTimeStep = TIME_STEPS[timeStepIndex] || TIME_STEPS[0];

  // Dynamic telemetry calculated based on depth and time step
  const telemetry = useMemo(() => {
    if (!selectedStation) return null;
    return computeOceanTelemetry(selectedStation, depth, timeStepIndex);
  }, [selectedStation, depth, timeStepIndex]);

  // Primary active variable comparison metrics
  const primaryComparison = useMemo(() => {
    if (!telemetry || !selectedStation) return { observed: 0, model: 0, diff: 0, absDiff: 0, unit: "°C" };

    let observed = telemetry.temp;
    let model = telemetry.modelTemp;
    let diff = telemetry.diffTemp;
    let absDiff = telemetry.absDiffTemp;
    let unit = "°C";

    if (activeVariable === "Salinity") {
      observed = telemetry.salinity;
      model = telemetry.modelSalinity;
      diff = telemetry.diffSalinity;
      absDiff = telemetry.absDiffSalinity;
      unit = "PSU";
    } else if (activeVariable === "Currents") {
      observed = telemetry.current;
      model = telemetry.modelCurrent;
      diff = telemetry.diffCurrent;
      absDiff = telemetry.absDiffCurrent;
      unit = "m/s";
    } else if (activeVariable === "Oxygen") {
      observed = telemetry.oxygen;
      model = telemetry.modelOxygen;
      diff = telemetry.diffOxygen;
      absDiff = telemetry.absDiffOxygen;
      unit = "mg/L";
    }

    return { observed, model, diff, absDiff, unit };
  }, [telemetry, selectedStation, activeVariable]);

  if (!selectedStation || !telemetry) return null;

  return (
    <aside className={`control-sidebar ${isOpen ? "open" : "closed"}`}>
      {/* Mobile Drawer Header with Close Button */}
      <div className="mobile-drawer-header">
        <div className="drawer-title">
          <span className="live-dot" />
          <span>STATION DATA & MODEL COMPARISON</span>
        </div>
        {onClose && (
          <button className="drawer-close-btn" onClick={onClose} title="Close Panel">
            <X size={18} />
          </button>
        )}
      </div>

      {/* 1. Ocean Parameter Controls */}
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

      {/* 2. Depth Control & Vertical Stratification */}
      <section className="panel-card">
        <div className="card-header">
          <div className="card-title-group">
            <span className="card-tag">SAMPLE VERTICAL STRATIFICATION</span>
            <h2>Depth Profile (0–1000m)</h2>
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

        <p className="depth-sample-note" style={{ fontSize: "10px", color: "#64748b", margin: "-2px 0 8px", lineHeight: "1.4" }}>
          Interactive vertical profile based on prototype depth stratification (0–1000m sample data).
        </p>

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

      {/* 3. Station Data Panel (In-Situ Telemetry) */}
      <section className="panel-card station-telemetry-card">
        <div className="station-card-top">
          <div className="station-avatar">
            <Radio size={20} className="text-cyan" />
          </div>
          <div className="station-heading">
            <div className="station-code-row">
              <h3>{selectedStation.code}</h3>
              <span className="station-status-pill">
                <span className="live-dot" /> PROTOTYPE STATION
              </span>
            </div>
            <p className="station-fullname">{selectedStation.name}</p>
            <div className="station-meta-row">
              <span>{selectedStation.region}</span>
              <span>•</span>
              <span>
                {selectedStation.lat.toFixed(2)}° N, {selectedStation.lon.toFixed(2)}° E
              </span>
            </div>
          </div>
        </div>

        {/* Inspection metadata */}
        <div className="hardware-metrics">
          <div className="hw-item">
            <Clock size={12} className="text-cyan" />
            <span>Time: {currentTimeStep.fullLabel}</span>
          </div>
          <div className="hw-item">
            <Layers size={12} className="text-purple" />
            <span>Sample Depth: {depth} m</span>
          </div>
          <div className="hw-item">
            <MapPin size={12} className="text-cyan" />
            <span>Region: {selectedStation.region}</span>
          </div>
        </div>

        {/* Structured Station Data Summary Box (Feature 7) */}
        <div className="station-core-summary-box">
          <div className="summary-row">
            <span className="summary-label">Station:</span>
            <strong className="summary-value">{selectedStation.code}</strong>
          </div>
          <div className="summary-row">
            <span className="summary-label">Location:</span>
            <span className="summary-value">{selectedStation.region} ({selectedStation.lat.toFixed(1)}° N, {selectedStation.lon.toFixed(1)}° E)</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Selected Depth:</span>
            <span className="summary-value">{depth} m ({depthZone.name} • Sample)</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Selected Time:</span>
            <span className="summary-value">{currentTimeStep.fullLabel} ({currentTimeStep.stepLabel})</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Temperature:</span>
            <span className="summary-value highlight-temp">{telemetry.temp} °C</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Salinity:</span>
            <span className="summary-value highlight-sal">{telemetry.salinity} PSU</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Current Speed:</span>
            <span className="summary-value highlight-current">
              {telemetry.current} m/s ({selectedStation.currentDirection} @ {selectedStation.currentHeading}°)
            </span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Dissolved Oxygen:</span>
            <span className="summary-value">{telemetry.oxygen} mg/L</span>
          </div>
        </div>

        {/* 4 Sensor Telemetry Tiles */}
        <div className="telemetry-grid">
          {/* Tile 1: Temperature */}
          <div className={`telemetry-tile ${activeVariable === "Temperature" ? "primary-tile" : ""}`}>
            <div className="tile-top">
              <span className="tile-label">TEMPERATURE</span>
              <Thermometer size={14} className="text-amber" />
            </div>
            <div className="tile-value">
              {telemetry.temp}
              <small>°C</small>
            </div>
            <span className="tile-subtext">SAMPLE AT {depth}m • {currentTimeStep.label}</span>
          </div>

          {/* Tile 2: Salinity */}
          <div className={`telemetry-tile ${activeVariable === "Salinity" ? "primary-tile" : ""}`}>
            <div className="tile-top">
              <span className="tile-label">SALINITY</span>
              <Droplets size={14} className="text-cyan" />
            </div>
            <div className="tile-value">
              {telemetry.salinity}
              <small>PSU</small>
            </div>
            <span className="tile-subtext">HALOCLINE</span>
          </div>

          {/* Tile 3: Current Velocity & Direction */}
          <div className={`telemetry-tile ${activeVariable === "Currents" ? "primary-tile" : ""}`}>
            <div className="tile-top">
              <span className="tile-label">CURRENT</span>
              <Waves size={14} className="text-emerald" />
            </div>
            <div className="tile-value">
              {telemetry.current}
              <small>m/s</small>
            </div>
            <span className="tile-subtext">
              <Compass size={10} style={{ display: "inline", verticalAlign: "middle", marginRight: 2 }} />
              {selectedStation.currentDirection} ({selectedStation.currentHeading}°)
            </span>
          </div>

          {/* Tile 4: Dissolved Oxygen */}
          <div className={`telemetry-tile ${activeVariable === "Oxygen" ? "primary-tile" : ""}`}>
            <div className="tile-top">
              <span className="tile-label">DISSOLVED O₂</span>
              <Wind size={14} className="text-purple" />
            </div>
            <div className="tile-value">
              {telemetry.oxygen}
              <small>mg/L</small>
            </div>
            <span className="tile-subtext">WATER COLUMN</span>
          </div>
        </div>

        {/* 24h Sample Variation Sparkline */}
        <MiniSparkline
          baseValue={primaryComparison.observed}
          unit={primaryComparison.unit}
          color={activeVarConfig.color}
        />
      </section>

      {/* 4. Model vs Observation Comparison Panel (FEATURE 8 — HIGHEST PRIORITY) */}
      <section className="panel-card model-validation-card">
        <div className="card-header">
          <div className="card-title-group">
            <span className="card-tag">DATA COMPARISON</span>
            <h2>Model vs Observation Comparison</h2>
          </div>
          <span className="sample-badge">
            <Scale size={13} className="text-cyan" />
            <span>SAMPLE DATA</span>
          </span>
        </div>

        <p className="val-note">
          Comparison between prototype numerical model outputs and prototype observation values at {depth}m sample depth and {currentTimeStep.fullLabel}.
        </p>

        {/* Focused Variable Dual Comparison Display */}
        <div className="comparison-dual-row">
          <div className="comp-col">
            <span className="comp-col-label">MODEL</span>
            <div className="comp-col-val">
              {primaryComparison.model} <small>{primaryComparison.unit}</small>
            </div>
            <span className="comp-sub">Prototype Model Value</span>
          </div>

          <div className="comp-divider-vs">VS</div>

          <div className="comp-col">
            <span className="comp-col-label">OBSERVATION</span>
            <div className="comp-col-val text-cyan">
              {primaryComparison.observed} <small>{primaryComparison.unit}</small>
            </div>
            <span className="comp-sub">Prototype Observation Value</span>
          </div>
        </div>

        {/* Difference Summary */}
        <div className="difference-banner">
          <div className="diff-header">
            <span>Difference (Δ)</span>
            <span className="diff-val">
              {primaryComparison.diff > 0 ? `+${primaryComparison.diff}` : primaryComparison.diff} {primaryComparison.unit}
            </span>
          </div>
          <div className="diff-meter">
            <div
              className="diff-fill"
              style={{
                width: `${Math.min(100, primaryComparison.absDiff * 45)}%`,
                background: "#06b6d4"
              }}
            />
          </div>
          <div className="diff-footer">
            <span>Absolute Difference: {primaryComparison.absDiff} {primaryComparison.unit}</span>
            <span>Timeline Step: {currentTimeStep.label} UTC</span>
          </div>
        </div>

        {/* Comprehensive Multi-Parameter Comparison Table */}
        <div className="multi-param-table-wrapper">
          <div className="table-caption">ALL PARAMETERS COMPARISON TABLE</div>
          <table className="validation-table">
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Model</th>
                <th>Observation</th>
                <th>Difference (Δ)</th>
                <th>Absolute Difference</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Sea Temperature</strong> (°C)</td>
                <td>{telemetry.modelTemp}</td>
                <td>{telemetry.temp}</td>
                <td className="delta-neutral">
                  {telemetry.diffTemp > 0 ? `+${telemetry.diffTemp}` : telemetry.diffTemp}
                </td>
                <td>{telemetry.absDiffTemp}</td>
              </tr>
              <tr>
                <td><strong>Salinity</strong> (PSU)</td>
                <td>{telemetry.modelSalinity}</td>
                <td>{telemetry.salinity}</td>
                <td className="delta-neutral">
                  {telemetry.diffSalinity > 0 ? `+${telemetry.diffSalinity}` : telemetry.diffSalinity}
                </td>
                <td>{telemetry.absDiffSalinity}</td>
              </tr>
              <tr>
                <td><strong>Current Velocity</strong> (m/s)</td>
                <td>{telemetry.modelCurrent}</td>
                <td>{telemetry.current}</td>
                <td className="delta-neutral">
                  {telemetry.diffCurrent > 0 ? `+${telemetry.diffCurrent}` : telemetry.diffCurrent}
                </td>
                <td>{telemetry.absDiffCurrent}</td>
              </tr>
              <tr>
                <td><strong>Dissolved Oxygen</strong> (mg/L)</td>
                <td>{telemetry.modelOxygen}</td>
                <td>{telemetry.oxygen}</td>
                <td className="delta-neutral">
                  {telemetry.diffOxygen > 0 ? `+${telemetry.diffOxygen}` : telemetry.diffOxygen}
                </td>
                <td>{telemetry.absDiffOxygen}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. Observation Fleet Station Switcher */}
      <section className="panel-card fleet-card">
        <div className="card-header">
          <div className="card-title-group">
            <span className="card-tag">SAMPLE STATIONS</span>
            <h2>Sample Station Fleet ({stations.length})</h2>
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
                  <span className="status-indicator status-station" />
                  <div>
                    <strong>{st.code}</strong>
                    <small>{st.name}</small>
                  </div>
                </div>

                <div className="station-row-right">
                  <span className="station-val">
                    {activeVariable === "Temperature" && `${st.temp} °C`}
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
