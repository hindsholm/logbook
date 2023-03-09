import { fromLonLat, toLonLat } from 'ol/proj.js';
import OlMap from 'ol/Map.js';
import GPX from 'ol/format/GPX.js';
import OSM from 'ol/source/OSM.js';
import Stroke from 'ol/style/Stroke.js';
import Style from 'ol/style/Style.js';
import Tile from 'ol/layer/Tile.js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import View from 'ol/View.js';
import XYZ from 'ol/source/XYZ.js';

export default class Map {
    constructor() {
        this.trackLayer = new VectorLayer({
            source: new VectorSource(),
            style: new Style({
                stroke: new Stroke({ color: 'red', width: 2 })
            }),
            renderOrder: null
        });
        let land = new Tile({
            source: new OSM()
            // source: new ol.source.BingMaps({
            //     key: 'AvzjjrvdUbpbaSZt6mBxjJf6-edLi-QZ6FBVuMz1KWO90sNeGqG8mlpJNoOcr8zB',
            //     imagerySet: 'AerialWithLabels',
            //     maxZoom: 19
            // })
        });
        let sea = new Tile({
            source: new XYZ({
                url: 'http://t1.openseamap.org/seamark/{z}/{x}/{y}.png',
                projection: undefined
            })
        });
        let view = new View({
            center: fromLonLat([10.1, 56.7], 'EPSG:3857'),
            zoom: 12
        });
        this.map = new OlMap({
            target: 'map',
            layers: [land, sea, this.trackLayer],
            view: view
        });
    }

    loadTrip(trip) {
        console.log('Loading ' + trip.name);
        let trackSrc = new VectorSource({
            format: new GPX({
                readExtensions: feature => {
                    this.readExtension(trip, feature);
                }
            }),
            url: trip.track.url
        });
        trackSrc.once('change', e => {
            if (this.map) {
                this.map.getView().fit(trackSrc.getExtent(), { size: this.map.getSize(), padding: [10, 10, 10, 10] });
            }
        });
        this.trackLayer.setSource(trackSrc);
    }

    onTripLoaded(listener) {
        this.listener = listener;
    }

    readExtension(trip, feature) {
        let geometry = feature.getGeometry();
        if (geometry.getType() === 'MultiLineString') {
            let properties = feature.getProperties();
            trip.setDescription(properties['desc']);
            if (geometry.getLayout() == 'XYZM') {
                console.log(toLonLat(geometry.getFirstCoordinate()));
                let start = new Date(1000 * geometry.getFirstCoordinate()[3]);
                let end = new Date(1000 * geometry.getLastCoordinate()[3]);
                trip.setDuration(start, end);
            } else {
                console.log(`{trip.name} does not have XYZM layout`);
            }
            if (this.listener) {
                this.listener(trip);
            }
        }
    }
}
