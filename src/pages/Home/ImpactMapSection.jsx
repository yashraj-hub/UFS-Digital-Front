import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./ImpactMapSection.css";

// Covered states as a GeoJSON FeatureCollection for WebGL circle layers
const COVERAGE_GEOJSON = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { name: "Gujarat"           }, geometry: { type: "Point", coordinates: [71.5, 22.4]  } },
    { type: "Feature", properties: { name: "Andhra Pradesh"    }, geometry: { type: "Point", coordinates: [79.7, 15.9]  } },
    { type: "Feature", properties: { name: "Arunachal Pradesh" }, geometry: { type: "Point", coordinates: [94.7, 28.2]  } },
    { type: "Feature", properties: { name: "Assam"             }, geometry: { type: "Point", coordinates: [92.5, 26.2]  } },
    { type: "Feature", properties: { name: "Bihar"             }, geometry: { type: "Point", coordinates: [85.3, 25.6]  } },
    { type: "Feature", properties: { name: "Chhattisgarh"      }, geometry: { type: "Point", coordinates: [81.9, 21.3]  } },
    { type: "Feature", properties: { name: "Delhi"             }, geometry: { type: "Point", coordinates: [77.1, 28.7]  } },
    { type: "Feature", properties: { name: "Haryana"           }, geometry: { type: "Point", coordinates: [76.1, 29.1]  } },
    { type: "Feature", properties: { name: "Jharkhand"         }, geometry: { type: "Point", coordinates: [85.3, 23.6]  } },
    { type: "Feature", properties: { name: "Karnataka"         }, geometry: { type: "Point", coordinates: [75.7, 14.5]  } },
    { type: "Feature", properties: { name: "Madhya Pradesh"    }, geometry: { type: "Point", coordinates: [78.7, 23.5]  } },
    { type: "Feature", properties: { name: "Maharashtra"       }, geometry: { type: "Point", coordinates: [76.1, 19.7]  } },
    { type: "Feature", properties: { name: "Manipur"           }, geometry: { type: "Point", coordinates: [93.9, 24.7]  } },
    { type: "Feature", properties: { name: "Meghalaya"         }, geometry: { type: "Point", coordinates: [91.4, 25.5]  } },
    { type: "Feature", properties: { name: "Mizoram"           }, geometry: { type: "Point", coordinates: [92.9, 23.2]  } },
    { type: "Feature", properties: { name: "Nagaland"          }, geometry: { type: "Point", coordinates: [94.6, 26.1]  } },
    { type: "Feature", properties: { name: "Odisha"            }, geometry: { type: "Point", coordinates: [84.2, 20.9]  } },
    { type: "Feature", properties: { name: "Punjab"            }, geometry: { type: "Point", coordinates: [75.3, 31.1]  } },
    { type: "Feature", properties: { name: "Rajasthan"         }, geometry: { type: "Point", coordinates: [73.9, 27.0]  } },
    { type: "Feature", properties: { name: "Telangana"         }, geometry: { type: "Point", coordinates: [79.5, 17.9]  } },
    { type: "Feature", properties: { name: "Tripura"           }, geometry: { type: "Point", coordinates: [91.9, 23.8]  } },
    { type: "Feature", properties: { name: "Uttar Pradesh"     }, geometry: { type: "Point", coordinates: [80.9, 27.1]  } },
    { type: "Feature", properties: { name: "West Bengal"       }, geometry: { type: "Point", coordinates: [87.9, 23.8]  } },
  ],
};

// Per-state fill colors (vibrant; non-covered states fall back to DEFAULT_COLOR)
const STATE_COLOR_MAP = {
  "Gujarat":           "#f97316",
  "Andhra Pradesh":    "#8b5cf6",
  "Arunachal Pradesh": "#06b6d4",
  "Assam":             "#22c55e",
  "Bihar":             "#f59e0b",
  "Chhattisgarh":      "#ec4899",
  "Delhi":             "#6366f1",
  "Haryana":           "#14b8a6",
  "Jharkhand":         "#84cc16",
  "Karnataka":         "#10b981",
  "Madhya Pradesh":    "#a855f7",
  "Maharashtra":       "#ef4444",
  "Manipur":           "#34d399",
  "Meghalaya":         "#a78bfa",
  "Mizoram":           "#fbbf24",
  "Nagaland":          "#a3e635",
  "Orissa":            "#38bdf8",  // older GeoJSON name
  "Odisha":            "#38bdf8",
  "Punjab":            "#fb923c",
  "Rajasthan":         "#eab308",
  "Telangana":         "#fb7185",
  "Tripura":           "#4ade80",
  "Uttar Pradesh":     "#60a5fa",
  "West Bengal":       "#e879f9",
};

