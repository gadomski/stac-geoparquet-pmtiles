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

Eventually we'd like to make this much simpler.

```shell
# This will be slow, because (for now) we have to build DuckDB from scratch
docker compose up
```

Then, go to <http://localhost:3000> and click on a geometry — this should fetch the STAC items that you clicked on from the STAC API.

### Next steps

- Make a STAC API search from the browser directly to the **stac-geoparquet** file, no STAC API server required
- Make the UI less eyeball-bleed-inducing
- Provide examples for multiple datasets
- Show how we make the **pmtiles** file
