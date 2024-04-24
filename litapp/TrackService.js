import Track from './Track.js'

export default class TrackService {
    constructor() {
        this.TRACK_URL = 'http://hindsholm.dk/pemba/tracks/';
        this.cache = undefined;
    }

    async getTracks() {
        if (this.cache !== undefined) {
            return this.cache;
        } else {
            const response = await fetch(this.TRACK_URL);
            const txt = await response.text();
            return this.extractData(txt);
        }
    }

    extractData(txt) {
        const dom = new DOMParser().parseFromString(txt, 'text/html'),
            links = Array.from(dom.links),
            tracks = [];
        for (const link of links) {
            const href = link.getAttribute('href'),
                isGpx = href.match(/([^/]+)\.gpx$/);
            if (isGpx) {
                const ymd = isGpx[1].match(/(\d{4})-?(\d{2})-?(\d{2})(.*)/);
                if (ymd) {
                    tracks.push(
                        new Track(`${ymd[1]}-${ymd[2]}-${ymd[3]}${ymd[4]}`,
                            this.TRACK_URL + href,
                            ymd[1],
                            ymd[2],
                            ymd[3])
                    );
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
