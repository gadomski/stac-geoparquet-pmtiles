"use client";

import Naip from "@/collections/naip.json";
import Openaerialmap from "@/collections/openaerialmap.json";
import Items from "@/components/items";
import Map from "@/components/map";
import { Box, HStack, Stack } from "@chakra-ui/react";
import { DuckDBConfig } from "@duckdb/duckdb-wasm";
import { initializeDuckDb } from "duckdb-wasm-kit";
import { MapGeoJSONFeature } from "maplibre-gl";
import { useEffect, useState } from "react";

export default function Page() {
  const collections = [Naip, Openaerialmap];

  const [features, setFeatures] = useState<MapGeoJSONFeature[] | undefined>();

  useEffect(() => {
    const config: DuckDBConfig = {
      query: {
        castBigIntToDouble: true,
      },
    };
    initializeDuckDb({ config, debug: false });
  }, []);

  return (
    <HStack height="100vh" align="stretch">
      <Box
        width="200px"
        height="100vh"
        borderRight="1px solid"
        borderColor="gray.200"
        padding="4"
      >
        <Stack direction="column" align="stretch">
          {features && features.length > 0 && (
            <Items collections={collections} features={features}></Items>
          )}
        </Stack>
      </Box>
      <Box flex="1">
        <Map
          mapStyle={"https://tiles.openfreemap.org/styles/liberty"}
          collections={collections}
          setFeatures={setFeatures}
        ></Map>
      </Box>
    </HStack>
  );
}
