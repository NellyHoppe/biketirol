/* Bike Trail Tirol Beispiel */

let innsbruck = {
    lat: 47.267222,
    lng: 11.392778,
    zoom: 9
};

// WMTS Hintergrundlayer der eGrundkarte Tirol definieren
const eGrundkarteTirol = {
    sommer: L.tileLayer(
        "http://wmts.kartetirol.at/gdi_summer/{z}/{x}/{y}.png", {
            attribution: `Datenquelle: <a href="https://www.data.gv.at/katalog/dataset/land-tirol_elektronischekartetirol">eGrundkarte Tirol</a>`
        }
    ),
    winter: L.tileLayer(
        "http://wmts.kartetirol.at/gdi_winter/{z}/{x}/{y}.png", {
            attribution: `Datenquelle: <a href="https://www.data.gv.at/katalog/dataset/land-tirol_elektronischekartetirol">eGrundkarte Tirol</a>`
        }
    ),
    ortho: L.tileLayer(
        "http://wmts.kartetirol.at/gdi_ortho/{z}/{x}/{y}.png", {
            attribution: `Datenquelle: <a href="https://www.data.gv.at/katalog/dataset/land-tirol_elektronischekartetirol">eGrundkarte Tirol</a>`
        }
    ),
    nomenklatur: L.tileLayer(
        "http://wmts.kartetirol.at/gdi_nomenklatur/{z}/{x}/{y}.png", {
            attribution: `Datenquelle: <a href="https://www.data.gv.at/katalog/dataset/land-tirol_elektronischekartetirol">eGrundkarte Tirol</a>`,
            pane: "overlayPane",
        }
    )
}

// eGrundkarte Tirol Sommer als Startlayer
let startLayer = eGrundkarteTirol.sommer;

// Overlays Objekt für den GPX Track Layer
let overlays = {
    gpx: L.featureGroup()
};

// Karte initialisieren
let map = L.map("map", {
    center: [innsbruck.lat, innsbruck.lng],
    zoom: innsbruck.zoom,
    layers: [
        startLayer
    ],
});


// Layer control mit WMTS Hintergründen und Overlay
let layerControl = L.control.layers({
    "eGrundkarte Tirol Sommer": startLayer,
    "eGrundkarte Tirol Winter": eGrundkarteTirol.winter,
    "eGrundkarte Tirol Orthofoto": eGrundkarteTirol.ortho,
    "eGrundkarte Tirol Orthofoto mit Beschriftung": L.layerGroup([
        eGrundkarteTirol.ortho,
        eGrundkarteTirol.nomenklatur,
    ])
}, {
    "GPX Track der Etappe": overlays.gpx,
}).addTo(map);

// Maßstab control
L.control.scale({
    imperial: false
}).addTo(map);

// Fullscreen control
L.control.fullscreen().addTo(map);

// GPX Track Layer beim Laden anzeigen
overlays.gpx.addTo(map);

// GPX Track Layer implementieren
let track = 'data/btt-etappe-29-landeck-ischgl.gpx'; // URL to your GPX file or the GPX itself
let gpxTrack = new L.GPX(track, {
        async: true,
        marker_options: {
            startIconUrl: 'icons/start.png',
            endIconUrl: 'icons/finish.png',
            shadowUrl: null,
            iconSize: [32, 37],
            iconAnchor: [16, 37]
        },
        polyline_options: {
            color: "black",
            dashArray: [2,5]
        }
}).addTo(overlays.gpx);

gpxTrack.on("loaded", function(evt) {
    // console.log("loaded gpx event: ", evt)
    let gpxLayer = evt.target
    map.fitBounds(gpxLayer.getBounds());
    let popup = `<h3>${gpxLayer.get_name()}</h3>
    <ul>
        <li>Streckenlänge: ${(gpxLayer.get_distance()/1000).toFixed()} km</li>
        <li>tiefster Punkt: ${gpxLayer.get_elevation_min()} m</li>
        <li>höchster Punkt: ${gpxLayer.get_elevation_max()} m</li>
        <li>Höhenmeter bergauf: ${(gpxLayer.get_elevation_gain()).toFixed()}</li>
        <li>Höhenmeter bergab: ${(gpxLayer.get_elevation_loss()).toFixed()}</li>`;
    gpxLayer.bindPopup(popup)
});

let elevationControl = L.control.elevation({
    time: false,
    elevationDiv: "#profile",
    theme: 'bike-tirol',
    height: 200,
}).addTo(map);
gpxTrack.on("addline", function(evt) {
    elevationControl.addData(evt.line);
});