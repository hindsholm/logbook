import Track from "./Track.js";

export default class Trip {

    /**
     * @param {Track} track
     */
    constructor(track) {
        this.track = track;
        this.name = track.name;
    }

    /**
     * @param {string} description
     */
    setDescription(description) {
        this.description = description;
    }

    /**
     * @param {Date} start
     * @param {Date} end
     */
    setDuration(start, end) {
        this.start = start;
        this.end = end;
        console.log(`Start: ${start}, End: ${end}`);
    }
}
