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
                let ymd = isGpx[1].match(/(\d{4})-?(\d{2})-?(\d{2})(.*)/);
                if (ymd) {
                    tracks.push({
                        name: `${ymd[1]}-${ymd[2]}-${ymd[3]}${ymd[4]}`,
                        url: this.TRACK_URL + href,
                        year: ymd[1],
                        month: ymd[2],
                        day: ymd[3]
                    });
                } else {
                    console.log(`${href} does not comply with yyyy-mm-dd format`);
                }
            }
        }
        tracks.sort((a, b) => {
            return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
        });
        this.cache = tracks;
        return tracks;
    }
}
