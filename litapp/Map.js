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
import Track from './Track.js';
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
        track: { type: Track }
    };

    constructor() {
        super();
        /** @type {Track} */
        this.track;
        this.trackLayer = new VectorLayer({
            source: new VectorSource(),
            style: new Style({
                stroke: new Stroke({ color: 'red', width: 2 })
            }),
            renderOrder: null
        });
        const land = new TileLayer({
            source: new OSM()
        });
        const sea = new TileLayer({
            source: new XYZ({
                url: 'http://t1.openseamap.org/seamark/{z}/{x}/{y}.png',
                projection: undefined
            })
        });
        const view = new View({
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
        if (changedProperties.has('track')) {
            this.loadTrack();
        }
    }

    render() {
        return html`
            <main>
                <div id="map"></div>
            </main>
        `;
    }

    loadTrack() {
        if (!this.track) {
            return;
        }
        console.log('Loading ' + this.track.name);
        const trackSrc = new VectorSource({
            format: new GPX({
                readExtensions: feature => {
                    this.readExtension(feature);
                }
            }),
            url: this.track.url
        });
        trackSrc.once('change', e => {
            if (this.map) {
                this.map.getView().fit(trackSrc.getExtent(), {
                    size: this.map.getSize(),
                    padding: [20, 20, 20, 20]
                });
            }
        });
        this.trackLayer.setSource(trackSrc);
    }

    /**
     * @param {Feature<Geometry>} feature
     */
    readExtension(feature) {
        const geometry = feature.getGeometry();
        if (geometry.getType() === 'MultiLineString') {
            const description = (feature.getProperties())['desc'];
            let start = null;
            let end = null;
            if (geometry.getLayout() === 'XYZM') {
                start = new Date(1000 * geometry.getFirstCoordinate()[3]);
                end = new Date(1000 * geometry.getLastCoordinate()[3]);
            } else {
                console.log(`${this.track.name} does not have XYZM layout`);
            }
            const trip = new Trip(this.track, description, start, end);
            this.dispatchTripLoaded(trip);
        }
    }

    /** @param {Trip} trip */
    dispatchTripLoaded(trip) {
        this.dispatchEvent(new CustomEvent('trip-loaded', {
            bubbles: true,
            composed: true,
            detail: trip
        }));
    }
}

customElements.define('lb-map', Map);
