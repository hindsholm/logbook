import { html, css, LitElement } from 'lit';
import TrackService from './TrackService.js';

import './Header.js'
import './Map.js'
import './Footer.js'

export class LogbookApp extends LitElement {

    static properties = {
        _tracks: { state: true },
        _track: { state: true },
        _trip: { state: true }
    };

    constructor() {
        super();
        /** @type {Track} */
        this._track
        /** @type {Trip} */
        this._trip;
        this.trackService = new TrackService();
        this._tracks = [];
    }

    connectedCallback() {
        super.connectedCallback();
        this.trackService.getTracks().then(t => {
            this._tracks = t;
        });
    }

    render() {
        return html`
            <lb-header .tracks=${this._tracks} @track-selected=${this.trackSelected}></lb-header>
            <lb-map .track=${this._track} @trip-loaded=${this.tripLoaded}></lb-map>
            <lb-footer .trip=${this._trip}></lb-footer>
        `;
    }

    /** @param {CustomEvent<Track>} evt */
    trackSelected(evt) {
        this._track = evt.detail;
    }

    /** @param {CustomEvent<Trip>} evt */
    tripLoaded(evt) {
        this._trip = evt.detail;
    }
}

customElements.define('lb-app', LogbookApp);
