import { useState, useRef, Suspense, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import EarthGlobe from "./components/EarthGlobe";
import Header from "./components/Header";
import ControlPanel from "./components/ControlPanel";
import GlobeHUD from "./components/GlobeHUD";
import TimelineControl from "./components/TimelineControl";
import Footer from "./components/Footer";
import { STATIONS, OCEAN_VARIABLES } from "./data/oceanData";
import "./App.css";

// 3D Canvas Fallback Loader
function CanvasLoader() {
  return (
    <mesh>
      <sphereGeometry args={[2.0, 32, 32]} />
      <meshStandardMaterial
        color="#082f49"
        wireframe
        roughness={0.8}
      />
    </mesh>
  );
}

function App() {
  const [stations] = useState(STATIONS);
  const [selectedStation, setSelectedStation] = useState(STATIONS[0]);
  const [depth, setDepth] = useState(50);
  const [timeStepIndex, setTimeStepIndex] = useState(2); // Default to 12:00 UTC
  const [activeVariable, setActiveVariable] = useState("Temperature");
  const [activeBasin, setActiveBasin] = useState("ALL");

  // Mobile / responsive sidebar toggle
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Globe visualization toggles
  const [isRotating, setIsRotating] = useState(true);
  const [showClouds, setShowClouds] = useState(true);
  const [showCurrents, setShowCurrents] = useState(true);
  const [showAtmosphere, setShowAtmosphere] = useState(true);

  // Orbit controls reference
  const controlsRef = useRef();

  // Basin selection
  const handleSelectBasin = useCallback((basin) => {
    setActiveBasin(basin);
    if (basin === "ALL") {
      setSelectedStation(stations[0]);
    } else {
      const match = stations.find((s) => s.basin.toLowerCase().includes(basin.toLowerCase()));
      if (match) {
        setSelectedStation(match);
      }
    }
  }, [stations]);

  // Reset 3D camera
  const handleResetCamera = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  }, []);

  const activeVarConfig = OCEAN_VARIABLES.find((v) => v.id === activeVariable) || OCEAN_VARIABLES[0];

  return (
    <div className="blue-vector-app">
      {/* Top Navigation & Status Header */}
      <Header
        activeBasin={activeBasin}
        onSelectBasin={handleSelectBasin}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      {/* Main Mission Control Layout */}
      <main className="main-content">
        {/* Left Section: 3D Interactive Ocean Globe */}
        <section className="globe-viewport">
          <Canvas
            camera={{ position: [0, 0.4, 5.2], fov: 42 }}
            gl={{ antialias: true, alpha: false }}
          >
            {/* Ambient & Directional Lighting */}
            <ambientLight intensity={1.5} color="#e0f2fe" />
            <directionalLight position={[6, 3, 5]} intensity={2.8} color="#ffffff" />
            <directionalLight position={[-6, -2, -4]} intensity={0.5} color="#0369a1" />

            {/* Realistic Starfield */}
            <Stars
              radius={100}
              depth={60}
              count={2500}
              factor={4}
              saturation={0.1}
              fade
              speed={0.5}
            />

            {/* 3D Earth Globe with in-situ stations, animated currents, depth probes */}
            <Suspense fallback={<CanvasLoader />}>
              <EarthGlobe
                stations={stations}
                selectedStation={selectedStation}
                onSelectStation={(st) => {
                  setSelectedStation(st);
                  // Ensure sidebar is open to show station data when user clicks a buoy
                  setIsSidebarOpen(true);
                }}
                isRotating={isRotating}
                rotationSpeed={0.0012}
                showClouds={showClouds}
                showCurrents={showCurrents}
                showAtmosphere={showAtmosphere}
                activeVariable={activeVariable}
                depth={depth}
                timeStepIndex={timeStepIndex}
              />
            </Suspense>

            {/* Smooth 3D Orbit Controls */}
            <OrbitControls
              ref={controlsRef}
              enablePan={false}
              minDistance={3.2}
              maxDistance={7.5}
              rotateSpeed={0.65}
              dampingFactor={0.06}
              enableDamping
            />
          </Canvas>

          {/* Floating HUD over Globe */}
          <GlobeHUD
            selectedStation={selectedStation}
            isRotating={isRotating}
            onToggleRotate={() => setIsRotating((prev) => !prev)}
            onResetView={handleResetCamera}
            showClouds={showClouds}
            onToggleClouds={() => setShowClouds((prev) => !prev)}
            showCurrents={showCurrents}
            onToggleCurrents={() => setShowCurrents((prev) => !prev)}
            showAtmosphere={showAtmosphere}
            onToggleAtmosphere={() => setShowAtmosphere((prev) => !prev)}
            depth={depth}
            timeStepIndex={timeStepIndex}
            activeVariableConfig={activeVarConfig}
          />

          {/* Bottom Floating 24-Hour Prototype Timeline Scrubber */}
          <TimelineControl
            timeStepIndex={timeStepIndex}
            onSelectTimeStep={setTimeStepIndex}
          />
        </section>

        {/* Right Section: Ocean Telemetry & Model Comparison Control Panel */}
        <ControlPanel
          stations={stations}
          selectedStation={selectedStation}
          onSelectStation={setSelectedStation}
          activeVariable={activeVariable}
          onSelectVariable={setActiveVariable}
          depth={depth}
          onChangeDepth={setDepth}
          timeStepIndex={timeStepIndex}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </main>

      {/* Bottom Telemetry Status Strip */}
      <Footer
        selectedStation={selectedStation}
        depth={depth}
        timeStepIndex={timeStepIndex}
      />
    </div>
  );
}

export default App;