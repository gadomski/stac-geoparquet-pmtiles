import { Collection } from "@/types/stac";
import { useDuckDbQuery } from "duckdb-wasm-kit";

export function useStacGeoparquetItems(collection: Collection, ids: string[]) {
  const path = new URL(collection.assets.geoparquet.href, window.location.href);
  const query = `select id, assets from read_parquet('${path}') where id in (${ids.join(
    ","
  )})`;
  const { arrow, loading, error } = useDuckDbQuery(query);
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
