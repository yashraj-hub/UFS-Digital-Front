import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./IndiaMap.css";

const COVERAGE_STATES = [
  { name: "Gujarat", region: "India", coordinates: [72.6369, 23.2156] },
  { name: "Andhra Pradesh", region: "India", coordinates: [80.648, 16.5062] },
  { name: "Arunachal Pradesh", region: "India", coordinates: [93.6053, 27.0844] },
  { name: "Assam", region: "India", coordinates: [91.7362, 26.1445] },
  { name: "Bihar", region: "India", coordinates: [85.1376, 25.5941] },
  { name: "Chhattisgarh", region: "India", coordinates: [81.6296, 21.2514] },
  { name: "Delhi", region: "India", coordinates: [77.209, 28.6139] },
  { name: "Haryana", region: "India", coordinates: [76.7794, 30.7333] },
  { name: "Jharkhand", region: "India", coordinates: [85.3096, 23.3441] },
  { name: "Karnataka", region: "India", coordinates: [77.5946, 12.9716] },
  { name: "Madhya Pradesh", region: "India", coordinates: [77.4126, 23.2599] },
  { name: "Maharashtra", region: "India", coordinates: [72.8777, 19.076] },
  { name: "Manipur", region: "India", coordinates: [93.9368, 24.817] },
  { name: "Meghalaya", region: "India", coordinates: [91.8933, 25.5788] },
  { name: "Mizoram", region: "India", coordinates: [92.7176, 23.7271] },
  { name: "Nagaland", region: "India", coordinates: [94.1086, 25.6751] },
  { name: "Odisha", region: "India", coordinates: [85.8245, 20.2961] },
  { name: "Punjab", region: "India", coordinates: [75.8573, 30.9008] },
  { name: "Rajasthan", region: "India", coordinates: [75.7873, 26.9124] },
  { name: "Telangana", region: "India", coordinates: [78.4867, 17.385] },
  { name: "Tripura", region: "India", coordinates: [91.2868, 23.8315] },
  { name: "Uttar Pradesh", region: "India", coordinates: [80.9462, 26.8467] },
  { name: "West Bengal", region: "India", coordinates: [88.3639, 22.5726] },
];

const MAPBOX_TOKEN =
  import.meta.env.VITE_MAPBOX_TOKEN;

const INDIA_BOUNDS = [
  [67.0, 6.0],
  [98.5, 37.8],
];

function IndiaMap() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRefs = useRef([]);
  const [activeState, setActiveState] = useState(COVERAGE_STATES[0].name);

  useEffect(() => {
    if (!mapContainerRef.current || !MAPBOX_TOKEN || mapRef.current) {
      return undefined;
    }

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [80.2, 22.9],
      zoom: 4.2,
      pitch: 0,
      attributionControl: false,
      maxBounds: INDIA_BOUNDS,
      minZoom: 3.7,
      maxZoom: 6.4,
      renderWorldCopies: false,
    });

    mapRef.current = map;
    markerRefs.current = COVERAGE_STATES.map((state) => {
      const markerElement = document.createElement("button");
      markerElement.type = "button";
      markerElement.className = "india-map__mapbox-marker";
      markerElement.setAttribute("aria-label", `${state.name}, ${state.region}`);
      markerElement.addEventListener("click", () => setActiveState(state.name));

      const marker = new mapboxgl.Marker({ element: markerElement, anchor: "center" })
        .setLngLat(state.coordinates)
        .addTo(map);

      return { name: state.name, element: markerElement, marker };
    });

    map.on("load", () => {
      map.fitBounds(INDIA_BOUNDS, {
        padding: { top: 76, right: 56, bottom: 56, left: 56 },
        duration: 0,
      });
      map.resize();
    });

    return () => {
      markerRefs.current.forEach(({ marker }) => marker.remove());
      markerRefs.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    markerRefs.current.forEach(({ name, element }) => {
      element.classList.toggle("is-active", name === activeState);
    });

    const current = COVERAGE_STATES.find((state) => state.name === activeState);
    if (mapRef.current && current) {
      mapRef.current.flyTo({
        center: current.coordinates,
        zoom: 4.9,
        speed: 0.6,
        essential: true,
      });
    }
  }, [activeState]);

  return (
    <div className="india-map__panel">
      <div className="india-map__canvas">
        {MAPBOX_TOKEN ? (
          <div
            ref={mapContainerRef}
            className="india-map__mapbox"
            aria-label="India coverage map"
          />
        ) : (
          <div className="india-map__fallback">
            Add `VITE_MAPBOX_TOKEN` to enable the live Mapbox view.
          </div>
        )}
      </div>
    </div>
  );
}

export default IndiaMap;
