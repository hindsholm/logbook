import { html, css, LitElement } from 'lit';
import TrackService from './TrackService.js';

import './Header.js'
import './Main.js'
import './Footer.js'

export class LogbookApp extends LitElement {

    static properties = {
        _tracks: { state: true }
    };

    constructor() {
        super();
        this.trackService = new TrackService();
    }

    connectedCallback() {
        super.connectedCallback();
        this._tracks = this.trackService.getTracks();
    }

    render() {
        return html`
            <lb-header .tracks=${this._tracks}></lb-header>
            <lb-main></lb-main>
            <lb-footer></lb-footer>
        `;
    }
}

customElements.define('lb-app', LogbookApp);
