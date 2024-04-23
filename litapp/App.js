import { html, css, LitElement } from 'lit';
import TrackService from './TrackService.js';

import './Header.js'
import './Map.js'
import './Footer.js'

export class LogbookApp extends LitElement {

    static properties = {
        _tracks: { state: true },
        _trip: { state: true }
    };

    constructor() {
        super();
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
            <lb-header .tracks=${this._tracks} @trip-selected=${this.tripSelected}></lb-header>
            <lb-map .trip=${this._trip}></lb-map>
            <lb-footer .trip=${this._trip}></lb-footer>
        `;
    }

    /** @param {CustomEvent<Trip>} evt */
    tripSelected(evt) {
        this._trip = evt.detail;
    }
}

customElements.define('lb-app', LogbookApp);
