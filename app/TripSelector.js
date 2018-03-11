export default class TripSelector {
    constructor(tracks) {
        this.tracks = tracks;
        this.yearSelector = new YearSelector(this);
        this.monthSelector = new MonthSelector(this);
        this.daySelector = new DaySelector(this);
        document.querySelector('#previous').onclick = _ => {
            this.previousTrip();
        };
        document.querySelector('#next').onclick = _ => {
            this.nextTrip();
        };
    }

    onTripSelected(listener) {
        this.listener = listener;
    }

    hasPrevious() {
        return this.track && this.tracks.indexOf(this.track) > 0;
    }

    previousTrip() {
        if (this.hasPrevious()) {
            this.setTrack(this.tracks[this.tracks.indexOf(this.track) - 1]);
        }
    }

    hasNext() {
        return this.track && this.tracks.indexOf(this.track) < this.tracks.length - 1;
    }

    nextTrip() {
        if (this.hasNext()) {
            this.setTrack(this.tracks[this.tracks.indexOf(this.track) + 1]);
        }
    }

    setYear(year) {
        this.year = year;
        this.monthSelector.reset();
        this.daySelector.reset();
        this.monthSelector.setYear(year);
    }

    setMonth(month) {
        this.daySelector.reset();
        this.daySelector.setYearMonth(this.year, month);
    }

    setTrack(track) {
        this.track = track;
        this.yearSelector.setTitle(track.year);
        this.monthSelector.setTitle(track.month);
        this.daySelector.setTitle(track.day);
        if (this.listener) {
            this.listener(track);
        }
    }
}

class YearSelector {
    constructor(tripSelector) {
        this.tripSelector = tripSelector;
        this.node = document.querySelector('#year');
        this.ul = document.createElement('ul');
        this.node.appendChild(this.ul);
        let years = this.getUniqueYears(tripSelector.tracks);
        years.forEach(year => {
            this.createMenuItem(year);
        });
    }

    setTitle(title) {
        this.node.firstElementChild.innerHTML = title;
    }

    getUniqueYears(tracks) {
        let years = new Set();
        tracks.forEach(track => {
            years.add(track.year);
        });
        return years;
    }

    createMenuItem(year) {
        let li = document.createElement('li');
        li.innerHTML = `<a href="javascript:void(0)">${year}</a>`;
        li.onclick = _ => {
            this.setTitle(year);
            this.tripSelector.setYear(year);
        };
        this.ul.appendChild(li);
    }
}

class MonthSelector {
    constructor(tripSelector) {
        this.tripSelector = tripSelector;
        this.node = document.querySelector('#month');
        this.ul = document.createElement('ul');
        this.node.appendChild(this.ul);
    }

    setYear(year) {
        this.reset();
        let months = this.getMonthsForYear(year);
        months.forEach(month => {
            this.createMenuItem(month);
        });
    }

    reset() {
        this.ul.innerHTML = '';
        this.setTitle('Month');
    }

    setTitle(title) {
        this.node.firstElementChild.innerHTML = title;
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
        let li = document.createElement('li');
        li.innerHTML = `<a href="javascript:void(0)">${month}</a>`;
        li.onclick = evt => {
            this.setTitle(month);
            this.tripSelector.setMonth(month);
        };
        this.ul.appendChild(li);
    }
}

class DaySelector {
    constructor(tripSelector) {
        this.tripSelector = tripSelector;
        this.node = document.querySelector('#day');
        this.ul = document.createElement('ul');
        this.node.appendChild(this.ul);
    }

    setYearMonth(year, month) {
        this.reset();
        this.tripSelector.tracks.forEach(track => {
            if (track.year === year && track.month === month) {
                this.createMenuItem(track);
            }
        });
    }

    reset() {
        this.ul.innerHTML = '';
        this.setTitle('Day');
    }

    setTitle(title) {
        this.node.firstElementChild.innerHTML = title;
    }

    createMenuItem(track) {
        let li = document.createElement('li');
        li.innerHTML = `<a href="javascript:void(0)">${track.day}</a>`;
        li.onclick = _ => {
            this.setTitle(track.day);
            this.tripSelector.setTrack(track);
        };
        this.ul.appendChild(li);
    }
}
