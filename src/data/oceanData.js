import * as THREE from "three";

/**
 * BLUE VECTOR — Central Structured Ocean Dataset
 * Ministry of Earth Sciences (MoES) — SIH26067
 * 
 * IMPORTANT HONESTY NOTE:
 * This file contains synthetic/sample oceanographic data designed for
 * prototype demonstration purposes only. It simulates numerical model
 * outputs and in-situ observations across the Indian Ocean basin to evaluate
 * the interactive 3D visualization and comparison workflows.
 * 
 * It is NOT connected to live INCOIS, NOAA, CMEMS, or satellite feeds.
 */

// Helper: Convert Lat/Lon to 3D Cartesian coordinates on sphere of given radius
export function latLonToVector3(lat, lon, radius = 2.0) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// 24-Hour Prototype Timeline Steps
export const TIME_STEPS = [
  { id: "t00", label: "00:00", fullLabel: "00:00 UTC", hour: 0, stepLabel: "Step 1/5 (T+00h)" },
  { id: "t06", label: "06:00", fullLabel: "06:00 UTC", hour: 6, stepLabel: "Step 2/5 (T+06h)" },
  { id: "t12", label: "12:00", fullLabel: "12:00 UTC", hour: 12, stepLabel: "Step 3/5 (T+12h)" },
  { id: "t18", label: "18:00", fullLabel: "18:00 UTC", hour: 18, stepLabel: "Step 4/5 (T+18h)" },
  { id: "t24", label: "24:00", fullLabel: "24:00 UTC", hour: 24, stepLabel: "Step 5/5 (T+24h)" }
];

// Physical Ocean Parameters Configuration
export const OCEAN_VARIABLES = [
  {
    id: "Temperature",
    label: "Sea Temperature",
    shortLabel: "Temp",
    unit: "°C",
    icon: "Thermometer",
    min: 4.0,
    max: 31.5,
    description: "Thermal structure and mixed-layer depth variation",
    color: "#f59e0b",
    glowColor: "#fbbf24",
    gradient: "linear-gradient(90deg, #38bdf8 0%, #06b6d4 30%, #f59e0b 70%, #ef4444 100%)"
  },
  {
    id: "Salinity",
    label: "Salinity",
    shortLabel: "Salinity",
    unit: "PSU",
    icon: "Droplets",
    min: 32.0,
    max: 37.0,
    description: "Practical salinity and halocline stratification",
    color: "#06b6d4",
    glowColor: "#22d3ee",
    gradient: "linear-gradient(90deg, #0284c7 0%, #06b6d4 50%, #67e8f9 100%)"
  },
  {
    id: "Currents",
    label: "Current Velocity",
    shortLabel: "Current",
    unit: "m/s",
    icon: "Waves",
    min: 0.05,
    max: 2.2,
    description: "Simulated surface and subsurface drift velocity vectors",
    color: "#10b981",
    glowColor: "#34d399",
    gradient: "linear-gradient(90deg, #0d9488 0%, #10b981 50%, #34d399 100%)"
  },
  {
    id: "Oxygen",
    label: "Dissolved Oxygen",
    shortLabel: "Dissolved O₂",
    unit: "mg/L",
    icon: "Wind",
    min: 0.5,
    max: 6.5,
    description: "Dissolved oxygen concentration and minimum zone profile",
    color: "#a855f7",
    glowColor: "#c084fc",
    gradient: "linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)"
  }
];

// Vertical Depth Stratification Levels
export const DEPTH_PRESETS = [
  { label: "Surface (0m)", depth: 0, layer: "Surface layer" },
  { label: "Subsurface (50m)", depth: 50, layer: "Subsurface layer" },
  { label: "Thermocline (150m)", depth: 150, layer: "Thermocline transition" },
  { label: "Intermediate (500m)", depth: 500, layer: "Intermediate depth" },
  { label: "Deep (1000m)", depth: 1000, layer: "Deep ocean layer" }
];

