export default class Track {
    constructor(name, url, year, month, day) {
        this.name = name;
        this.url = url;
        this.year = year;
        this.month = month;
        this.day = day;
    }

    toString() {
        return `${this.year}-${this.month}-${this.day} ${this.name}`;
    }
}
