"use client";

import { GridItem, SimpleGrid } from "@chakra-ui/react";
import { useState } from "react";
import Items from "../components/items";
import Map from "../components/map";
import { Item } from "../types/stac";

export default function Page() {
  const [items, setItems] = useState<Item[] | undefined>();
  return (
    <SimpleGrid columns={3} minHeight={"100vh"}>
      <GridItem>
        <Items items={items}></Items>
      </GridItem>
      <GridItem colSpan={2}>
        <Map setItems={setItems}></Map>
      </GridItem>
    </SimpleGrid>
  );
}
