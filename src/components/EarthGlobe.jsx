import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture, Html } from "@react-three/drei";
import * as THREE from "three";
import { latLonToVector3 } from "../data/stations";

// Indian Ocean realistic current paths (Lat, Lon coordinates)
const CURRENT_PATHS = [
  // Southwest Monsoon Current / Equatorial Indian flow
  [
    [4.0, 55.0], [5.5, 65.0], [6.0, 75.0], [5.0, 85.0], [4.0, 95.0]
  ],
  // Somali Current / Western Boundary Flow
  [
    [-3.0, 43.0], [2.0, 48.0], [7.0, 52.0], [12.0, 55.0], [15.0, 58.0]
  ],
  // East India Coastal Current (EICC) - Bay of Bengal
  [
    [9.0, 81.0], [13.0, 82.0], [16.5, 84.5], [19.5, 87.5], [21.0, 90.0]
  ],
  // West India Coastal Current (WICC) - Arabian Sea
  [
    [21.5, 69.5], [18.0, 71.5], [14.0, 73.0], [10.0, 75.0], [7.5, 77.0]
  ],
  // South Equatorial Current
  [
    [-11.0, 95.0], [-10.5, 85.0], [-10.0, 75.0], [-10.0, 65.0], [-10.5, 52.0]
  ],
  // Bay of Bengal Cyclonic Gyre
  [
    [12.0, 84.0], [15.0, 86.0], [16.5, 89.0], [14.0, 91.5], [10.5, 88.0]
  ],
  // Arabian Sea High-Salinity Jet
  [
    [13.0, 60.0], [15.5, 63.5], [16.0, 67.0], [14.5, 70.0], [12.0, 66.5]
  ]
];

// Buoy Marker Component
function BuoyMarker({ station, isSelected, onSelect, activeVariable }) {
  const pulseRef = useRef();
  const pos = useMemo(() => latLonToVector3(station.lat, station.lon, 2.008), [station.lat, station.lon]);

  // Compute normal orientation so buoy stands upright perpendicular to sphere
  const orientation = useMemo(() => {
    const normal = pos.clone().normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(up, normal);
    return quaternion;
  }, [pos]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (pulseRef.current) {
      const scale = 1 + (t * 1.5 % 1) * 1.2;
      const opacity = Math.max(0, 1 - (t * 1.5 % 1));
      pulseRef.current.scale.set(scale, scale, scale);
      pulseRef.current.material.opacity = opacity * 0.7;
    }
  });

  const valueDisplay = useMemo(() => {
    switch (activeVariable) {
      case "Temperature":
        return `${station.temp}°C`;
      case "Salinity":
        return `${station.salinity} PSU`;
      case "Currents":
        return `${station.current} m/s`;
      case "Oxygen":
        return `${station.oxygen} mg/L`;
      default:
        return `${station.temp}°C`;
    }
  }, [activeVariable, station]);

  return (
    <group position={pos} quaternion={orientation}>
      {/* Base water surface anchor ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.02, 0.055, 24]} />
        <meshBasicMaterial
          color={isSelected ? "#22d3ee" : "#f59e0b"}
          side={THREE.DoubleSide}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Pulsing Sonar Ping Wave */}
      <mesh ref={pulseRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.04, 0.075, 24]} />
        <meshBasicMaterial
          color={isSelected ? "#38bdf8" : "#fbbf24"}
          side={THREE.DoubleSide}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Buoy Mast Stalk */}
      <mesh position={[0, 0.07, 0]}>
        <cylinderGeometry args={[0.007, 0.012, 0.14, 12]} />
        <meshStandardMaterial
          color={isSelected ? "#0284c7" : "#78350f"}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Flashing Top Beacon */}
      <mesh
        position={[0, 0.15, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(station);
        }}
      >
        <sphereGeometry args={[isSelected ? 0.038 : 0.028, 16, 16]} />
        <meshBasicMaterial
          color={isSelected ? "#38bdf8" : "#fbbf24"}
        />
      </mesh>

      {/* Interactive 3D Label */}
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
            </div>
            <div className="tag-data">
              <span>{valueDisplay}</span>
              <small>{station.basin}</small>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

// Ocean Current Flow Line Component
function CurrentStreamline({ coordinates }) {
  const points = useMemo(() => {
    return coordinates.map(([lat, lon]) => latLonToVector3(lat, lon, 2.012));
  }, [coordinates]);

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(points);
  }, [points]);

  const curvePoints = useMemo(() => curve.getPoints(36), [curve]);
  const lineGeometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(curvePoints);
  }, [curvePoints]);

  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial
        color="#06b6d4"
        transparent
        opacity={0.45}
        linewidth={1.5}
      />
    </line>
  );
}

// Main Earth 3D Component
export default function EarthGlobe({
  stations,
  selectedStation,
  onSelectStation,
  isRotating = true,
  rotationSpeed = 0.001,
  showClouds = true,
  showCurrents = true,
  showAtmosphere = true,
  activeVariable = "Temperature"
}) {
  const earthGroupRef = useRef();
  const cloudsRef = useRef();

  // Load high-resolution Earth textures
  const [atmosMap, normalMap, specularMap, cloudsMap] = useTexture([
    "/textures/earth_atmos_2048.jpg",
    "/textures/earth_normal_2048.jpg",
    "/textures/earth_specular_2048.jpg",
    "/textures/earth_clouds_1024.png"
  ]);



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
    // Default rotation.y = Math.PI brings the Indian Ocean and India facing forward
    <group ref={earthGroupRef} rotation={[0.2, Math.PI, 0]}>
      {/* 1. Earth Primary Solid Mesh with Map & Relief */}
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
            opacity={0.36}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* 3. Inner Atmospheric Rim Glow */}
      {showAtmosphere && (
        <mesh scale={1.025}>
          <sphereGeometry args={[2.0, 64, 64]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.12}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* 4. Outer Soft Ionospheric Atmosphere Halo */}
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

      {/* 5. Indian Ocean Geostrophic Current Streamlines */}
      {showCurrents && (
        <group>
          {CURRENT_PATHS.map((path, idx) => (
            <CurrentStreamline key={idx} coordinates={path} />
          ))}
        </group>
      )}

      {/* 6. In-situ Oceanographic Moored & Argo Buoy Beacons */}
      {stations.map((station) => (
        <BuoyMarker
          key={station.id}
          station={station}
          isSelected={selectedStation?.id === station.id}
          onSelect={onSelectStation}
          activeVariable={activeVariable}
        />
      ))}
    </group>
  );
}
