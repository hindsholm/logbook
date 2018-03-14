import Map from './Map.js';
import TrackService from './TrackService.js';
import TripSelector from './TripSelector.js';

export default class App {
    constructor() {
        this.map = new Map();
        this.trackService = new TrackService();
        this.trackService.getTracks().then(tracks => {
            this.tripSelector = new TripSelector(tracks);
            this.tripSelector.onTripSelected(trip => this.map.loadTrip(trip));
        });
    }
}

const app = new App();
