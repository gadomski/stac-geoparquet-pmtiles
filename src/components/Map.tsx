"use client";

import { Layer, Map, MapLayerMouseEvent, Source } from "@vis.gl/react-maplibre";
import { useDuckDb } from "duckdb-wasm-kit";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css"; // See notes below
import { Protocol } from "pmtiles";
import { Dispatch, SetStateAction } from "react";
import { Item } from "../types/stac";

export default function Main({
  setItems,
}: {
  setItems: Dispatch<SetStateAction<Item[] | undefined>>;
}) {
  const protocol = new Protocol();
  maplibregl.addProtocol("pmtiles", protocol.tile);

  const { db, _loading, _error } = useDuckDb();

  const onClick = async (e: MapLayerMouseEvent) => {
    if (e.features && db) {
      const ids = e.features.map(
        (feature) => "'" + feature.properties.id + "'"
      );
      if (ids.length > 0) {
        const connection = await db.connect();
        const result = await connection.query(
          `select id, datetime, assets from read_parquet('https://gadom.ski/stac-geoparquet-pmtiles/naip.parquet') where id in (${ids.join(
            ","
          )})`
        );
        setItems(
          result.toArray().map((row) => {
            const new_row = row.toJSON();
            new_row.assets = new_row.assets.toJSON();
            for (const [key, value] of Object.entries(new_row.assets)) {
              if (value) {
                new_row.assets[key] = value.toJSON();
              }
            }
            return new_row;
          })
        );
      } else {
        setItems([]);
      }
    }
  };

  return (
    <Map
      initialViewState={{
        longitude: -105.1019,
        latitude: 40.1672,
        zoom: 6,
      }}
      style={{ width: "100%", height: "100%" }}
      mapStyle="https://tiles.stadiamaps.com/styles/alidade_smooth.json"
      onClick={onClick}
      interactiveLayerIds={["pmtiles-layer"]}
    >
      <Source id="pmtiles" type="vector" url="pmtiles://naip.pmtiles">
        <Layer
          id="pmtiles-layer"
          type="fill"
          source="pmtiles"
          source-layer="naipfgb"
          paint={{ "fill-color": "rgba(207, 63, 2, 0.5)" }}
        ></Layer>
      </Source>
    </Map>
  );
}
