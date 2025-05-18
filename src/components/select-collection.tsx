import { Collection } from "@/types/stac";
import { createListCollection, Portal, Select } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";

export default function SelectCollection({
  collections,
  collection,
  setCollection,
}: {
  collections: Collection[];
  collection: Collection;
  setCollection: Dispatch<SetStateAction<Collection>>;
}) {
  const listCollection = createListCollection({
    items: collections.map((collection) => {
      return {
        label: collection.id,
        value: collection.id,
      };
    }),
  });
  return (
    <Select.Root
      collection={listCollection}
      defaultValue={[collection.id]}
      onValueChange={(e) => {
        if (e.value.length > 0) {
          const newCollection = collections.find(
            (collection) => collection.id == e.value[0]
          );
          if (newCollection) {
            setCollection(newCollection);
          }
        }
      }}
    >
      <Select.HiddenSelect></Select.HiddenSelect>
      <Select.Label>collection</Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="Select collection..." />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator></Select.Indicator>
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            {listCollection.items.map((collection) => (
              <Select.Item key={collection.value} item={collection}>
                {collection.label}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
}
