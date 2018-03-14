export default class Trip {
    constructor(track) {
        this.track = track;
        this.name = track.name;
    }

    setDuration(start, end) {
        this.start = start;
        this.end = end;
        console.log(`Start: ${start}, End: ${end}`);
    }
}