// Build ["match", ["get", "NAME_1"], state, color, ..., default] expression
const FILL_COLOR_EXPR = [
  "match",
  ["get", "NAME_1"],
  ...Object.entries(STATE_COLOR_MAP).flatMap(([k, v]) => [k, v]),
  "#c8d3df",  // muted slate for non-covered states
];

const MAPBOX_TOKEN =
  import.meta.env.VITE_MAPBOX_TOKEN;

// Tight bounds — excludes Andaman & Nicobar islands visually
const INDIA_BOUNDS = [[67.5, 7.0], [97.5, 37.5]];

const INDIA_STATES_URL =
  "https://raw.githubusercontent.com/geohacker/india/master/state/india_state.geojson";

// Island territories to hide (they float far from mainland)
const HIDDEN_TERRITORIES = ["Andaman and Nicobar", "Lakshadweep"];

function ImpactMapSection() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current || !MAPBOX_TOKEN || mapRef.current) return undefined;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/empty-v9",
      center: [82.5, 22.5],
      zoom: 3.8,
      attributionControl: false,
      interactive: false,
      renderWorldCopies: false,
    });

    mapRef.current = map;

    map.on("load", async () => {
      map.fitBounds(INDIA_BOUNDS, { padding: 32, duration: 0 });

      // ── State fills (async GeoJSON) ──────────────────────────────────────
      try {
        const res = await fetch(INDIA_STATES_URL);
        const data = await res.json();

        map.addSource("india-states", { type: "geojson", data });

        map.addLayer({
          id: "india-fill",
          type: "fill",
          source: "india-states",
          filter: ["!", ["in", ["get", "NAME_1"], ["literal", HIDDEN_TERRITORIES]]],
          paint: {
            "fill-color": FILL_COLOR_EXPR,
            "fill-opacity": 0.92,
          },
        });

        map.addLayer({
          id: "india-border",
          type: "line",
          source: "india-states",
          filter: ["!", ["in", ["get", "NAME_1"], ["literal", HIDDEN_TERRITORIES]]],
          paint: {
            "line-color": "rgba(255,255,255,0.55)",
            "line-width": 0.8,
          },
        });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn("India GeoJSON failed:", err);
      }

      // ── WebGL circle markers (always correct — no DOM projection issues) ─
      map.addSource("coverage-dots", {
        type: "geojson",
        data: COVERAGE_GEOJSON,
      });

      // Outer halo ring
      map.addLayer({
        id: "dot-halo",
        type: "circle",
        source: "coverage-dots",
        paint: {
          "circle-radius": 11,
          "circle-color": "rgba(234, 122, 52, 0.22)",
          "circle-stroke-width": 0,
        },
      });

      // White ring
      map.addLayer({
        id: "dot-ring",
        type: "circle",
        source: "coverage-dots",
        paint: {
          "circle-radius": 7,
          "circle-color": "#ffffff",
          "circle-stroke-width": 0,
        },
      });

      // Orange core dot
      map.addLayer({
        id: "dot-core",
        type: "circle",
        source: "coverage-dots",
        paint: {
          "circle-radius": 5,
          "circle-color": "#ea7a34",
          "circle-stroke-width": 1.5,
          "circle-stroke-color": "#ffffff",
        },
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <section className="impact-map-section" aria-label="Our Geographical Impact">
      <div className="impact-map-container">

        <div className="impact-map-content">
          <p className="impact-eyebrow">UFS Digital</p>
          <h2 className="impact-title">Empowering India Across <span style={{color:'#38779e'}}>23 States</span></h2>
          <p className="impact-desc">
            UFS Digital forms the technological backbone of rural India, bridging the gap between formal financial institutions and the unbanked. Our widespread network of CSP branches ensures that banking and digital services reach every corner of the country.
          </p>

          <div className="impact-stats-grid">
            <div className="impact-stat-item">
              <h3>3.36K</h3>
              <p>CSP Branches</p>
            </div>
            <div className="impact-stat-item">
              <h3>250K+</h3>
              <p>Value Customers</p>
            </div>
          </div>
        </div>

        <div className="impact-map-visual">
          <div ref={mapContainerRef} className="impact-map-canvas" />
        </div>

      </div>
    </section>
  );
}

export default ImpactMapSection;
