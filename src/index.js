import React from "react";
import ReactDOM from "react-dom";
import {
  Map,
  TileLayer,
  Marker,
  Tooltip,
  withLeaflet,
  useLeaflet
} from "react-leaflet";

import VectorGridDefault from "react-leaflet-vectorgrid";
import L from "leaflet";

import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";

import "./styles.css";

const VectorGrid1 = withLeaflet(VectorGridDefault);

const Geoman = (props) => {
  const { map } = useLeaflet();

  map.pm.addControls({
    position: "topleft",
    drawCircle: false,
    drawRectangle: false,
    drawMarker: false,
    drawCircleMarker: false,
    drawPolyline: false,
    cutPolygon: false
  });

  map.pm.setGlobalOptions({
    snapDistance: 20,
    allowSelfIntersection: false
  });

  return null;
};

const options = {
  type: "protobuf",
  url:
    "https://terra.b-digital.by/api/terra/projects/1/geometry/vector-tile/{z}/{x}/{y}.pbf",
  vectorTileLayerStyles: {
    default: {
      weight: 2,
      fillColor: "#c545d3",
      color: "#c545d3",
      fillOpacity: 0.5,
      opacity: 0.4
    }
  },
  subdomains: "abcd",
  interactive: true
};

const App = () => (
  <div>
    <Map center={[55.9172, 39.1699]} zoom={13}>
      {/* <TileLayer
        attribution="&copy; ArcGIS"
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      /> */}
      <Geoman />
      <VectorGrid1 {...options} />
    </Map>
  </div>
);

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
