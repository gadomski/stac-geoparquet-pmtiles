export type Item = {
  id: string;
  assets: ItemAssets;
};

export type Collection = {
  id: string;
  stac_version: string;
  type: string;
  assets: CollectionAssets;
};

export type Asset = {
  href: string;
};

export type PmtilesAsset = Asset & {
  layer: string;
};

export type ItemAssets = {
  thumbnail?: Asset;
};

export type CollectionAssets = {
  geoparquet: Asset;
  pmtiles: PmtilesAsset;
};
