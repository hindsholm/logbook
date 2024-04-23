import { html, css, LitElement } from 'lit';

import { fromLonLat, toLonLat } from 'ol/proj.js';
import Feature from 'ol/Feature.js';
import GPX from 'ol/format/GPX.js';
import Geometry from 'ol/geom/Geometry.js';
import OLMap from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import Stroke from 'ol/style/Stroke.js';
import Style from 'ol/style/Style.js';
import TileLayer from 'ol/layer/Tile.js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import View from 'ol/View.js';
import XYZ from 'ol/source/XYZ.js';

import { logbookStyles } from './styles.js';
import Trip from './Trip.js';

export class Map extends LitElement {
    static styles = [
        logbookStyles,
        css`
            main {
                margin: 0;
                padding: 0;
                flex: 1 1 100%;
                overflow: hidden;
            }
            #map {
                height: 600px;
            }
        `
    ];
    static properties = {
        trip: { type: Trip }
    };

    constructor() {
        super();
        /** @type {Trip} */
        this.trip;
        this.trackLayer = new VectorLayer({
            source: new VectorSource(),
            style: new Style({
                stroke: new Stroke({ color: 'red', width: 2 })
            }),
            renderOrder: null
        });
        let land = new TileLayer({
            source: new OSM()
        });
        let sea = new TileLayer({
            source: new XYZ({
                url: 'http://t1.openseamap.org/seamark/{z}/{x}/{y}.png',
                projection: undefined
            })
        });
        let view = new View({
            center: fromLonLat([10.1, 56.7], 'EPSG:3857'),
            zoom: 12
        });
        this.map = new OLMap({
            layers: [land, sea, this.trackLayer],
            view: view
        });
    }

    firstUpdated() {
        const mapNode = this.renderRoot.querySelector('#map');
        this.map.setTarget(mapNode);
    }

    updated(changedProperties) {
        if (changedProperties.has('trip')) {
            this.loadTrip();
        }
    }

    render() {
        return html`
            <main>
                <div id="map"></div>
            </main>
        `;
    }

    loadTrip() {
        if (!this.trip) {
            return;
        }
        console.log('Loading ' + this.trip.name);
        const trackSrc = new VectorSource({
            format: new GPX({
                readExtensions: feature => {
                    this.readExtension(this.trip, feature);
                }
            }),
            url: this.trip.track.url
        });
        trackSrc.once('change', e => {
            if (this.map) {
                this.map.getView().fit(trackSrc.getExtent(), { size: this.map.getSize(), padding: [10, 10, 10, 10] });
            }
        });
        this.trackLayer.setSource(trackSrc);
    }

    /**
     * @param {Trip} trip
     * @param {Feature<Geometry>} feature
     */
    readExtension(trip, feature) {
        const geometry = feature.getGeometry();
        if (geometry.getType() === 'MultiLineString') {
            const properties = feature.getProperties();
            trip.setDescription(properties['desc']);
            if (geometry.getLayout() == 'XYZM') {
                console.log(toLonLat(geometry.getFirstCoordinate()));
                const start = new Date(1000 * geometry.getFirstCoordinate()[3]);
                const end = new Date(1000 * geometry.getLastCoordinate()[3]);
                trip.setDuration(start, end);
            } else {
                console.log(`{trip.name} does not have XYZM layout`);
            }
        }
    }

}

customElements.define('lb-map', Map);
