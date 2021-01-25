import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { Map, TileLayer, LayersControl } from "react-leaflet";
import L from "leaflet";
import {
  createOverlayComponent,
  createLayerComponent,
  useLeafletContext
} from "@react-leaflet/core";

import "leaflet.vectorgrid";

import isObject from "lodash/isObject";
import isFunction from "lodash/isFunction";
import isString from "lodash/isString";
import isEmpty from "lodash/isEmpty";
import clone from "lodash/clone";
import cloneDeep from "lodash/cloneDeep";
import extend from "lodash/extend";
import merge from "lodash/merge";
import has from "lodash/has";
import find from "lodash/find";

import "./styles.css";

const url =
  "https://terra.b-digital.by/api/terra/projects/1/geometry/vector-tile/{z}/{x}/{y}.pbf";

function Square(props) {
  const context = useLeafletContext();

  useEffect(() => {
    const bounds = L.latLng(props.center).toBounds(props.size);
    const square = new L.Rectangle(bounds);
    const container = context.layerContainer || context.map;
    container.addLayer(square);

    return () => {
      container.removeLayer(square);
    };
  });

  return null;
}

// function MyVectorGrid(props) {
//   const context = useLeafletContext();
//   const { map, pane } = context;
//   const container = context.layerContainer || context.map;

//   useEffect(() => {
//     const bounds = L.latLng(props.center).toBounds(props.size);
//     const square = new L.Rectangle(bounds);
//     const container = context.layerContainer || context.map;
//     container.addLayer(square);

//     return () => {
//       container.removeLayer(square);
//     };
//   });
// const vectorGrid = L.vectorGrid
//   .protobuf(url, {
//     vectorTileLayerStyles: {
//       weight: 0.5,
//       opacity: 1,
//       color: "#ccc",
//       fillColor: "#390870",
//       fillOpacity: 0.6,
//       fill: true,
//       stroke: true
//     },
//     interactive: true,
//     zIndex: 1000
//   })
//   .addTo(map);

const center = [55.9172, 39.1699];

const App = () => (
  <div>
    <Map center={center} zoom={14}>
      <LayersControl position="topright">
        <LayersControl.Overlay name="ArcGIS">
          <TileLayer
            attribution="&copy; ArcGIS"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        </LayersControl.Overlay>
      </LayersControl>
      {/* <MyVectorGrid /> */}
      <Square center={center} size={1000} />
    </Map>
  </div>
);

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
