import * as THREE from "three";

// Helper: Convert Lat/Lon to 3D Cartesian coordinates on sphere
export function latLonToVector3(lat, lon, radius = 2.0) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

export const STATIONS = [
  {
    id: "BOUY-001",
    code: "OMNI-AD01",
    name: "Arabian Sea Central Array",
    basin: "Arabian Sea",
    type: "Moored Met-Ocean Buoy",
    lat: 15.0,
    lon: 72.0,
    depth: 50,
    temp: 28.4,
    salinity: 35.8,
    current: 1.24,
    oxygen: 4.8,
    waveHeight: 1.8,
    modelTemp: 27.8,
    modelSalinity: 36.1,
    modelCurrent: 1.15,
    modelOxygen: 4.6,
    qcStatus: "PASSED",
    signal: 98,
    battery: 94,
    lastTransmission: "2 mins ago"
  },
  {
    id: "BOUY-002",
    code: "RAMA-BO02",
    name: "Equatorial Monsoon Buoy",
    basin: "Equatorial Indian Ocean",
    type: "Deep-Sea RAMA Mooring",
    lat: 8.0,
    lon: 80.0,
    depth: 100,
    temp: 27.8,
    salinity: 34.7,
    current: 0.95,
    oxygen: 4.5,
    waveHeight: 2.1,
    modelTemp: 27.2,
    modelSalinity: 34.9,
    modelCurrent: 1.02,
    modelOxygen: 4.3,
    qcStatus: "PASSED",
    signal: 95,
    battery: 88,
    lastTransmission: "5 mins ago"
  },
  {
    id: "BOUY-003",
    code: "INCOIS-BD08",
    name: "Head Bay of Bengal Observatory",
    basin: "Bay of Bengal",
    type: "INCOIS Coastal Mooring",
    lat: 20.0,
    lon: 88.0,
    depth: 25,
    temp: 29.1,
    salinity: 33.2,
    current: 1.42,
    oxygen: 5.2,
    waveHeight: 2.6,
    modelTemp: 28.5,
    modelSalinity: 33.6,
    modelCurrent: 1.38,
    modelOxygen: 5.0,
    qcStatus: "PASSED",
    signal: 100,
    battery: 97,
    lastTransmission: "1 min ago"
  },
  {
    id: "BOUY-004",
    code: "ARGO-EQ04",
    name: "Equatorial Jet Profiler",
    basin: "Equatorial Indian Ocean",
    type: "Argo Profiling Float",
    lat: -5.0,
    lon: 75.0,
    depth: 150,
    temp: 26.9,
    salinity: 35.4,
    current: 1.68,
    oxygen: 4.1,
    waveHeight: 1.4,
    modelTemp: 26.5,
    modelSalinity: 35.2,
    modelCurrent: 1.55,
    modelOxygen: 4.0,
    qcStatus: "VERIFIED",
    signal: 92,
    battery: 82,
    lastTransmission: "12 mins ago"
  },
  {
    id: "BOUY-005",
    code: "MET-LAK05",
    name: "Lakshadweep Basin Buoy",
    basin: "Lakshadweep Sea",
    type: "Moored Weather Buoy",
    lat: 10.5,
    lon: 72.8,
    depth: 60,
    temp: 28.9,
    salinity: 35.2,
    current: 1.10,
    oxygen: 4.7,
    waveHeight: 1.6,
    modelTemp: 28.2,
    modelSalinity: 35.4,
    modelCurrent: 1.08,
    modelOxygen: 4.6,
    qcStatus: "PASSED",
    signal: 96,
    battery: 91,
    lastTransmission: "7 mins ago"
  },
  {
    id: "BOUY-006",
    code: "ANDAMAN-S06",
    name: "Andaman Sea Deep Station",
    basin: "Andaman Sea",
    type: "Deep-Sea Sensor Array",
    lat: 11.8,
    lon: 93.0,
    depth: 30,
    temp: 29.4,
    salinity: 33.8,
    current: 0.85,
    oxygen: 4.9,
    waveHeight: 1.2,
    modelTemp: 29.0,
    modelSalinity: 33.9,
    modelCurrent: 0.90,
    modelOxygen: 4.8,
    qcStatus: "PASSED",
    signal: 94,
    battery: 95,
    lastTransmission: "4 mins ago"
  }
];

