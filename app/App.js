import Map from './Map.js';
import TrackService from './TrackService.js';
import TripSelector from './TripSelector.js';

export default class App {
    constructor() {
        this.map = new Map();
        this.trackService = new TrackService();
        this.trackService.getTracks().then(tracks => {
            this.tripSelector = new TripSelector(tracks);
            this.tripSelector.onTripSelected(track => this.map.loadTrack(track.url));
        });
    }
}

const app = new App();
