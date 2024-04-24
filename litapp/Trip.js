import Track from "./Track.js";

export default class Trip {

    /**
     * @param {Track} track
     * @param {string} [description='']
     * @param {Date} [start=new Date(0)]
     * @param {Date} [end=new Date(0)]
     */
    constructor(track, description = '', start = new Date(0), end = new Date(0)) {
        this.track = track;
        this.name = track.name;
        this.description = description;
        this.start = start;
        this.end = end;
    }

}