// Depth zonation metadata (for contextual display)
export function getDepthZone(depth) {
  const d = Number(depth);
  if (d <= 200) {
    return { name: "Surface Mixed Layer", code: "SURF", color: "#38bdf8", desc: "Upper mixed zone with solar penetration and active air-sea exchange" };
  }
  if (d <= 1000) {
    return { name: "Intermediate / Thermocline Layer", code: "MID", color: "#818cf8", desc: "Thermocline and halocline transition with vertical temperature and salinity gradients" };
  }
  return { name: "Deep Ocean Layer", code: "DEEP", color: "#6366f1", desc: "Uniform cold water column with minimal seasonal solar variation" };
}

// Indian Ocean Sample Current Streamline Paths (Lat, Lon coordinates)
export const CURRENT_PATHS = [
  {
    name: "Southwest Monsoon Current",
    coords: [[4.0, 55.0], [5.5, 65.0], [6.0, 75.0], [5.0, 85.0], [4.0, 95.0]]
  },
  {
    name: "Somali Boundary Current",
    coords: [[-3.0, 43.0], [2.0, 48.0], [7.0, 52.0], [12.0, 55.0], [15.0, 58.0]]
  },
  {
    name: "East India Coastal Current",
    coords: [[9.0, 81.0], [13.0, 82.0], [16.5, 84.5], [19.5, 87.5], [21.0, 90.0]]
  },
  {
    name: "West India Coastal Current",
    coords: [[21.5, 69.5], [18.0, 71.5], [14.0, 73.0], [10.0, 75.0], [7.5, 77.0]]
  },
  {
    name: "South Equatorial Current",
    coords: [[-11.0, 95.0], [-10.5, 85.0], [-10.0, 75.0], [-10.0, 65.0], [-10.5, 52.0]]
  },
  {
    name: "Bay of Bengal Flow Path",
    coords: [[12.0, 84.0], [15.0, 86.0], [16.5, 89.0], [14.0, 91.5], [10.5, 88.0]]
  },
  {
    name: "Arabian Sea Flow Path",
    coords: [[13.0, 60.0], [15.5, 63.5], [16.0, 67.0], [14.5, 70.0], [12.0, 66.5]]
  }
];

/**
 * Prototype In-Situ Observation Stations
 * Note: Uses neutral prototype identifiers (BV-001 to BV-007) and sample values.
 * Does not imply actual government or organizational deployment.
 */
