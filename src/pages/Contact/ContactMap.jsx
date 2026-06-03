import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./ContactMap.css";

const MAPBOX_TOKEN =
  import.meta.env.VITE_MAPBOX_TOKEN;

const OFFICES = [
  { name: "Head Office — Lucknow", address: "7th Floor, Summit Building, Vibhuti Khand, Gomti Nagar, Lucknow-226010, U.P.", coordinates: [80.9462, 26.8467] },
  { name: "Regional Office — Delhi", address: "Connaught Place, New Delhi-110001", coordinates: [77.209, 28.6139] },
  { name: "Regional Office — Mumbai", address: "Bandra Kurla Complex, Mumbai-400051, Maharashtra", coordinates: [72.8777, 19.076] },
  { name: "Regional Office — Patna", address: "Fraser Road, Patna-800001, Bihar", coordinates: [85.1376, 25.5941] },
];

const STATE_COLOR_MAP = {
  "Gujarat": "#f97316", "Andhra Pradesh": "#8b5cf6", "Arunachal Pradesh": "#06b6d4",
  "Assam": "#22c55e", "Bihar": "#f59e0b", "Chhattisgarh": "#ec4899",
  "Delhi": "#6366f1", "Haryana": "#14b8a6", "Jharkhand": "#84cc16",
  "Karnataka": "#10b981", "Madhya Pradesh": "#a855f7", "Maharashtra": "#ef4444",
  "Manipur": "#34d399", "Meghalaya": "#a78bfa", "Mizoram": "#fbbf24",
  "Nagaland": "#a3e635", "Orissa": "#38bdf8", "Odisha": "#38bdf8",
  "Punjab": "#fb923c", "Rajasthan": "#eab308", "Telangana": "#fb7185",
  "Tripura": "#4ade80", "Uttar Pradesh": "#60a5fa", "West Bengal": "#e879f9",
};

const FILL_COLOR_EXPR = [
  "match", ["get", "NAME_1"],
  ...Object.entries(STATE_COLOR_MAP).flatMap(([k, v]) => [k, v]),
  "#c8d3df",
];

const INDIA_BOUNDS = [[67.5, 7.0], [97.5, 37.5]];
const INDIA_STATES_URL = "https://raw.githubusercontent.com/geohacker/india/master/state/india_state.geojson";
const HIDDEN_TERRITORIES = ["Andaman and Nicobar", "Lakshadweep"];

function ContactMap() {
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

      try {
        const res = await fetch(INDIA_STATES_URL);
        const data = await res.json();
        map.addSource("india-states", { type: "geojson", data });
        map.addLayer({
          id: "india-fill",
          type: "fill",
          source: "india-states",
          filter: ["!", ["in", ["get", "NAME_1"], ["literal", HIDDEN_TERRITORIES]]],
          paint: { "fill-color": FILL_COLOR_EXPR, "fill-opacity": 0.92 },
        });
        map.addLayer({
          id: "india-border",
          type: "line",
          source: "india-states",
          filter: ["!", ["in", ["get", "NAME_1"], ["literal", HIDDEN_TERRITORIES]]],
          paint: { "line-color": "rgba(255,255,255,0.55)", "line-width": 0.8 },
        });
      } catch (err) {
        console.warn("India GeoJSON failed:", err);
      }

      // Office dot markers
      const officeGeojson = {
        type: "FeatureCollection",
        features: OFFICES.map((o) => ({
          type: "Feature",
          properties: { name: o.name, address: o.address },
          geometry: { type: "Point", coordinates: o.coordinates },
        })),
      };

      map.addSource("offices", { type: "geojson", data: officeGeojson });

      map.addLayer({ id: "office-halo", type: "circle", source: "offices",
        paint: { "circle-radius": 14, "circle-color": "rgba(234,122,52,0.22)", "circle-stroke-width": 0 } });
      map.addLayer({ id: "office-ring", type: "circle", source: "offices",
        paint: { "circle-radius": 8, "circle-color": "#ffffff", "circle-stroke-width": 0 } });
      map.addLayer({ id: "office-core", type: "circle", source: "offices",
        paint: { "circle-radius": 5, "circle-color": "#ea7a34", "circle-stroke-width": 1.5, "circle-stroke-color": "#ffffff" } });
    });

    return () => { map.remove(); mapRef.current = null; };
  }, []);

  return <div ref={mapContainerRef} className="contact-map" aria-label="UFS Digital office locations" />;
}

export default ContactMap;
