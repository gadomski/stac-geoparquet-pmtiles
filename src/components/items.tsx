import { useStacGeoparquetItems } from "@/hooks/stac-geoparquet";
import { Collection, Item } from "@/types/stac";
import {
  Badge,
  Box,
  Card,
  Heading,
  Image,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { MapGeoJSONFeature } from "maplibre-gl";

function ItemCard({
  item,
  collection,
}: {
  item: Item;
  collection?: Collection;
}) {
  return (
    <Card.Root>
      <Image src={item.assets.thumbnail?.href} alt="Thumbnail image"></Image>
      <Card.Body>
        <Text fontSize={"xs"}>{item.id}</Text>
      </Card.Body>
      {collection && (
        <Card.Footer>
          <Badge
            backgroundColor={`rgb(${collection.fill_color.red}, ${collection.fill_color.green}, ${collection.fill_color.blue})`}
          >
            {collection.id}
          </Badge>
        </Card.Footer>
      )}
    </Card.Root>
  );
}

export default function Items({
  collections,
  features,
}: {
  collections: Collection[];
  features: MapGeoJSONFeature[];
}) {
  const { items, loading, error } = useStacGeoparquetItems(
    collections,
    features,
    ["id", "assets"]
  );
  if (items) {
    return (
      <>
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            collection={collections.find(
              (collection) => collection.id == item.collection
            )}
          ></ItemCard>
        ))}
      </>
    );
  } else if (loading) {
    return <Spinner></Spinner>;
  } else if (error) {
    return (
      <Box color={"red"}>
        <Heading size={"md"}>Error querying stac-geoparquet</Heading>
        <Text fontSize={"sm"}>{error.message}</Text>
      </Box>
    );
  }
}
