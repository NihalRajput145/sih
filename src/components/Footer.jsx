import { Satellite, Globe } from "lucide-react";

export default function Footer({ selectedStation, depth }) {
  return (
    <footer className="app-footer">
      <div className="footer-left">
        <Satellite size={13} className="text-cyan" />
        <span>DATA FEED: INCOIS / NIOT OMNI ARRAY • RAMA MOORINGS • ARGO FLOATS</span>
      </div>

      <div className="footer-center">
        <span className="footer-pill">
          <Globe size={12} className="text-cyan" />
          <span>{selectedStation ? `${selectedStation.basin} [${selectedStation.code}]` : "INDIAN OCEAN"}</span>
        </span>
        <span className="footer-divider">•</span>
        <span>DEPTH {depth}m</span>
      </div>

      <div className="footer-right">
        <span className="footer-tag">SIH 2026</span>
        <span className="footer-tag">WEBGL 2.0</span>
        <span className="text-muted">OCEAN INTELLIGENCE PROTOTYPE</span>
      </div>
    </footer>
  );
}
