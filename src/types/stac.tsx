export type Item = {
  id: string;
  assets: ItemAssets;
  collection?: string;
};

export type Collection = {
  id: string;
  stac_version: string;
  type: string;
  fill_color: Color;
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

export type Color = {
  red: number;
  green: number;
  blue: number;
};
