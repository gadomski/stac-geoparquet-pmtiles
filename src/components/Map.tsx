"use client";

import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Protocol } from "pmtiles";
import { useEffect, useRef, useState } from "react";

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [items, setItems] = useState<object[] | null>(null);

  const protocol = new Protocol();
  maplibregl.addProtocol("pmtiles", protocol.tile);

  useEffect(() => {
    if (map.current) return; // prevent map from initializing more than once

    map.current = new maplibregl.Map({
      container: mapContainer.current as HTMLDivElement,
      style: "https://tiles.stadiamaps.com/styles/alidade_smooth.json",
      center: [-105.1019, 40.1672],
      zoom: 6,
    });

    map.current.on("load", () => {
      map.current?.addSource("pmtiles", {
        type: "vector",
        url: "pmtiles://http://localhost:8080/naip.pmtiles",
      });

      map.current?.addLayer({
        id: "pmtiles-layer",
        type: "fill",
        source: "pmtiles",
        "source-layer": "naipfgb",
        paint: {
          "fill-color": "rgba(207, 63, 2, 0.5)",
        },
      });
    });

    map.current.on("click", "pmtiles-layer", (e) => {
      const ids = e.features?.map((feature) => feature.properties.id);
      fetch(`http://localhost:7822/search?ids=${ids?.join(",")}`)
        .then((response) => response.json())
        .then((data) => {
          setItems(data["features"]);
        });
    });

    return () => {
      if (map.current) map.current.remove();
    };
  }, []);

  return (
    <>
      <div
        ref={mapContainer}
        className="map-container"
        style={{ width: "100%", height: "600px" }}
      />
      <div>
        <ul>
          {items?.map((item) => (
            <li key={item.id}>{item.id}</li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Map;
