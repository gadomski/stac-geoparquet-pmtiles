# stac-geoparquet-pmtiles

Proof-of-concept of using [stac-geoparquet](https://github.com/stac-utils/stac-geoparquet) alongside [pmtiles](https://docs.protomaps.com/pmtiles/) for full-static asset visualization and metadata querying.
We think this might be interesting as a server-free way of visualizing and querying geospatial metadata.

## Concept

1. Create a **stac-geoparquet** file
2. Create a sidecar **pmtiles** file that includes _only_ the item id
3. Serve both with a static HTTP server
4. Load the **pmtiles** into a visualizer
5. Query into the **stac-geoparquet** by `id` as needed

## Usage

```shell
yarn dev
```

This will spin up the app on <http://localhost:3000/>.

## Building the pmtiles

Get **GDAL** and **tippecanoe**.
Then:

```shell
scripts/build-pmtiles public/file.parquet
```