export const OCEAN_VARIABLES = [
  {
    id: "Temperature",
    label: "Temperature",
    unit: "°C",
    icon: "Thermometer",
    min: 4,
    max: 32,
    description: "Upper ocean thermal structure & thermocline gradient",
    color: "#f59e0b",
    gradient: "linear-gradient(90deg, #38bdf8 0%, #06b6d4 30%, #f59e0b 70%, #ef4444 100%)"
  },
  {
    id: "Salinity",
    label: "Salinity",
    unit: "PSU",
    icon: "Droplets",
    min: 32,
    max: 37,
    description: "Halocline balance and riverine runoff stratification",
    color: "#06b6d4",
    gradient: "linear-gradient(90deg, #0284c7 0%, #06b6d4 50%, #67e8f9 100%)"
  },
  {
    id: "Currents",
    label: "Current Velocity",
    unit: "m/s",
    icon: "Waves",
    min: 0.05,
    max: 2.2,
    description: "Surface geostrophic drift and monsoon circulation vectors",
    color: "#10b981",
    gradient: "linear-gradient(90deg, #0d9488 0%, #10b981 50%, #34d399 100%)"
  },
  {
    id: "Oxygen",
    label: "Dissolved O₂",
    unit: "mg/L",
    icon: "Wind",
    min: 0.5,
    max: 6.5,
    description: "Oxygen minimum zone (OMZ) biogeochemical profiling",
    color: "#a855f7",
    gradient: "linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)"
  }
];

export const DEPTH_PRESETS = [
  { label: "Surface (0m)", depth: 0, zone: "Epipelagic" },
  { label: "Subsurface (50m)", depth: 50, zone: "Epipelagic" },
  { label: "Thermocline (150m)", depth: 150, zone: "Mesopelagic" },
  { label: "Deep (500m)", depth: 500, zone: "Mesopelagic" }
];

export function getDepthZone(depth) {
  if (depth <= 200) return { name: "Epipelagic (Sunlight Zone)", code: "EPI", color: "#38bdf8" };
  if (depth <= 1000) return { name: "Mesopelagic (Twilight Zone)", code: "MESO", color: "#818cf8" };
  return { name: "Bathypelagic (Midnight Zone)", code: "BATHY", color: "#6366f1" };
}

export function computeDepthTelemetry(station, depth) {
  const numDepth = Number(depth);
  const thermoclineFactor = Math.exp(-numDepth / 260);
  const deepWaterTemp = 3.8;
  const tempVal = deepWaterTemp + (station.temp - deepWaterTemp) * thermoclineFactor;
  const modelTempVal = deepWaterTemp + (station.modelTemp - deepWaterTemp) * thermoclineFactor;

  const deepSalinity = 34.75;
  const salinityVal = deepSalinity + (station.salinity - deepSalinity) * Math.exp(-numDepth / 350);
  const modelSalinityVal = deepSalinity + (station.modelSalinity - deepSalinity) * Math.exp(-numDepth / 350);

  const currentAttenuation = Math.max(0.08, Math.exp(-numDepth / 180));
  const currentVal = station.current * currentAttenuation;
  const modelCurrentVal = station.modelCurrent * currentAttenuation;

  const omzDip = Math.exp(-Math.pow((numDepth - 400) / 250, 2)) * 2.8;
  const oxygenVal = Math.max(0.6, station.oxygen * Math.exp(-numDepth / 800) - omzDip + 1.2);
  const modelOxygenVal = Math.max(0.55, station.modelOxygen * Math.exp(-numDepth / 800) - omzDip + 1.15);

  const pressureVal = Math.round(1 + numDepth * 0.1);

  return {
    temp: Number(tempVal.toFixed(1)),
    modelTemp: Number(modelTempVal.toFixed(1)),
    salinity: Number(salinityVal.toFixed(1)),
    modelSalinity: Number(modelSalinityVal.toFixed(1)),
    current: Number(currentVal.toFixed(2)),
    modelCurrent: Number(modelCurrentVal.toFixed(2)),
    oxygen: Number(oxygenVal.toFixed(1)),
    modelOxygen: Number(modelOxygenVal.toFixed(1)),
    pressure: pressureVal
  };
}
