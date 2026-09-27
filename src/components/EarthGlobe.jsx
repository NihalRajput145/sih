import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture, Html } from "@react-three/drei";
import * as THREE from "three";
import {
  latLonToVector3,
  computeOceanTelemetry,
  OCEAN_VARIABLES,
  CURRENT_PATHS
} from "../data/oceanData";

// Single Animated Current Arrow following a streamline curve
function AnimatedCurrentArrow({ curve, offset, flowSpeed = 0.08, isCurrentsActive = false }) {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = (offset + clock.getElapsedTime() * flowSpeed) % 1.0;
    const pos = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t).normalize();

    meshRef.current.position.copy(pos);

    // Orient cone along tangent direction (default cone points along Y axis)
    const up = new THREE.Vector3(0, 1, 0);
    meshRef.current.quaternion.setFromUnitVectors(up, tangent);
  });

  const arrowColor = isCurrentsActive ? "#10b981" : "#06b6d4";
  const scale = isCurrentsActive ? 1.25 : 0.9;

  return (
    <mesh ref={meshRef} scale={[scale, scale, scale]}>
      <coneGeometry args={[0.016, 0.045, 8]} />
      <meshBasicMaterial
        color={arrowColor}
        transparent
        opacity={isCurrentsActive ? 0.95 : 0.65}
      />
    </mesh>
  );
}

// Ocean Current Flow Streamline with dynamic animated directional arrows
function CurrentStreamline({ pathObj, isCurrentsActive }) {
  const points = useMemo(() => {
    return pathObj.coords.map(([lat, lon]) => latLonToVector3(lat, lon, 2.012));
  }, [pathObj.coords]);

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(points);
  }, [points]);

  const curvePoints = useMemo(() => curve.getPoints(40), [curve]);
  const lineGeometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(curvePoints);
  }, [curvePoints]);

  const lineColor = isCurrentsActive ? "#10b981" : "#06b6d4";
  const lineOpacity = isCurrentsActive ? 0.8 : 0.35;

  return (
    <group>
      {/* Continuous Streamline Path */}
      <line geometry={lineGeometry}>
        <lineBasicMaterial
          color={lineColor}
          transparent
          opacity={lineOpacity}
          linewidth={isCurrentsActive ? 2 : 1}
        />
      </line>

      {/* 3 Animated Directional Arrows along the flow path */}
      <AnimatedCurrentArrow
        curve={curve}
        offset={0.0}
        flowSpeed={isCurrentsActive ? 0.09 : 0.05}
        isCurrentsActive={isCurrentsActive}
      />
      <AnimatedCurrentArrow
        curve={curve}
        offset={0.35}
        flowSpeed={isCurrentsActive ? 0.09 : 0.05}
        isCurrentsActive={isCurrentsActive}
      />
      <AnimatedCurrentArrow
        curve={curve}
        offset={0.7}
        flowSpeed={isCurrentsActive ? 0.09 : 0.05}
        isCurrentsActive={isCurrentsActive}
      />
    </group>
  );
}

