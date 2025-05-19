import { Collection } from "@/types/stac";
import { useDuckDbQuery } from "duckdb-wasm-kit";
import { MapGeoJSONFeature } from "maplibre-gl";

function partitionBySource(features: MapGeoJSONFeature[]) {
  return features.reduce((result, feature) => {
    const value = feature.source;
    if (!result[value]) {
      result[value] = [];
    }
    result[value].push(feature);
    return result;
  }, {} as { [source: string]: MapGeoJSONFeature[] });
}

export function useStacGeoparquetItems(
  collections: Collection[],
  features: MapGeoJSONFeature[]
) {
  const queries = Object.entries(partitionBySource(features))
    .map(([source, features]) => {
      const ids = features.map((feature) => "'" + feature.properties.id + "'");
      const collection = collections.find(
        (collection) => collection.id == source
      );
      if (collection) {
        const path = new URL(
          collection.assets.geoparquet.href,
          window.location.href
        );
        return `select id, assets from read_parquet('${path}') where id in (${ids.join(
          ","
        )})`;
      } else {
        console.log("ERROR: no collection with source: " + source);
        return undefined;
      }
    })
    .filter((q) => q);

  const { arrow, loading, error } = useDuckDbQuery(queries.join(" UNION "));
  return {
    items: arrow?.toArray().map((row) => {
      const item = row.toJSON();
      item.assets = item.assets.toJSON();
      for (const [key, value] of Object.entries(item.assets)) {
        if (value) {
          // @ts-expect-error toJSON exists but I can't convince ts that it does
          item.assets[key] = value.toJSON();
        }
      }
      return item;
    }),
    loading: loading,
    error: error,
  };
}
