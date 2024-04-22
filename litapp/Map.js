import { html, css, LitElement } from 'lit';
import { logbookStyles } from './styles.js';
import OLMap from 'ol/Map.js';
import View from 'ol/View.js';
import TileLayer from 'ol/layer/Tile.js';
import OSM from 'ol/source/OSM.js';
import XYZ from 'ol/source/XYZ.js';
import { fromLonLat, toLonLat } from 'ol/proj.js';

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
                height: 800px;
            }
        `
    ];

    constructor() {
        super();
        this.map = new OLMap({
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
    }

    firstUpdated() {
        const mapNode = this.renderRoot.querySelector('#map');
        this.map.setTarget(mapNode);
    }

    render() {
        return html`
            <main>
                <div id="map"></div>
            </main>
        `;
    }
}

customElements.define('lb-map', Map);
