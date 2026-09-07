import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";
import "./App.css";

const stations = [
  { name: "BOUY-001", lat: 15, lon: 72, temp: 28.4, salinity: 35.1, depth: 50 },
  { name: "BOUY-002", lat: 8, lon: 80, temp: 27.8, salinity: 34.7, depth: 100 },
  { name: "BOUY-003", lat: 20, lon: 88, temp: 29.1, salinity: 34.3, depth: 25 },
  { name: "BOUY-004", lat: -5, lon: 75, temp: 26.9, salinity: 35.4, depth: 150 },
];

function latLonToVector3(lat, lon, radius = 2.05) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function Earth({ onSelect }) {
  const earth = useRef();

  useFrame(() => {
    earth.current.rotation.y += 0.0015;
  });

  return (
    <group ref={earth}>
      <mesh>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          color="#075985"
          roughness={0.65}
          metalness={0.15}
        />
      </mesh>

      {/* Atmosphere */}
      <mesh scale={1.04}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>

      {stations.map((station) => {
        const position = latLonToVector3(station.lat, station.lon);

        return (
          <group
            key={station.name}
            position={position}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(station);
            }}
          >
            <mesh>
              <sphereGeometry args={[0.055, 16, 16]} />
              <meshBasicMaterial color="#f59e0b" />
            </mesh>

            <mesh scale={1.8}>
              <sphereGeometry args={[0.055, 16, 16]} />
              <meshBasicMaterial
                color="#fbbf24"
                transparent
                opacity={0.15}
              />
            </mesh>
          </group>
        );
      })}

      {/* Ocean current arrows */}
      {[...Array(18)].map((_, i) => {
        const angle = (i / 18) * Math.PI * 2;

        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * 1.98,
              Math.sin(i * 1.7) * 0.7,
              Math.sin(angle) * 1.98,
            ]}
            rotation={[0, angle, 0]}
          >
            <boxGeometry args={[0.35, 0.018, 0.018]} />
            <meshBasicMaterial color="#22d3ee" />
          </mesh>
        );
      })}
    </group>
  );
}

function App() {
  const [selected, setSelected] = useState(stations[0]);
  const [depth, setDepth] = useState(50);
  const [variable, setVariable] = useState("Temperature");

  return (
    <div className="app">
      <header>
        <div>
          <h1>BLUE VECTOR</h1>
          <p>Interactive Ocean Intelligence Platform</p>
        </div>

        <div className="status">
          ● SYSTEM ONLINE
        </div>
      </header>

      <main>
        <section className="globe">
          <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
            <ambientLight intensity={1.2} />
            <directionalLight position={[5, 5, 5]} intensity={2} />

            <Stars
              radius={80}
              depth={50}
              count={1500}
              factor={3}
              saturation={0}
              fade
            />

            <Earth onSelect={setSelected} />

            <OrbitControls
              enablePan={false}
              minDistance={3.5}
              maxDistance={8}
            />
          </Canvas>

          <div className="globe-label">
            <span>🌊</span>
            INDIAN OCEAN
          </div>
        </section>

        <aside>
          <div className="panel">
            <h2>Ocean Controls</h2>

            <label>VARIABLE</label>

            <div className="buttons">
              {["Temperature", "Salinity", "Currents"].map((item) => (
                <button
                  className={variable === item ? "active" : ""}
                  onClick={() => setVariable(item)}
                  key={item}
                >
                  {item}
                </button>
              ))}
            </div>

            <label>DEPTH — {depth}m</label>

            <input
              type="range"
              min="0"
              max="500"
              value={depth}
              onChange={(e) => setDepth(e.target.value)}
            />
          </div>

          <div className="panel station">
            <div className="station-title">
              <span>📍</span>
              <div>
                <h2>{selected.name}</h2>
                <small>IN-SITU OBSERVATION</small>
              </div>
            </div>

            <div className="stats">
              <div>
                <small>TEMPERATURE</small>
                <strong>{selected.temp}°C</strong>
              </div>

              <div>
                <small>SALINITY</small>
                <strong>{selected.salinity} PSU</strong>
              </div>

              <div>
                <small>DEPTH</small>
                <strong>{selected.depth} m</strong>
              </div>

              <div>
                <small>CURRENT</small>
                <strong>1.24 m/s</strong>
              </div>
            </div>
          </div>

          <div className="panel comparison">
            <h2>Model vs Observation</h2>

            <div className="compare">
              <span>Model</span>
              <b>27.8°C</b>
            </div>

            <div className="compare">
              <span>Observed</span>
              <b>28.4°C</b>
            </div>

            <div className="difference">
              +0.6°C difference
            </div>
          </div>
        </aside>
      </main>

      <footer>
        <span>BLUE VECTOR</span>
        <span>Ocean Data Visualization • SIH 2026 • Prototype</span>
      </footer>
    </div>
  );
}

export default App;