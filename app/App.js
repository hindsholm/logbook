import Map from './Map.js';
import TripSelector from './TripSelector.js';
import TrackService from './TrackService.js';

export default class App {
    constructor() {
        this.map = new Map();
        this.trackService = new TrackService();
        this.trackService.getTracks().then(tracks => {
            this.tripSelector = new TripSelector(tracks, this.map);
        });
    }
}

const app = new App();
