import { html, css, LitElement } from 'lit';
import { logbookStyles } from './styles.js';

import './TripSelector.js'

export class Header extends LitElement {

    static properties = {
        tracks: {}
    };

    static styles = [
        logbookStyles,
        css`
            header {
                margin: 0;
                padding: 0;
                padding-top: 1em;
            }
        `
    ];

    render() {
        return html`
            <header class="container--baseline">
                <h1 class="nudge--left">Logbook</h1>
                <div style="flex: 1 1 100%"></div>
                <lb-trip-selector .tracks=${this.tracks}></lb-trip-selector>
            </header>
        `;
    }
}

customElements.define('lb-header', Header);
