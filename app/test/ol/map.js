import { fromLonLat, toLonLat } from 'https://cdn.jsdelivr.net/npm/ol@7.2.2/proj.js';
import Map from 'https://cdn.jsdelivr.net/npm/ol@7.2.2/Map.js';
import View from 'https://cdn.jsdelivr.net/npm/ol@7.2.2/View.js';
import TileLayer from 'https://cdn.jsdelivr.net/npm/ol@7.2.2/layer/Tile.js';
import OSM from 'https://cdn.jsdelivr.net/npm/ol@7.2.2/source/OSM.js';
import XYZ from 'https://cdn.jsdelivr.net/npm/ol@7.2.2/source/XYZ.js';

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
