/**
 * Responsible for selecting the trip to show.
 */
export default class TripSelector {
    constructor(tracks) {
        this.tracks = tracks;
        this.yearSelector = new YearSelector(this);
        this.monthSelector = new MonthSelector(this);
        this.daySelector = new DaySelector(this);
        document.querySelector('#previous').addEventListener('click', _ => {
            this.previousTrip();
        });
        document.querySelector('#next').addEventListener('click', _ => {
            this.nextTrip();
        });
    }

    onTripSelected(listener) {
        this.listener = listener;
    }

    hasPrevious() {
        return this.track && this.tracks.indexOf(this.track) > 0;
    }

    previousTrip() {
        if (this.hasPrevious()) {
            this.trackSelected(this.tracks[this.tracks.indexOf(this.track) - 1]);
        }
    }

    hasNext() {
        return this.track && this.tracks.indexOf(this.track) < this.tracks.length - 1;
    }

    nextTrip() {
        if (this.hasNext()) {
            this.trackSelected(this.tracks[this.tracks.indexOf(this.track) + 1]);
        }
    }

    yearSelected(year) {
        this.year = year;
        this.monthSelector.setYear(year);
        this.daySelector.setYear(year);
    }

    monthSelected(month) {
        this.daySelector.setMonth(month);
    }

    trackSelected(track) {
        this.track = track;
        this.yearSelector.setTrack(track);
        this.monthSelector.setTrack(track);
        this.daySelector.setTrack(track);
        if (this.listener) {
            this.listener(track);
        }
    }
}

class YearSelector {
    constructor(tripSelector) {
        this.tripSelector = tripSelector;
        this.node = document.querySelector('#year');
        let years = this.getUniqueYears(tripSelector.tracks);
        years.forEach(year => {
            this.createMenuItem(year);
        });
    }

    setTrack(track) {
        this.node['value'] = track.year;
    }

    getUniqueYears(tracks) {
        let years = new Set();
        tracks.forEach(track => {
            years.add(track.year);
        });
        return years;
    }

    createMenuItem(year) {
        let option = document.createElement('option');
        option.innerText = year;
        option.onclick = _ => {
            this.tripSelector.yearSelected(year);
        };
        this.node.appendChild(option);
    }
}

class MonthSelector {
    constructor(tripSelector) {
        this.tripSelector = tripSelector;
        this.node = document.querySelector('#month');
    }

    setYear(year) {
        if (this.year !== year) {
            this.year = year;
            this.reset();
            let months = this.getMonthsForYear(year);
            months.forEach(month => {
                this.createMenuItem(month);
            });
        }
    }

    setTrack(track) {
        this.setYear(track.year);
        this.node['value'] = track.month;
    }

    reset() {
        this.node.innerHTML = '<option>Month</option>';
    }

    getMonthsForYear(year) {
        let months = new Set();
        this.tripSelector.tracks.forEach(track => {
            if (track.year === year) {
                months.add(track.month);
            }
        });
        return months;
    }

    createMenuItem(month) {
        let option = document.createElement('option');
        option.innerText = month;
        option.onclick = evt => {
            this.tripSelector.monthSelected(month);
        };
        this.node.appendChild(option);
    }
}

class DaySelector {
    constructor(tripSelector) {
        this.tripSelector = tripSelector;
        this.node = document.querySelector('#day');
    }

    setYear(year) {
        if (this.year !== year) {
            this.year = year;
            this.month = undefined;
            this.reset();
        }
    }

    setMonth(month) {
        if (this.month !== month) {
            this.month = month;
            this.reset();
            this.tripSelector.tracks.forEach(track => {
                if (track.year === this.year && track.month === month) {
                    this.createMenuItem(track);
                }
            });
        }
    }

    setTrack(track) {
        this.setYear(track.year);
        this.setMonth(track.month);
        this.node['value'] = track.day;
    }

    reset() {
        this.node.innerHTML = '<option>Day</option>';
    }

    createMenuItem(track) {
        let option = document.createElement('option');
        option.innerText = track.day;
        option.onclick = _ => {
            this.tripSelector.trackSelected(track);
        };
        this.node.appendChild(option);
    }
}
