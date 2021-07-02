import * as React from 'react';
import {useState, useRef} from 'react';
import mapboxgl from "mapbox-gl";
import MapGL, {Source, Layer} from 'react-map-gl';
import { Radio } from '../components';
import { domain } from '../utils'

import {clusterLayer, clusterCountLayer, unclusteredPointLayer} from '../components/layers';

// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

const MAPBOX_TOKEN = 'pk.eyJ1IjoibWluaWd1bm5yIiwiYSI6ImNrcWdzMGxpMDIwM3AycXM3MWdneDFhY28ifQ.Z1xP1Lr6tDGhuodviJh9lg'; // Set your mapbox token here

export default function Map() {
  const [category, setCategory] = useState('events')
  const [viewport, setViewport] = useState({
    latitude: 39.7837304,
    longitude: -100.4458825,
    width: '80vw',
    height: '60vh',
    zoom: 4,
    bearing: 0,
    pitch: 50
  });
  const mapRef = useRef(null);

  const onClick = event => {
    const feature = event.features[0];
    const clusterId = feature.properties.cluster_id;

    const mapboxSource = mapRef.current.getMap().getSource('earthquakes');

    mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
      if (err) {
        return;
      }

      setViewport({
        ...viewport,
        longitude: feature.geometry.coordinates[0],
        latitude: feature.geometry.coordinates[1],
        zoom,
        transitionDuration: 500
      });
    });
  };

  const handleCategoryChange = e => {
    setCategory(e.target.value);
  }

  const controlStyle = {
    display: 'flex', flexDirection: 'column', border: '2px darkslateblue solid', borderRadius: 10, padding: '15px 30px'
  }

  return (
    <div style={{ display: 'grid', justifyContent: 'center', height: '90vh', alignContent: 'center'}}>
      <div style={{ display: 'flex', justifyContent: 'space-around', margin: '20px 0' }}>
        <div style={{...controlStyle}}>
            <Radio id='events' name='category' value='events' state={category} handler={handleCategoryChange} text='Events' />
            <Radio id='stats' name='category' value='stats' state={category} handler={handleCategoryChange} text='Stats' />
        </div>
      </div>

      <MapGL
        {...viewport}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        onViewportChange={setViewport}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        interactiveLayerIds={[clusterLayer.id]}
        onClick={onClick}
        ref={mapRef}
      >
        <Source
          id="earthquakes"
          type="geojson"
          data={`${domain}/${category}/geo`}
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={50}
        >
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
          <Layer {...unclusteredPointLayer} />
        </Source>
      </MapGL>
    </div>
  );
}
