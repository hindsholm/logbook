import Trip from './Trip.js';

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
            this.listener(new Trip(track));
        }
    }
}

class YearSelector {
    constructor(tripSelector) {
        this.tripSelector = tripSelector;
        let years = this.getUniqueYears(tripSelector.tracks);
        this.select = document.querySelector('#year');
        this.select.innerHTML = `<option disabled selected value="">Year</option>
            ${years.map(year => `<option>${year}</option>`).join('')}`;
        this.select.addEventListener('change', evt => {
            this.tripSelector.yearSelected(evt.target['selectedOptions'][0].value);
        });
    }

    setTrack(track) {
        this.select['value'] = track.year;
    }

    getUniqueYears(tracks) {
        let years = new Set();
        tracks.forEach(track => {
            years.add(track.year);
        });
        return Array.from(years);
    }
}

class MonthSelector {
    constructor(tripSelector) {
        this.tripSelector = tripSelector;
        this.select = document.querySelector('#month');
        this.select.addEventListener('change', evt => {
            this.tripSelector.monthSelected(evt.target['selectedOptions'][0].value);
        });
    }

    setYear(year) {
        if (this.year !== year) {
            this.year = year;
            let months = this.getMonthsForYear(year);
            this.select.innerHTML = `<option disabled selected value="">Month</option>
                ${months.map(month => `<option>${month}</option>`).join('')}`;
        }
    }

    setTrack(track) {
        this.setYear(track.year);
        this.select['value'] = track.month;
    }

    reset() {
        this.select.innerHTML = '<option disabled selected value="">Month</option>';
    }

    getMonthsForYear(year) {
        let months = new Set();
        this.tripSelector.tracks.forEach(track => {
            if (track.year === year) {
                months.add(track.month);
            }
        });
        return Array.from(months);
    }
}

class DaySelector {
    constructor(tripSelector) {
        this.tripSelector = tripSelector;
        this.select = document.querySelector('#day');
        this.select.addEventListener('change', evt => {
            let name = evt.target['selectedOptions'][0].value;
            let track = this.tripSelector.tracks.find(t => name === t.name);
            this.tripSelector.trackSelected(track);
        });
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
        this.select['value'] = track.name;
    }

    reset() {
        this.select.innerHTML = '<option disabled selected value="">Day</option>';
    }

    createMenuItem(track) {
        let option = document.createElement('option');
        option.innerText = track.day;
        option.value = track.name;
        this.select.appendChild(option);
    }
}
