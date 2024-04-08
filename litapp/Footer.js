import { html, css, LitElement } from 'lit';
import { logbookStyles } from './styles.js';

export class Footer extends LitElement {
    static styles = [
        logbookStyles
    ];

    render() {
        return html`
            <footer>
                <div id="footer" class="nudge--left no-margin-vertical color--white">Made with ES6</div>
            </footer>
        `;
    }
}

customElements.define('lb-footer', Footer);
