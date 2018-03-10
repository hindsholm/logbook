export default class TrackService {
    constructor() {
        this.TRACK_URL = 'http://pemba.hindsholm.dk/tracks/';
        this.cache = undefined;
    }

    getTracks() {
        if (this.cache !== undefined) {
            return Promise.resolve(this.cache);
        } else {
            return fetch(this.TRACK_URL)
                .then(response => response.text())
                .then(txt => this.extractData(txt));
        }
    }

    getTrack(name) {
        return this.getTracks().then(tracks => {
            for (let track of tracks) {
                if (name === track.name) {
                    return track;
                }
            }
            throw 'Track not found: ' + name;
        });
    }

    extractData(txt) {
        let dom = new DOMParser().parseFromString(txt, 'text/html'),
            links = Array.from(dom.links),
            tracks = [];
        for (let link of links) {
            let href = link.getAttribute('href'),
                isGpx = href.match(/([^/]+)\.gpx$/);
            if (isGpx) {
                tracks.push({
                    name: isGpx[1].replace(/(\d{4})-?(\d{2})-?(\d{2})(.*)/, '$1-$2-$3$4') || isGpx[1],
                    url: this.TRACK_URL + href
                });
            }
        }
        tracks.sort((a, b) => {
            return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
        });
        this.cache = tracks;
        return tracks;
    }
}
