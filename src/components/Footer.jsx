import { Database, Globe, Clock, Layers } from "lucide-react";
import { TIME_STEPS } from "../data/oceanData";

export default function Footer({ selectedStation, depth, timeStepIndex = 2 }) {
  const currentStep = TIME_STEPS[timeStepIndex] || TIME_STEPS[0];

  return (
    <footer className="app-footer">
      <div className="footer-left">
        <Database size={13} className="text-cyan" />
        <span>PROTOTYPE SAMPLE DATASET • Ministry of Earth Sciences (MoES) • SIH26067</span>
      </div>

      <div className="footer-center">
        <span className="footer-pill">
          <Globe size={12} className="text-cyan" />
          <span>{selectedStation ? `${selectedStation.code} • ${selectedStation.region || selectedStation.basin}` : "INDIAN OCEAN"}</span>
        </span>
        <span className="footer-divider">•</span>
        <span className="footer-pill">
          <Layers size={12} className="text-purple" />
          <span>SAMPLE DEPTH: {depth}m</span>
        </span>
        <span className="footer-divider">•</span>
        <span className="footer-pill">
          <Clock size={12} className="text-cyan" />
          <span>TIME: {currentStep.fullLabel}</span>
        </span>
      </div>

      <div className="footer-right">
        <span className="footer-tag">SIH 2026</span>
        <span className="footer-tag">SIH26067</span>
        <span className="text-muted">WEBGL 3D PROTOTYPE</span>
      </div>
    </footer>
  );
}
