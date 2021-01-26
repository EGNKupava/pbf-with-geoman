import React from "react";
import ReactDOM from "react-dom";
import { MapContainer, TileLayer, LayersControl } from "react-leaflet";
import { useLeafletContext } from "@react-leaflet/core";
import ReactLeafletGoogleLayer from "react-leaflet-google-layer";

import { PBFVectorGrid } from "./pbf-vector-grid";

import "./styles.css";

const pbfGridOptions = {
  vectorTileLayerStyles: {
    default: {
      weight: 1,
      color: "#FF0000",
      stroke: true,
    },
  },
  activeStyle: {
    weight: 2,
    color: "#D2FF53",
    fill: false,
  },
  url:
    "https://terra.b-digital.by/api/terra/projects/1/geometry/vector-tile/{z}/{x}/{y}.pbf",
  subdomains: "abcd",
  interactive: true,
  zIndex: 1000,
  minZoom: 14,
  maxZoom: 21,
  minNativeZoom: 7,
  maxNativeZoom: 21,
};

const center = [55.9172, 39.1699];

const API_KEY = "";

const App = () => (
  <div>
    <MapContainer center={center} zoom={18} preferCanvas>
      <LayersControl position="topright">
        <LayersControl.Overlay name="OpenStreetMap.Mapnik">
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.Overlay>
        <LayersControl.Overlay name="ArcGIS">
          <TileLayer
            attribution="&copy; ArcGIS"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        </LayersControl.Overlay>
        <LayersControl.Overlay checked name="PBF layer">
          <PBFVectorGrid {...pbfGridOptions} />
        </LayersControl.Overlay>
        <LayersControl.Overlay name="Google maps">
          <ReactLeafletGoogleLayer
            apiKey={API_KEY}
            type={"satellite"}
            opacity="0.6"
          />
        </LayersControl.Overlay>
      </LayersControl>
    </MapContainer>
  </div>
);

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
