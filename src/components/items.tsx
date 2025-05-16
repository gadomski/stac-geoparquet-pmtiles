import { Item } from "@/types/stac";
import { Card, GridItem, Heading, Image, SimpleGrid } from "@chakra-ui/react";

function ItemGridItem({ item }: { item: Item }) {
  return (
    <GridItem p={2}>
      <Card.Root>
        <Card.Header>
          <Heading size={"lg"}>{item.id}</Heading>
        </Card.Header>
        <Card.Body>
          <Image
            src={item.assets.thumbnail.href}
            alt="Thumbnail"
            height={100}
            fit={"contain"}
          ></Image>
        </Card.Body>
      </Card.Root>
    </GridItem>
  );
}

export default function Items({ items }: { items: Item[] | undefined }) {
  if (items) {
    return (
      <SimpleGrid>
        {items.map((item) => (
          <ItemGridItem item={item} key={item.id}></ItemGridItem>
        ))}
      </SimpleGrid>
    );
  }
}
