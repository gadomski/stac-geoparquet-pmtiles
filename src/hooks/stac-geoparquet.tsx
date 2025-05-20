import { Collection, Item } from "@/types/stac";
import { useDuckDbQuery } from "duckdb-wasm-kit";
import { MapGeoJSONFeature } from "maplibre-gl";
import { useEffect, useState } from "react";

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
  features: MapGeoJSONFeature[],
  columns: string[]
): {
  items: Item[] | undefined;
  loading: boolean;
  error: Error | undefined;
} {
  const [stacWasm, setStacWasm] = useState<any>();

  useEffect(() => {
    async function loadStacWasm() {
      const stac_wasm = await import("@/stac-wasm");
      setStacWasm(stac_wasm);
    }
    loadStacWasm();
  }, []);

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
        return `select ${columns.join(
          ", "
        )}, '${source}' as collection from read_parquet('${path}') where id in (${ids.join(
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
    items:
      (arrow && stacWasm && (stacWasm.arrowToStacJson(arrow) as Item[])) ||
      undefined,
    loading: loading || !stacWasm,
    error: error,
  };
}
