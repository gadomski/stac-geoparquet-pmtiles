"use client";

import { Collection } from "@/types/stac";
import { Layer, Map, MapLayerMouseEvent, Source } from "@vis.gl/react-maplibre";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css"; // See notes below
import { Protocol } from "pmtiles";
import { Dispatch, SetStateAction } from "react";

export default function Main({
  mapStyle,
  collection,
  setIds,
}: {
  mapStyle: string;
  collection: Collection;
  setIds: Dispatch<SetStateAction<string[] | undefined>>;
}) {
  const protocol = new Protocol();
  maplibregl.addProtocol("pmtiles", protocol.tile);

  const onClick = async (e: MapLayerMouseEvent) => {
    if (e.features) {
      const ids = e.features.map(
        (feature) => "'" + feature.properties.id + "'"
      );
      setIds(ids);
    }
  };

  return (
    <Map
      initialViewState={{
        longitude: -105.7821,
        latitude: 39.5501,
        zoom: 6,
      }}
      style={{ width: "100%", height: "100%" }}
      mapStyle={mapStyle}
      onClick={onClick}
      interactiveLayerIds={["pmtiles-layer"]}
    >
      <Source
        id="pmtiles"
        type="vector"
        url={`pmtiles://${collection.assets.pmtiles.href}`}
      >
        <Layer
          id="pmtiles-layer"
          type="fill"
          source="pmtiles"
          source-layer={collection.assets.pmtiles.layer}
          paint={{ "fill-color": "rgba(207, 63, 2, 0.5)" }}
        ></Layer>
      </Source>
    </Map>
  );
}
