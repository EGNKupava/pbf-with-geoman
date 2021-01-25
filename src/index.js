import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { MapContainer, TileLayer, LayersControl, useMap } from "react-leaflet";
import { useLeafletContext } from "@react-leaflet/core";

import L from "leaflet";
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

function MyVectorGrid(props) {
  const context = useLeafletContext();

  const style = {};

  const baseStyle = (properties, zoom) => {
    if (isFunction(style)) {
      return style(properties);
    } else if (isObject(style)) {
      return style;
    }
    return {
      weight: 0.5,
      opacity: 1,
      color: "#2040e3",
      fillColor: "#390870",
      fillOpacity: 0.6,
      fill: true,
      stroke: true,
    };
  };

  const options = {
    rendererFactory: L.canvas.tile,
    type: "protobuf",
    url:
      "https://terra.b-digital.by/api/terra/projects/1/geometry/vector-tile/{z}/{x}/{y}.pbf",
    vectorTileLayerStyles: {
      default: {
        weight: 1,
        color: "#FF0000",
        stroke: true,
      },
    },
    subdomains: "abcd",
    interactive: true,
    zIndex: 1000,
    minZoom: 10,
  };

  let highlight = null;
  let active = {
    weight: 2,
    fillColor: "#FE5FEF",
    fillOpacity: 0.8,
    fill: true,
  };

  let activeStyle = {
    weight: 2,
    fillColor: "#FE5FEF",
    fillOpacity: 0.8,
    fill: true,
  };

  const onClick = (e) => {
    console.log("CLICK!");
  };

  const container = context.layerContainer || context.map;

  const vectorGrid = L.vectorGrid.protobuf(url, { ...options });

  vectorGrid.on("click", (e) => {
    console.log(e);
    const { properties } = e.layer;
    console.log(properties);
    const featureId = _getFeatureId(e.layer);
    console.log("featureId: ", featureId);
    _propagateEvent(onClick, e);

    // set active style
    let st;
    if (isFunction(activeStyle)) {
      st = activeStyle(properties);
    } else if (isObject(activeStyle)) {
      st = cloneDeep(activeStyle);
    }
    if (!isEmpty(st) && featureId) {
      clearActive();
      active = featureId;
      const base = cloneDeep(baseStyle(properties));
      const active = extend(base, st);
      setFeatureStyle(featureId, active);
    }
  });

  useEffect(() => {
    container.addLayer(vectorGrid);

    return () => {
      container.removeLayer(vectorGrid);
    };
  });

  function _getFeatureId(feature) {
    const { idField } = props;
    if (isFunction(idField)) {
      return idField(feature);
    } else if (isString(idField)) {
      return feature.properties[idField];
    }
  }

  function _propagateEvent(eventHandler, e) {
    if (!isFunction(eventHandler)) return;
    const featureId = _getFeatureId(e.layer);
    const feature = getFeature(featureId);
    const event = cloneDeep(e);
    const mergedEvent = merge(event.target, {
      feature,
    });
    eventHandler(event);
  }

  function setFeatureStyle(id, style) {
    vectorGrid.setFeatureStyle(id, style);
  }

  function resetFeatureStyle(id) {
    vectorGrid.resetFeatureStyle(id);
  }

  function clearHighlight() {
    if (highlight && highlight !== active) {
      resetFeatureStyle(highlight);
    }
    highlight = null;
  }

  function clearActive() {
    if (active) {
      resetFeatureStyle(active);
    }
    active = null;
  }

  function getFeature(featureId) {
    const { data, idField } = props;
    if (isEmpty(data) || isEmpty(data.features)) return {};
    const feature = find(
      data.features,
      ({ properties }) => properties[idField] === featureId
    );
    return cloneDeep(feature);
  }

  return null;
}

const center = [55.9172, 39.1699];

const App = () => (
  <div>
    <MapContainer center={center} zoom={14} preferCanvas>
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
          <MyVectorGrid />
        </LayersControl.Overlay>
      </LayersControl>
    </MapContainer>
  </div>
);

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