// Station Buoy Marker with dynamic vertical depth cable & current vector
function BuoyMarker({
  station,
  isSelected,
  onSelect,
  activeVariable,
  depth,
  timeStepIndex
}) {
  const pulseRef = useRef();
  const surfacePos = useMemo(() => latLonToVector3(station.lat, station.lon, 2.008), [station.lat, station.lon]);

  // Compute normal orientation perpendicular to sphere surface
  const orientation = useMemo(() => {
    const normal = surfacePos.clone().normalize();
    const up = new THREE.Vector3(0, 1, 0);
    return new THREE.Quaternion().setFromUnitVectors(up, normal);
  }, [surfacePos]);

  // Dynamic telemetry at current depth and time step
  const telemetry = useMemo(() => {
    return computeOceanTelemetry(station, depth, timeStepIndex);
  }, [station, depth, timeStepIndex]);

  // Dynamic variable color scheme
  const varConfig = useMemo(() => {
    return OCEAN_VARIABLES.find((v) => v.id === activeVariable) || OCEAN_VARIABLES[0];
  }, [activeVariable]);

  const markerColor = isSelected ? "#38bdf8" : varConfig.color;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (pulseRef.current) {
      const scale = 1 + ((t * 1.6) % 1) * 1.3;
      const opacity = Math.max(0, 1 - ((t * 1.6) % 1));
      pulseRef.current.scale.set(scale, scale, scale);
      pulseRef.current.material.opacity = opacity * 0.75;
    }
  });

  const valueDisplay = useMemo(() => {
    if (!telemetry) return "";
    switch (activeVariable) {
      case "Temperature":
        return `${telemetry.temp} °C`;
      case "Salinity":
        return `${telemetry.salinity} PSU`;
      case "Currents":
        return `${telemetry.current} m/s`;
      case "Oxygen":
        return `${telemetry.oxygen} mg/L`;
      default:
        return `${telemetry.temp} °C`;
    }
  }, [activeVariable, telemetry]);

  // Probe depth cable length scaled into sphere subsurface
  // Max depth 1000m maps to ~0.16 units radius beneath surface
  const probeDepthLength = Math.max(0.015, (depth / 1000) * 0.16);

  return (
    <group position={surfacePos} quaternion={orientation}>
      {/* 1. Base water surface anchor ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.022, 0.055, 24]} />
        <meshBasicMaterial
          color={markerColor}
          side={THREE.DoubleSide}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* 2. Pulsing Sonar Ping Wave */}
      <mesh ref={pulseRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.04, 0.08, 24]} />
        <meshBasicMaterial
          color={markerColor}
          side={THREE.DoubleSide}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* 3. Surface Mast */}
      <mesh position={[0, 0.07, 0]}>
        <cylinderGeometry args={[0.007, 0.012, 0.14, 12]} />
        <meshStandardMaterial
          color={isSelected ? "#0284c7" : "#475569"}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* 4. Flashing Beacon Sphere */}
      <mesh
        position={[0, 0.15, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(station);
        }}
      >
        <sphereGeometry args={[isSelected ? 0.04 : 0.028, 16, 16]} />
        <meshBasicMaterial color={isSelected ? "#ffffff" : markerColor} />
      </mesh>

      {/* 5. Subsurface Mooring Cable down into the water column */}
      <mesh position={[0, -probeDepthLength / 2, 0]}>
        <cylinderGeometry args={[0.003, 0.003, probeDepthLength, 8]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.65} />
      </mesh>

      {/* 6. In-Situ Subsurface Depth Sensor Bead at selected depth */}
      <mesh position={[0, -probeDepthLength, 0]}>
        <sphereGeometry args={[0.018, 12, 12]} />
        <meshBasicMaterial color={markerColor} />
      </mesh>

      {/* 7. Current Direction Indicator Vector (if currents active or selected) */}
      {(activeVariable === "Currents" || isSelected) && (
        <group rotation={[0, (station.currentHeading * Math.PI) / 180, 0]}>
          <mesh position={[0, 0.01, 0.06]}>
            <coneGeometry args={[0.014, 0.045, 8]} />
            <meshBasicMaterial color="#10b981" />
          </mesh>
        </group>
      )}

      {/* 8. 3D Floating HUD Tag on Selected Station */}
      {isSelected && (
        <Html
          position={[0, 0.28, 0]}
          center
          distanceFactor={10}
          zIndexRange={[100, 0]}
        >
          <div className="buoy-hud-tag">
            <div className="tag-header">
              <span className="live-dot" />
              <strong>{station.code}</strong>
              <span className="tag-depth">Sample {depth}m</span>
            </div>
            <div className="tag-data">
              <span className="tag-param-val" style={{ color: varConfig.color }}>
                {valueDisplay}
              </span>
              <small>{station.basin}</small>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

// Main 3D Earth Globe Component
export default function EarthGlobe({
  stations,
  selectedStation,
  onSelectStation,
  isRotating = true,
  rotationSpeed = 0.0012,
  showClouds = true,
  showCurrents = true,
  showAtmosphere = true,
  activeVariable = "Temperature",
  depth = 50,
  timeStepIndex = 2
}) {
  const earthGroupRef = useRef();
  const cloudsRef = useRef();

  // Load high-resolution photorealistic Earth textures
  const [atmosMap, normalMap, specularMap, cloudsMap] = useTexture([
    "/textures/earth_atmos_2048.jpg",
    "/textures/earth_normal_2048.jpg",
    "/textures/earth_specular_2048.jpg",
    "/textures/earth_clouds_1024.png"
  ]);

  const isCurrentsActive = activeVariable === "Currents";

  // Active parameter color accent for atmosphere rim
  const activeVarColor = useMemo(() => {
    const config = OCEAN_VARIABLES.find((v) => v.id === activeVariable);
    return config ? config.color : "#38bdf8";
  }, [activeVariable]);

  // Frame animation loop
  useFrame(() => {
    if (isRotating && earthGroupRef.current) {
      earthGroupRef.current.rotation.y += rotationSpeed;
    }
    if (showClouds && cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0003;
    }
  });

  return (
    // Default rotation [0.2, Math.PI, 0] faces India and the Indian Ocean forward
    <group ref={earthGroupRef} rotation={[0.2, Math.PI, 0]}>
      {/* 1. Earth Primary Solid Mesh with Topographic Relief & Specular Ocean */}
      <mesh receiveShadow castShadow>
        <sphereGeometry args={[2.0, 64, 64]} />
        <meshStandardMaterial
          map={atmosMap}
          normalMap={normalMap}
          normalScale={new THREE.Vector2(0.8, 0.8)}
          roughnessMap={specularMap}
          roughness={0.45}
          metalness={0.12}
        />
      </mesh>

      {/* 2. Realistic Dynamic Cloud Layer */}
      {showClouds && (
        <mesh ref={cloudsRef} scale={1.012}>
          <sphereGeometry args={[2.0, 64, 64]} />
          <meshStandardMaterial
            map={cloudsMap}
            transparent
            opacity={0.34}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* 3. Parameter-Responsive Inner Atmospheric Rim Glow */}
      {showAtmosphere && (
        <mesh scale={1.025}>
          <sphereGeometry args={[2.0, 64, 64]} />
          <meshBasicMaterial
            color={activeVarColor}
            transparent
            opacity={0.12}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* 4. Outer Soft Atmosphere Halo */}
      {showAtmosphere && (
        <mesh scale={1.085}>
          <sphereGeometry args={[2.0, 48, 48]} />
          <meshBasicMaterial
            color="#0284c7"
            transparent
            opacity={0.07}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* 5. Indian Ocean Geostrophic Currents with Animated Directional Flow */}
      {showCurrents && (
        <group>
          {CURRENT_PATHS.map((pathObj, idx) => (
            <CurrentStreamline
              key={idx}
              pathObj={pathObj}
              isCurrentsActive={isCurrentsActive}
            />
          ))}
        </group>
      )}

      {/* 6. In-Situ Ocean Observation Stations & Buoys */}
      {stations.map((st) => (
        <BuoyMarker
          key={st.id}
          station={st}
          isSelected={selectedStation?.id === st.id}
          onSelect={onSelectStation}
          activeVariable={activeVariable}
          depth={depth}
          timeStepIndex={timeStepIndex}
        />
      ))}
    </group>
  );
}
