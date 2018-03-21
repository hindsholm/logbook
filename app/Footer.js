export default class Footer {
    constructor() {
        this.div = document.querySelector('#footer');
    }

    setTrip(trip) {
        this.div.innerHTML = `${trip.name} from ${trip.start.toLocaleTimeString()} to ${trip.end.toLocaleTimeString()} ${trip.description ||
            ''}`;
    }
}
