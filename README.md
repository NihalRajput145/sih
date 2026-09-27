# 🌊 BLUE VECTOR — Ocean Intelligence & In-Situ Observation Platform

[![Smart India Hackathon 2026](https://img.shields.io/badge/SIH-2026_Prototype-0284c7.svg?style=for-the-badge)](https://www.sih.gov.in/)
[![React 19](https://img.shields.io/badge/React-19.2-61dafb.svg?style=for-the-badge&logo=react)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r185-000000.svg?style=for-the-badge&logo=threedotjs)](https://threejs.org/)
[![React Three Fiber](https://img.shields.io/badge/R3F-v9-black.svg?style=for-the-badge)](https://r3f.docs.pmnd.rs/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646cff.svg?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

> **BLUE VECTOR** is an interactive 3D ocean visualization prototype designed for the **Smart India Hackathon (SIH 2026)**. It provides interactive visualization of simulated oceanographic data, in-situ observation station telemetry (prototype sample array), and numerical model output vs. observation comparison across the Indian Ocean basin.

<p align="center">
  <img src="./img.png" alt="BLUE VECTOR — Interactive Ocean Intelligence Platform" width="100%" />
</p>

---

## 🌟 Key Features

### 1. 🌍 Photorealistic 3D Earth Globe (Continents, Oceans & Relief)
- **High-Resolution 2K Day Texture (`earth_atmos_2048.jpg`)**: Realistic continents, shorelines, topography, and ocean bathymetry.
- **Surface Bump & Normal Relief (`earth_normal_2048.jpg`)**: 3D elevation detailing for continental shelves and mountain ridges.
- **Ocean Specular Mask (`earth_specular_2048.jpg`)**: Realistic water glint and sunlight reflection where oceans reflect dynamic directional lighting while continents remain matte.
- **Dynamic Cloud Layer (`earth_clouds_1024.png`)**: Parallax-rotating cloud sphere rendered above the surface.
- **Dual-Atmosphere Ionospheric Halo**: Glowing atmospheric rim and Fresnel back-side lighting in vivid cyan/azure.

### 2. 📍 In-Situ Oceanographic Telemetry Array (Prototype Sample Data)
- 3D buoy markers mapped onto spherical coordinates ($lat, lon \rightarrow x, y, z$).
- Animated sonar rings pulsing on the sea surface.
- Interactive 3D HUD tags anchored above each buoy indicating station code, basin, sample depth, and active physical measurement.
- Neutral prototype station network:
  - **`BV-001`** — Arabian Sea Central Station
  - **`BV-002`** — Equatorial Indian Ocean Station
  - **`BV-003`** — Bay of Bengal Northern Station
  - **`BV-004`** — Central Indian Ocean Basin Station
  - **`BV-005`** — Lakshadweep Sea Station
  - **`BV-006`** — Andaman Sea Station
  - **`BV-007`** — Southwest Indian Ocean Station

### 3. 🌊 Smooth Animated Current Visualization
- Streamlines tracing simulated Indian Ocean current paths:
  - Somali Current
  - Southwest Monsoon Current
  - East India Coastal Current
  - West India Coastal Current
  - South Equatorial Current
  - Bay of Bengal Flow Path
  - Arabian Sea Flow Path

### 4. 🎚️ Vertical Stratification & Depth Profile (0–1000m Sample Data)
- Continuous depth slider ranging from **0m (Surface)** to **1000m (Deep)** with quick depth presets:
  - `Surface (0m)`
  - `Subsurface (50m)`
  - `Thermocline (150m)`
  - `Intermediate (500m)`
  - `Deep (1000m)`
- Synthetic ocean vertical profiles for prototype demonstration:
  - **Thermocline Exponential Profile**: Simulated thermal stratification from surface warm layer to deep water.
  - **Halocline Profile**: Simulated salinity variability across depth.
  - **Current Velocity Attenuation**: Attenuation of flow velocity with depth.
  - **Oxygen Profile**: Intermediate-depth oxygen minimum layer approximation.
  - **Hydrostatic Pressure**: Calculated bar pressure with depth.

### 5. ⚖️ Model vs Observation Comparison
- Direct comparison between prototype numerical model outputs and prototype observation values.
- Metrics displayed:
  - **Model**
  - **Observation**
  - **Difference (Δ)**
  - **Absolute Difference**
- Multi-parameter comparison table across Temperature, Salinity, Current Velocity, and Dissolved Oxygen.

### 6. 🎛️ Mission Control HUD & 24-Hour Prototype Timeline
- **Basin Quick Switcher**: Jump between *Arabian Sea*, *Bay of Bengal*, *Equatorial Array*, and *Indian Ocean*.
- **Globe Controls**: Auto-rotation toggle (Play/Pause), camera reset, and layer overlays toggle (Clouds, Atmosphere, Current Streamlines).
- **24-Hour Prototype Timeline**: Scrubber and playback loop across 5 discrete prototype time steps (00:00 to 24:00 UTC).
- **Fleet Switcher**: Sidebar directory displaying sample stations, coordinates, region, depth, and prototype time.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Core Framework** | React 19, JavaScript (ES6+ Modules) |
| **3D Rendering & WebGL** | Three.js (r185), React Three Fiber (R3F v9), React Three Drei (v10) |
| **Build & Tooling** | Vite 8, ESLint 10, Rolldown / Oxc bundler |
| **Icons & Aesthetics** | Lucide React, Glassmorphism, CSS Custom Properties |
| **Typography** | Chakra Petch (Display), Inter (UI), JetBrains Mono (Telemetry) |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0 or higher recommended)
- `npm` or `yarn` or `pnpm`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/NihalRajput145/sih.git
   cd sih/blue-vector
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview production build:**
   ```bash
   npm run preview
   ```

---

## 📂 Project Architecture

```
blue-vector/
├── img.png                   # Platform interface preview
├── public/
│   ├── favicon.svg
│   ├── icons.svg
│   └── textures/
│       ├── earth_atmos_2048.jpg      # 2K photorealistic Earth day texture (continents & oceans)
│       ├── earth_normal_2048.jpg     # Surface normal bump relief map
│       ├── earth_specular_2048.jpg   # Ocean water specular reflectance map
│       └── earth_clouds_1024.png     # Atmospheric cloud layer
├── src/
│   ├── components/
│   │   ├── EarthGlobe.jsx            # 3D textured Earth, clouds, atmosphere, buoys, current paths
│   │   ├── Header.jsx                # Mission branding, basin selector, UTC clock, system status
│   │   ├── ControlPanel.jsx          # Ocean variable picker, depth profiler, model vs observation comparison
│   │   ├── GlobeHUD.jsx              # Floating 3D HUD controls, layer toggles, legend scale
│   │   └── Footer.jsx                # Telemetry attribution, coordinates, WebGL metadata
│   ├── data/
│   │   └── stations.js               # Indian Ocean buoys, physics formulas & variable configs
│   ├── App.jsx                       # Main application shell and 3D Canvas
│   ├── App.css                       # Mission control styles, glassmorphism, responsive grid
│   ├── index.css                     # Dark viewport reset & custom scrollbars
│   └── main.jsx                      # React entrypoint
├── package.json
├── vite.config.js
└── README.md
```

---

## 🔬 Scientific Context & Synthetic Dataset

The parameters and sample coordinate regions within Blue Vector are inspired by operational oceanographic monitoring networks in the Indian Ocean:

1. **INCOIS (Indian National Centre for Ocean Information Services)**:
   - Moored Buoy Networks in the Arabian Sea & Bay of Bengal.
   - Coastal and deep-sea ocean state numerical modeling.
2. **NIOT (National Institute of Ocean Technology)**:
   - Marine observation sensor payloads.
3. **RAMA (Research Moored Array for African-Asian-Australian Monsoon Analysis and Prediction)**:
   - Tropical Indian Ocean climate and monsoon interaction stations.
4. **International Argo Program**:
   - Upper ocean profiling floats (temperature, salinity, pressure profiles).

---

## 🔮 Future Roadmap (SIH 2026 Scope)

- [ ] **Live API Integration**: Streaming feeds from INCOIS Web Services & Copernicus Marine Service (CMEMS).
- [ ] **Cyclone Trajectory Layer**: Real-time IMD / JTWC tropical cyclone track and intensity overlay.
- [ ] **AI-Powered Drift Forecasting**: Neural network prediction of oil spill drift and marine debris transport.
- [ ] **Bathymetric Depth Cross-Sections**: 2D slice visualizer for internal waves and oxygen minimum zones.

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

*Developed for Smart India Hackathon (SIH 2026) — Ocean Intelligence Prototype.*