export const STATIONS = [
  {
    id: "BV-001",
    code: "BV-001",
    name: "Arabian Sea Central Station",
    region: "Arabian Sea",
    basin: "Arabian Sea",
    type: "Prototype Observation Station",
    lat: 15.0,
    lon: 72.0,
    depth: 50,
    // Base sample observed values (surface level)
    temp: 28.4,
    salinity: 35.8,
    current: 1.24,
    currentHeading: 72,
    currentDirection: "ENE",
    oxygen: 4.8,
    waveHeight: 1.8,
    // Base sample numerical model values (surface level)
    modelTemp: 27.8,
    modelSalinity: 36.1,
    modelCurrent: 1.15,
    modelOxygen: 4.6
  },
  {
    id: "BV-002",
    code: "BV-002",
    name: "Equatorial Indian Ocean Station",
    region: "Equatorial Indian Ocean",
    basin: "Equatorial Indian Ocean",
    type: "Prototype Observation Station",
    lat: 8.0,
    lon: 80.0,
    depth: 100,
    temp: 27.8,
    salinity: 34.7,
    current: 0.95,
    currentHeading: 95,
    currentDirection: "E",
    oxygen: 4.5,
    waveHeight: 2.1,
    modelTemp: 27.2,
    modelSalinity: 34.9,
    modelCurrent: 1.02,
    modelOxygen: 4.3
  },
  {
    id: "BV-003",
    code: "BV-003",
    name: "Bay of Bengal Northern Station",
    region: "Bay of Bengal",
    basin: "Bay of Bengal",
    type: "Prototype Observation Station",
    lat: 20.0,
    lon: 88.0,
    depth: 25,
    temp: 29.1,
    salinity: 33.2,
    current: 1.42,
    currentHeading: 40,
    currentDirection: "NE",
    oxygen: 5.2,
    waveHeight: 2.6,
    modelTemp: 28.5,
    modelSalinity: 33.6,
    modelCurrent: 1.38,
    modelOxygen: 5.0
  },
  {
    id: "BV-004",
    code: "BV-004",
    name: "Central Indian Ocean Basin Station",
    region: "Central Indian Basin",
    basin: "Equatorial Indian Ocean",
    type: "Prototype Observation Station",
    lat: -5.0,
    lon: 75.0,
    depth: 150,
    temp: 26.9,
    salinity: 35.4,
    current: 1.68,
    currentHeading: 88,
    currentDirection: "E",
    oxygen: 4.1,
    waveHeight: 1.4,
    modelTemp: 26.5,
    modelSalinity: 35.2,
    modelCurrent: 1.55,
    modelOxygen: 4.0
  },
  {
    id: "BV-005",
    code: "BV-005",
    name: "Lakshadweep Sea Station",
    region: "Lakshadweep Sea",
    basin: "Lakshadweep Sea",
    type: "Prototype Observation Station",
    lat: 10.5,
    lon: 72.8,
    depth: 60,
    temp: 28.9,
    salinity: 35.2,
    current: 1.10,
    currentHeading: 165,
    currentDirection: "SSE",
    oxygen: 4.7,
    waveHeight: 1.6,
    modelTemp: 28.2,
    modelSalinity: 35.4,
    modelCurrent: 1.08,
    modelOxygen: 4.6
  },
  {
    id: "BV-006",
    code: "BV-006",
    name: "Andaman Sea Station",
    region: "Andaman Sea",
    basin: "Andaman Sea",
    type: "Prototype Observation Station",
    lat: 11.8,
    lon: 93.0,
    depth: 30,
    temp: 29.4,
    salinity: 33.8,
    current: 0.85,
    currentHeading: 310,
    currentDirection: "NW",
    oxygen: 4.9,
    waveHeight: 1.2,
    modelTemp: 29.0,
    modelSalinity: 33.9,
    modelCurrent: 0.90,
    modelOxygen: 4.8
  },
  {
    id: "BV-007",
    code: "BV-007",
    name: "Southwest Indian Ocean Station",
    region: "Southwest Indian Ocean",
    basin: "Southwest Indian Ocean",
    type: "Prototype Observation Station",
    lat: -12.0,
    lon: 60.0,
    depth: 80,
    temp: 26.2,
    salinity: 35.0,
    current: 0.78,
    currentHeading: 260,
    currentDirection: "W",
    oxygen: 4.6,
    waveHeight: 2.3,
    modelTemp: 25.8,
    modelSalinity: 35.2,
    modelCurrent: 0.82,
    modelOxygen: 4.4
  }
];

/**
 * Prototype Data Generation Function
 * 
 * NOTE: These mathematical approximations generate consistent, believable
 * synthetic values across depth and time so users can evaluate the UI,
 * depth controls, timeline scrubber, and comparison cards.
 * 
 * They are NOT a physical ocean numerical model.
 */
