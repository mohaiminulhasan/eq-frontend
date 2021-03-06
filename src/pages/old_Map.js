import { useEffect, useState } from 'react';
import ReactMapGL from 'react-map-gl';
import mapboxgl from "mapbox-gl";
import { Pins } from '../components';
import { domain } from '../utils';

// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;


export const Map = () => {
    const [data, setData] = useState([])
    const [viewport, setViewport] = useState({
        latitude: 39.7837304,
        longitude: -100.4458825,
        width: '50vw',
        height: '50vh',
        zoom: 3,
        pitch: 50
    })

    useEffect(() => {
        async function fetchData() {
            const uri = `${domain}/poi`;
            console.log(uri);

            let h = new Headers();
            h.append('Content-Type', 'application/json');

            let req = new Request(uri, {
                method: 'GET',
                headers: h,
                mode: 'cors'
            });

            const response = await fetch(req);
            const json = await response.json();
            
            setData(json);

        }
        
        fetchData();
    }, [])

    return (
        <div style={{ display: 'grid', justifyContent: 'center', height: '90vh', alignContent: 'center'}}>
            <ReactMapGL
                mapStyle='mapbox://styles/mapbox/dark-v10'
                mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
                {...viewport}
                onViewportChange={(viewport) => setViewport(viewport)}
            >
            <Pins data={data} />
            </ReactMapGL>
        </div>
    );
}
