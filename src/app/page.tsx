"use client";

import Naip from "@/collections/naip.json";
import Map from "@/components/map";
import Sidebar from "@/components/sidebar";
import { Box, HStack } from "@chakra-ui/react";
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

  const collections = [Naip];

  return (
    <HStack height="100vh" align="stretch">
      <Sidebar
        collection={collection}
        collections={collections}
        setCollection={setCollection}
      />
      <Box flex="1">
        <Map
          mapStyle={"https://tiles.openfreemap.org/styles/liberty"}
          collection={collection}
          setIds={setIds}
        ></Map>
      </Box>
    </HStack>
  );
}
