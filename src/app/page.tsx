"use client";

import Naip from "@/collections/naip.json";
import Items from "@/components/items";
import Map from "@/components/map";
import SelectCollection from "@/components/select-collection";
import { Box, HStack, Stack } from "@chakra-ui/react";
import { DuckDBConfig } from "@duckdb/duckdb-wasm";
import { initializeDuckDb } from "duckdb-wasm-kit";
import { useEffect, useState } from "react";

export default function Page() {
  const collections = [Naip];

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
    <HStack height="100vh" align="stretch">
      <Box
        width="200px"
        height="100vh"
        borderRight="1px solid"
        borderColor="gray.200"
        padding="4"
      >
        <Stack direction="column" align="stretch">
          <SelectCollection
            collections={collections}
            collection={collection}
            setCollection={setCollection}
          ></SelectCollection>
          {ids && ids.length > 0 && (
            <Items collection={collection} ids={ids}></Items>
          )}
        </Stack>
      </Box>
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
