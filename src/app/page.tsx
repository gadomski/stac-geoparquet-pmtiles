"use client";

import Naip from "@/collections/naip.json";
import Map from "@/components/map";
import { SimpleGrid } from "@chakra-ui/react";
import { DuckDBConfig } from "@duckdb/duckdb-wasm";
import { initializeDuckDb } from "duckdb-wasm-kit";
import { useEffect, useState } from "react";

export default function Page() {
  const [ids, setIds] = useState<string[] | undefined>();
  const [collection, setCollection] = useState(Naip);

  useEffect(() => {
    const config: DuckDBConfig = {
      query: {
        castBigIntToDouble: true,
      },
    };
    initializeDuckDb({ config, debug: false });
  }, []);

  return (
    <>
      <SimpleGrid minHeight={"100vh"}>
        <Map
          mapStyle={"https://tiles.openfreemap.org/styles/liberty"}
          collection={collection}
          setIds={setIds}
        ></Map>
      </SimpleGrid>
    </>
  );
}
