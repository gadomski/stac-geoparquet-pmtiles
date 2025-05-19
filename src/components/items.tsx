import { useStacGeoparquetItems } from "@/hooks/stac-geoparquet";
import { Asset, Collection, Item } from "@/types/stac";
import {
  Badge,
  Box,
  Button,
  Card,
  Heading,
  Image,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { CollecticonExpandTopRight } from "@devseed-ui/collecticons-react";
import { MapGeoJSONFeature } from "maplibre-gl";

function AssetButton({ assetKey, asset }: { assetKey: string; asset: Asset }) {
  return (
    <Button size={"xs"} variant={"ghost"} asChild>
      <a href={asset.href}>
        {assetKey} <CollecticonExpandTopRight></CollecticonExpandTopRight>
      </a>
    </Button>
  );
}

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
        <Stack>
          {Object.entries(item.assets).map(([key, asset]) => {
            if (asset) {
              return (
                <AssetButton
                  key={key}
                  asset={asset}
                  assetKey={key}
                ></AssetButton>
              );
            }
          })}
        </Stack>
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
