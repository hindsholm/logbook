export default class TripSelector {
    constructor(tracks, map) {
        this.tracks = tracks;
        this.map = map;
        this.ul = document.querySelector('#trips');
        for (let track of tracks) {
            let li = document.createElement('li');
            li.innerHTML = `<a href="${track.url}">${track.name}</a>`;
            li.onclick = evt => {
                console.log(evt);
                map.loadTrack(evt.target);
                return false;
            };
            this.ul.appendChild(li);
        }
    }
}
