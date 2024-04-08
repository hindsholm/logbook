import { html, css, LitElement } from 'lit';
import { logbookStyles } from './styles.js';

export class TripSelector extends LitElement {

    static properties = {
        tracks: {}
    };

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

    render() {
        console.log(this.tracks);
        return html`
            <div>
                <button id="previous" class="btn--raised nudge--right" title="Previous Trip">&lt;</button>
                <select id="year" required><option disabled selected value="">Year</option></select>
                <select id="month" required><option disabled selected value="">Month</option></select>
                <select id="day" required><option disabled selected value="">Day</option></select>
                <button id="next" class="btn--raised nudge--left nudge--right" title="Next Trip">&gt;</button>
            </div>
        `;
    }
}

customElements.define('lb-trip-selector', TripSelector);
