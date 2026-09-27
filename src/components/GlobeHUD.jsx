import { useState } from "react";
import { Play, Pause, RotateCcw, Layers, Eye, EyeOff, MapPin, Gauge, Clock } from "lucide-react";
import { getDepthZone, TIME_STEPS } from "../data/oceanData";

export default function GlobeHUD({
  selectedStation,
  isRotating,
  onToggleRotate,
  onResetView,
  showClouds,
  onToggleClouds,
  showCurrents,
  onToggleCurrents,
  showAtmosphere,
  onToggleAtmosphere,
  depth,
  timeStepIndex = 2,
  activeVariableConfig
}) {
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const depthZone = getDepthZone(depth);
  const currentStep = TIME_STEPS[timeStepIndex] || TIME_STEPS[0];

  const formatCoord = (val, isLat) => {
    const dir = isLat ? (val >= 0 ? "N" : "S") : (val >= 0 ? "E" : "W");
    return `${Math.abs(val).toFixed(2)}° ${dir}`;
  };

  return (
    <div className="globe-hud-overlay">
      {/* Top Left: Active Basin & Geographic Focus */}
      <div className="hud-top-left">
        <div className="hud-panel basin-card">
          <div className="hud-pill">
            <span className="live-dot" />
            <span>INDIAN OCEAN REGION</span>
          </div>
          <h3>{selectedStation ? (selectedStation.region || selectedStation.basin).toUpperCase() : "INDIAN OCEAN BASIN"}</h3>
          <div className="coords-display">
            <MapPin size={13} className="text-cyan" />
            <span>
              {selectedStation
                ? `${formatCoord(selectedStation.lat, true)}, ${formatCoord(selectedStation.lon, false)}`
                : "12.00° N, 78.00° E"}
            </span>
          </div>
          <div className="hud-station-tag">
            <span>Station: <strong>{selectedStation ? `${selectedStation.code} • ${selectedStation.name}` : "None"}</strong></span>
          </div>
        </div>
      </div>

      {/* Top Right: Globe Controls & Layer Toggles */}
      <div className="hud-top-right">
        <div className="hud-toolbar">
          {/* Rotate / Pause */}
          <button
            className={`hud-btn ${isRotating ? "active" : ""}`}
            onClick={onToggleRotate}
            title={isRotating ? "Pause Earth Rotation" : "Resume Earth Rotation"}
          >
            {isRotating ? <Pause size={15} /> : <Play size={15} />}
            <span>{isRotating ? "PAUSE" : "ROTATE"}</span>
          </button>

          {/* Reset Camera View */}
          <button
            className="hud-btn"
            onClick={onResetView}
            title="Reset Camera to Indian Ocean"
          >
            <RotateCcw size={15} />
            <span>RESET</span>
          </button>

          {/* Layer Controls Dropdown */}
          <div className="layer-menu-container">
            <button
              className={`hud-btn ${showLayerMenu ? "active" : ""}`}
              onClick={() => setShowLayerMenu(!showLayerMenu)}
              title="Toggle Globe Overlays"
            >
              <Layers size={15} />
              <span>LAYERS</span>
            </button>

            {showLayerMenu && (
              <div className="layer-dropdown">
                <div className="dropdown-header">3D GLOBE OVERLAYS</div>

                <button
                  className="dropdown-item"
                  onClick={onToggleClouds}
                >
                  {showClouds ? <Eye size={13} className="text-cyan" /> : <EyeOff size={13} />}
                  <span>Cloud Cover</span>
                </button>

                <button
                  className="dropdown-item"
                  onClick={onToggleCurrents}
                >
                  {showCurrents ? <Eye size={13} className="text-cyan" /> : <EyeOff size={13} />}
                  <span>Animated Current Streamlines & Vectors</span>
                </button>

                <button
                  className="dropdown-item"
                  onClick={onToggleAtmosphere}
                >
                  {showAtmosphere ? <Eye size={13} className="text-cyan" /> : <EyeOff size={13} />}
                  <span>Atmospheric Glow</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Left: Dynamic Variable Legend Scale & Depth Zone */}
      <div className="hud-bottom-left">
        <div className="hud-panel legend-panel">
          <div className="legend-header">
            <div className="legend-title">
              <Gauge size={13} className="text-cyan" />
              <span>{activeVariableConfig.label.toUpperCase()}</span>
            </div>
            <span className="depth-zone-badge" style={{ borderColor: depthZone.color, color: depthZone.color }}>
              {depthZone.code} • Sample {depth}m
            </span>
          </div>

          <div className="legend-bar-wrapper">
            <span className="legend-tick">{activeVariableConfig.min} {activeVariableConfig.unit}</span>
            <div
              className="legend-gradient"
              style={{ background: activeVariableConfig.gradient }}
            />
            <span className="legend-tick">{activeVariableConfig.max} {activeVariableConfig.unit}</span>
          </div>

          <div className="legend-footer-row">
            <div className="legend-desc">
              {depthZone.name}
            </div>
            <div className="legend-time-badge">
              <Clock size={11} className="text-cyan" />
              <span>{currentStep.label} UTC</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Center: Gesture Instructions */}
      <div className="hud-bottom-center">
        <div className="interaction-tip">
          <span className="tip-dot" />
          <span>DRAG TO ROTATE • SCROLL TO ZOOM • CLICK BUOY TO SELECT</span>
        </div>
      </div>
    </div>
  );
}
