import { hhmmFormat } from './util.js';

export default class Footer {
    constructor() {
        this.div = document.querySelector('#footer');
    }

    setTrip(trip) {
        this.div.innerHTML = `${trip.name} from ${hhmmFormat(trip.start)} to ${hhmmFormat(trip.end)} ${trip.description || ''}`;
    }
}
