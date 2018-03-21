import Map from './Map.js';
import TrackService from './TrackService.js';
import TripSelector from './TripSelector.js';
import Footer from './Footer.js';

export default class App {
    constructor() {
        this.map = new Map();
        this.footer = new Footer();
        this.map.onTripLoaded(trip => this.footer.setTrip(trip));
        this.trackService = new TrackService();
        this.trackService.getTracks().then(tracks => {
            this.tripSelector = new TripSelector(tracks);
            this.tripSelector.onTripSelected(trip => this.map.loadTrip(trip));
        });
    }
}

const app = new App();
