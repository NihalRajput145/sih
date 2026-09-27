/**
 * BLUE VECTOR — Ocean Data Service Layer
 * Ministry of Earth Sciences (MoES) — SIH26067
 *
 * Local prototype data service layer for observation stations and telemetry.
 */

import { STATIONS, computeOceanTelemetry, TIME_STEPS, OCEAN_VARIABLES } from "../data/oceanData";

const API_CONFIG = {
  USE_LOCAL_MOCK_DATA: true,
  TIMEOUT_MS: 5000
};

/**
 * Fetch all available ocean observation stations
 */
export async function getOceanStations() {
  if (API_CONFIG.USE_LOCAL_MOCK_DATA) {
    return Promise.resolve(STATIONS);
  }

  try {
    const res = await fetch(`${API_CONFIG.API_BASE_URL}/stations`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("Backend API unavailable, falling back to local dataset:", err.message);
    return STATIONS;
  }
}

/**
 * Fetch dynamic telemetry and model-observation comparison for a station
 * at specific depth and time step.
 */
export async function getStationTelemetry(stationId, depth = 0, timeStepIndex = 2) {
  const station = STATIONS.find((s) => s.id === stationId) || STATIONS[0];

  if (API_CONFIG.USE_LOCAL_MOCK_DATA) {
    const telemetry = computeOceanTelemetry(station, depth, timeStepIndex);
    return Promise.resolve({
      station,
      telemetry,
      provenance: "Sample Ocean Dataset (MoES Prototype)"
    });
  }

  try {
    const res = await fetch(
      `${API_CONFIG.API_BASE_URL}/stations/${stationId}/telemetry?depth=${depth}&time_step=${timeStepIndex}`
    );
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("Backend API unavailable, using local calculation engine:", err.message);
    return {
      station,
      telemetry: computeOceanTelemetry(station, depth, timeStepIndex),
      provenance: "Sample Ocean Dataset (Fallback)"
    };
  }
}

/**
 * Metadata helpers
 */
export function getTimelineSteps() {
  return TIME_STEPS;
}

export function getOceanVariables() {
  return OCEAN_VARIABLES;
}
