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