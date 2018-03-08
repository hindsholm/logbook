export default class Map {
    constructor() {
        this.trackLayer = new ol.layer.Vector({
            source: new ol.source.Vector(),
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
}
