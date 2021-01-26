import { useEffect } from "react";
import { useLeafletContext } from "@react-leaflet/core";

import L from "leaflet";

import "leaflet.vectorgrid";

export const PBFVectorGrid = (props) => {
  const {
    zIndex,
    vectorTileLayerStyles,
    activeStyle,
    url,
    maxNativeZoom,
    minNativeZoom,
    maxZoom,
    minZoom,
    subdomains,
    accessKey,
    accessToken,
    interactive = true,
    ...rest
  } = props;

  const context = useLeafletContext();

  const options = {
    rendererFactory: L.canvas.tile,
    type: "protobuf",
    url,
    subdomains,
    interactive,
    zIndex,
    minZoom,
    minNativeZoom,
    vectorTileLayerStyles,
    getFeatureId: (e) => e.properties.id,
  };

  const container = context.layerContainer || context.map;

  const vectorGrid = L.vectorGrid.protobuf(url, { ...options });

  let highlightFeatureId;

  const clearHighlight = () => {
    if (highlightFeatureId) {
      vectorGrid.resetFeatureStyle(highlightFeatureId);
    }
    highlightFeatureId = null;
  };

  vectorGrid.on("click", (e) => {
    if (e.layer.properties) {
      const { id } = e.layer.properties;
      clearHighlight();
      highlightFeatureId = id;
      vectorGrid.setFeatureStyle(id, activeStyle);
    }
  });

  useEffect(() => {
    container.addLayer(vectorGrid);
    return () => {
      container.removeLayer(vectorGrid);
    };
  }, [context]);

  return null;
};
