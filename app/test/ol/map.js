import { fromLonLat, toLonLat } from 'ol/proj.js';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import TileLayer from 'ol/layer/Tile.js';
import OSM from 'ol/source/OSM.js';
import XYZ from 'ol/source/XYZ.js';

const map = new Map({
    layers: [
        new TileLayer({
            source: new OSM()
        }),
        new TileLayer({
            source: new XYZ({
                url: 'http://t1.openseamap.org/seamark/{z}/{x}/{y}.png',
                projection: undefined
            })
        })
    ],
    target: 'map',
    view: new View({
        center: fromLonLat([10.1, 56.7], 'EPSG:3857'),
        zoom: 12
    })
});
