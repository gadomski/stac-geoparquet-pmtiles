"use client";

import { Collection } from "@/types/stac";
import { Layer, Map, MapLayerMouseEvent, Source } from "@vis.gl/react-maplibre";
import maplibregl, { MapGeoJSONFeature } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css"; // See notes below
import { Protocol } from "pmtiles";
import { Dispatch, SetStateAction } from "react";

function CollectionSourceAndLayer({ collection }: { collection: Collection }) {
  const fill_color = `rgba(${collection.fill_color.red}, ${collection.fill_color.green}, ${collection.fill_color.blue}, 0.5)`;
  return (
    <Source
      id={collection.id}
      type="vector"
      url={`pmtiles://${collection.assets.pmtiles.href}`}
    >
      <Layer
        id={collection.id + "-layer"}
        type="fill"
        source="pmtiles"
        source-layer={collection.assets.pmtiles.layer}
        paint={{ "fill-color": fill_color }}
      ></Layer>
    </Source>
  );
}

export default function Main({
  mapStyle,
  collections,
  setFeatures,
}: {
  mapStyle: string;
  collections: Collection[];
  setFeatures: Dispatch<SetStateAction<MapGeoJSONFeature[] | undefined>>;
}) {
  const protocol = new Protocol();
  maplibregl.addProtocol("pmtiles", protocol.tile);

  const onClick = async (e: MapLayerMouseEvent) => {
    if (e.features) {
      setFeatures(e.features);
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
      interactiveLayerIds={collections.map(
        (collection) => collection.id + "-layer"
      )}
    >
      {collections.map((collection) => (
        <CollectionSourceAndLayer
          collection={collection}
          key={collection.id}
        ></CollectionSourceAndLayer>
      ))}
    </Map>
  );
}
