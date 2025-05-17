export type Item = {
  id: string;
  assets: ItemAssets;
};

export type Collection = {
  id: string;
  assets: CollectionAssets;
};

export type Asset = {
  href: string;
  layer?: string;
};

export type ItemAssets = {
  thumbnail?: Asset;
};

export type CollectionAssets = {
  geoparquet: Asset;
  pmtiles: Asset;
};
