import { html, css, LitElement } from 'lit';
import { logbookStyles } from './styles.js';
import Trip from './Trip.js';

export class TripSelector extends LitElement {

    static styles = [
        logbookStyles,
        css`
            select {
                color: white;
                background-color: transparent;
                padding-left: 8px;
                padding-right: 20px;
                margin: 2px;
                text-align: center;
                font-size: 100%;
                /* Removes the default <select> styling */
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
                /* Positions background arrow image */
                background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAh0lEQVQ4T93TMQrCUAzG8V9x8QziiYSuXdzFC7h4AcELOPQAdXYovZCHEATlgQV5GFTe1ozJlz/kS1IpjKqw3wQBVyy++JI0y1GTe7DCBbMAckeNIQKk/BanALBB+16LtnDELoMcsM/BESDlz2heDR3WePwKSLo5eoxz3z6NNcFD+vu3ij14Aqz/DxGbKB7CAAAAAElFTkSuQmCC');
                background-repeat: no-repeat;
                background-position: right center;
            }

            select option {
                background-color: #2980b9;
            }

            select:invalid {
                box-shadow: none !important;
            }
        `
    ];

    static properties = {
        tracks: { type: Array }
    };

    /** @type {HTMLSelectElement} */
    yearSelectElement;
    /** @type {HTMLSelectElement} */
    monthSelectElement;
    /** @type {HTMLSelectElement} */
    daySelectElement;

    willUpdate(changedProperties) {
        if (changedProperties.has('tracks')) {
            console.log('tracks:', this.tracks);
        }
    }

    render() {
        return html`
            <div>
                <button id="previous" class="btn--raised nudge--right" title="Previous Trip">&lt;</button>
                <select id="year" required @change="${this.yearSelected}">
                    <option disabled selected value="">Year</option>
                    ${this.getYears().map(year =>
                        html`<option value="${year}">${year}</option>`
                    )}
                </select>
                <select id="month" required @change="${this.monthSelected}">
                    <option disabled selected value="">Month</option>
                    ${this.getMonths().map(month =>
                        html`<option value="${month}">${month}</option>`
                    )}
                </select>
                <select id="day" required @change="${this.daySelected}">
                    <option disabled selected value="">Day</option>
                    ${this.getTracksForMonth().map(track =>
                        html`<option value="${track.name}">${track.day}</option>`
                    )}
                </select>
                <button id="next" class="btn--raised nudge--left nudge--right" title="Next Trip">&gt;</button>
            </div>
        `;
    }

    firstUpdated() {
        this.yearSelectElement = this.renderRoot.querySelector('#year');
        this.monthSelectElement = this.renderRoot.querySelector('#month');
        this.daySelectElement = this.renderRoot.querySelector('#day');
    }

    getYears() {
        return [...new Set(this.tracks.map(track => track.year))];
    }

    yearSelected(evt) {
        console.log('selected year:', evt.target['selectedOptions'][0].value);
        this.resetMonth();
        this.requestUpdate(); // Component state is unchanged so no automatic update
    }

    getSelectedYear() {
        return this.yearSelectElement.value;
    }

    getMonths() {
        return [...new Set(this.tracks
            .filter(track => this.getSelectedYear() === track.year)
            .map(track => track.month)
        )];
    }

    monthSelected(evt) {
        console.log('selected month:', evt.target['selectedOptions'][0].value);
        this.resetDay();
        this.requestUpdate(); // Component state is unchanged so no automatic update
    }

    getSelectedMonth() {
        return this.monthSelectElement.value;
    }

    resetMonth() {
        this.monthSelectElement.value = '';
        this.resetDay();
    }

    getTracksForMonth() {
        return this.tracks
            .filter(track => this.getSelectedYear() === track.year && this.getSelectedMonth() === track.month);
    }

    daySelected(evt) {
        const trackName = evt.target['selectedOptions'][0].value;
        const track = this.tracks.find(t => t.name === trackName);
        console.log('selected track:', track);
        const event = new CustomEvent('trip-selected', {
            bubbles: true,
            composed: true,
            detail: new Trip(track)
        });
        this.dispatchEvent(event);
    }

    resetDay() {
        this.daySelectElement.value = '';
    }

}

customElements.define('lb-trip-selector', TripSelector);