export function computeOceanTelemetry(station, depth = 0, timeStepIndex = 2) {
  if (!station) return null;

  const numDepth = Math.max(0, Math.min(1000, Number(depth)));
  const timeStep = Math.max(0, Math.min(TIME_STEPS.length - 1, Number(timeStepIndex)));
  
  // Synthetic diurnal temperature variation in upper mixed layer
  const diurnalOffsets = [-0.35, -0.15, 0.45, 0.20, -0.30];
  const diurnalFactor = Math.exp(-numDepth / 65) * (diurnalOffsets[timeStep] || 0);

  // Synthetic current modulation factor
  const currentModulations = [0.93, 0.98, 1.06, 1.00, 0.94];
  const timeCurrentFactor = currentModulations[timeStep] || 1.0;

  // Synthetic lead-time drift between model and observation
  const leadTimeDrift = (timeStep - 2) * 0.08;

  // 1. Temperature approximation with exponential thermocline
  const thermoclineFactor = Math.exp(-numDepth / 260);
  const deepWaterTemp = 3.8;
  const tempVal = deepWaterTemp + (station.temp - deepWaterTemp) * thermoclineFactor + diurnalFactor;
  const modelTempVal = deepWaterTemp + (station.modelTemp - deepWaterTemp) * thermoclineFactor + (diurnalFactor * 0.85) + leadTimeDrift;

  // 2. Salinity approximation with halocline
  const deepSalinity = 34.75;
  const salinityVal = deepSalinity + (station.salinity - deepSalinity) * Math.exp(-numDepth / 350);
  const modelSalinityVal = deepSalinity + (station.modelSalinity - deepSalinity) * Math.exp(-numDepth / 350) + (leadTimeDrift * 0.05);

  // 3. Current velocity attenuation with depth
  const currentAttenuation = Math.max(0.06, Math.exp(-numDepth / 180));
  const currentVal = station.current * currentAttenuation * timeCurrentFactor;
  const modelCurrentVal = station.modelCurrent * currentAttenuation * (timeCurrentFactor * 0.98);

  // 4. Dissolved Oxygen (characteristic mid-depth minimum zone approximation)
  const omzDip = Math.exp(-Math.pow((numDepth - 400) / 250, 2)) * 2.8;
  const oxygenVal = Math.max(0.6, station.oxygen * Math.exp(-numDepth / 800) - omzDip + 1.2);
  const modelOxygenVal = Math.max(0.55, station.modelOxygen * Math.exp(-numDepth / 800) - omzDip + 1.15 + (leadTimeDrift * 0.04));

  // Hydrostatic pressure in bar (1 bar atmospheric surface + 0.1 bar per meter depth)
  const pressureVal = Math.round(1 + numDepth * 0.1);

  // Direct Differences: Delta = (Observation - Model)
  const diffTemp = Number((tempVal - modelTempVal).toFixed(2));
  const diffSalinity = Number((salinityVal - modelSalinityVal).toFixed(2));
  const diffCurrent = Number((currentVal - modelCurrentVal).toFixed(2));
  const diffOxygen = Number((oxygenVal - modelOxygenVal).toFixed(2));

  // Absolute Differences: |Delta|
  const absDiffTemp = Number(Math.abs(diffTemp).toFixed(2));
  const absDiffSalinity = Number(Math.abs(diffSalinity).toFixed(2));
  const absDiffCurrent = Number(Math.abs(diffCurrent).toFixed(2));
  const absDiffOxygen = Number(Math.abs(diffOxygen).toFixed(2));

  return {
    timeStep: TIME_STEPS[timeStep],
    depth: numDepth,
    // Prototype Observed Values
    temp: Number(tempVal.toFixed(1)),
    salinity: Number(salinityVal.toFixed(1)),
    current: Number(currentVal.toFixed(2)),
    oxygen: Number(oxygenVal.toFixed(1)),
    pressure: pressureVal,
    currentHeading: station.currentHeading,
    currentDirection: station.currentDirection,
    // Prototype Model Values
    modelTemp: Number(modelTempVal.toFixed(1)),
    modelSalinity: Number(modelSalinityVal.toFixed(1)),
    modelCurrent: Number(modelCurrentVal.toFixed(2)),
    modelOxygen: Number(modelOxygenVal.toFixed(1)),
    // Deltas (Observed - Model)
    diffTemp,
    diffSalinity,
    diffCurrent,
    diffOxygen,
    // Absolute Differences
    absDiffTemp,
    absDiffSalinity,
    absDiffCurrent,
    absDiffOxygen
  };
}

// Backward-compatibility wrapper for computeDepthTelemetry
export function computeDepthTelemetry(station, depth) {
  return computeOceanTelemetry(station, depth, 2);
}
