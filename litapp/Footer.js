import { html, css, LitElement } from 'lit';
import { logbookStyles } from './styles.js';
import Trip from './Trip.js';

export class Footer extends LitElement {
    static styles = [
        logbookStyles
    ];

    static properties = {
        trip: { type: Trip }
    }

    constructor() {
        super();
        /** @type {Trip} */
        this.trip;
    }

    render() {
        return this.trip
            ? html`
                <footer>
                    <div id="footer" class="nudge--left no-margin-vertical color--white">
                        ${this.trip.name} from ${this.format(this.trip.start)} to ${this.format(this.trip.end)} ${this.trip.description || ''}
                    </div>
                </footer>`
            : html`<footer><div id="footer" class="nudge--left no-margin-vertical color--white">Select year, month and day</div></footer>`;
    }

    /** @param {Date} date */
    format(date) {
        return date ? date.toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit', hour12: false }) : '';
    }

}

customElements.define('lb-footer', Footer);
