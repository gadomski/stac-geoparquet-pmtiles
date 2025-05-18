import { useStacGeoparquetItems } from "@/hooks/stac-geoparquet";
import { Collection, Item } from "@/types/stac";
import { Box, Card, Heading, Image, Spinner, Text } from "@chakra-ui/react";

function ItemCard({ item }: { item: Item }) {
  return (
    <Card.Root>
      <Image src={item.assets.thumbnail?.href} alt="Thumbnail image"></Image>
      <Card.Body>
        <Text fontSize={"xs"}>{item.id}</Text>
      </Card.Body>
    </Card.Root>
  );
}

export default function Items({
  collection,
  ids,
}: {
  collection: Collection;
  ids: string[];
}) {
  const { items, loading, error } = useStacGeoparquetItems(collection, ids);
  if (items) {
    return (
      <>
        {items.map((item) => (
          <ItemCard key={item.id} item={item}></ItemCard>
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
