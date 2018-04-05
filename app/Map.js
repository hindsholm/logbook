export default class Map {
    constructor() {
        this.trackLayer = new ol.layer.Vector({
            source: new ol.source.Vector(),
            style: new ol.style.Style({
                stroke: new ol.style.Stroke({ color: 'red', width: 2 })
            }),
            renderOrder: null
        });
        let land = new ol.layer.Tile({
            source: new ol.source.OSM()
            // source: new ol.source.BingMaps({
            //     key: 'AvzjjrvdUbpbaSZt6mBxjJf6-edLi-QZ6FBVuMz1KWO90sNeGqG8mlpJNoOcr8zB',
            //     imagerySet: 'AerialWithLabels',
            //     maxZoom: 19
            // })
        });
        let sea = new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: 'http://t1.openseamap.org/seamark/{z}/{x}/{y}.png',
                projection: undefined
            })
        });
        let view = new ol.View({
            center: ol.proj.fromLonLat([10.1, 56.7], 'EPSG:3857'),
            zoom: 12
        });
        this.map = new ol.Map({
            target: 'map',
            layers: [land, sea, this.trackLayer],
            view: view
        });
    }

    loadTrip(trip) {
        console.log('Loading ' + trip.name);
        let trackSrc = new ol.source.Vector({
            format: new ol.format.GPX({
                readExtensions: feature => {
                    this.readExtension(trip, feature);
                }
            }),
            url: trip.track.url
        });
        trackSrc.once('change', e => {
            if (this.map) {
                this.map.getView().fit(trackSrc.getExtent(), { size: this.map.getSize(), padding: [10, 10, 10, 10] });
            }
        });
        this.trackLayer.setSource(trackSrc);
    }

    onTripLoaded(listener) {
        this.listener = listener;
    }

    readExtension(trip, feature) {
        let geometry = feature.getGeometry();
        if (geometry.getType() === 'MultiLineString') {
            let properties = feature.getProperties();
            trip.setDescription(properties['desc']);
            if (geometry.getLayout() == 'XYZM') {
                console.log(ol.proj.toLonLat(geometry.getFirstCoordinate()));
                let start = new Date(1000 * geometry.getFirstCoordinate()[3]);
                let end = new Date(1000 * geometry.getLastCoordinate()[3]);
                trip.setDuration(start, end);
            } else {
                console.log(`{trip.name} does not have XYZM layout`);
            }
            if (this.listener) {
                this.listener(trip);
            }
        }
    }
}
