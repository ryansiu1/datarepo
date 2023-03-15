//Add default public map token from your Mapbox account
mapboxgl.accessToken = 'pk.eyJ1IjoicnlhbnNpdSIsImEiOiJjbGRtMHJneGgwNHRxM3B0Ym5tb251bDg3In0.gJy3-nzKDytiGCJoqi1Y6w';

//Initializing the map
const map = new mapboxgl.Map({
    container: 'map', // Add div container ID for your map
    style: 'mapbox://styles/mapbox/dark-v11', // Add link to style URL, I used a default styling offered by Mapbox
    projection: 'globe', // Displays the web map as a globe, instead of the default Web Mercator
    center: [-79.425, 43.685], // starting position [longitude, latitude]
    zoom: 10, // starting zoom
    bearing: -16.6,
    minZoom: 9.5,
    maxZoom: 12.5
});

map.on('style.load', () => {
    map.setFog({}); // Set the default atmosphere style, this adds the 'foggy' like feature when fully zoomed out
});

//Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

//Add fullscreen option to the map
map.addControl(new mapboxgl.FullscreenControl());


map.on('load', () => {
    map.addSource('2015-Toronto-Income', {
        'type': 'vector',
        'url': 'mapbox://ryansiu.cg9kiflm'
    });

    map.addLayer({
        'id': 'Income-Layer',
        'type': 'fill',
        'source': '2015-Toronto-Income',
        'paint': {
            'fill-color': [
                'step', // STEP expression produces stepped results based on value pairs
                ['get', 'COL2'], // GET expression retrieves property value from 'capacity' data field
                '#eaeaea', // Colour assigned to any values < first step
                45000, '#c7e9c0', // Colours assigned to values >= each step
                65829, '#74c476',
                100000, '#238b45',
                150000, '#00441b'
            ],
            'fill-opacity': 1,
            'fill-outline-color': 'white'
        },
        'source-layer': '2015-Toronto-Income-0ngmhw'
    });

    //Changes the transparency of the layer based on the level of zoom
    map.setPaintProperty('Income-Layer', 'fill-opacity', [
        'interpolate',
        // Set the exponential rate of change to 1.25
        ['exponential', 1.25],
        ['zoom'],
        // When zoom is 10, buildings will be transparent.
        10,
        0.6,
        // When zoom is 11 or higher, buildings will be 100% opaque.
        11,
        1
    ]);

    // Add a dynamic textbox that will change when hovering over different CT to update the median income.
    map.on("mousemove", function (e) {
        var features = map.queryRenderedFeatures(e.point, {
            layers: ["Income-Layer"]
        });

        if (features.length) {
            //show median income in textbox
            document.getElementById('indicator').innerHTML = "It's median household income is $" + features[0].properties.COL2;

        } else {
            //if not hovering over a feature set indicator to default message
            document.getElementById('indicator').innerHTML = "Hover your cursor over a CT to see the median income here, or click on it to view the CTUID.";
        }
    });

    //Create popups upon a click for each CT displaying the median income
    map.on('click', 'Income-Layer', (e) => {
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML("CTUID: " + e.features[0].properties.CTUID) //indexes the GeoJSON code for the CTUID from properties
            .addTo(map);
    });

    // Changes the cursor to a link pointer when the mouse is over a CT
    map.on('mouseenter', 'Income-Layer', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Changes the cursor back to a pointer when it leaves a CT.
    map.on('mouseleave', 'Income-Layer', () => {
        map.getCanvas().style.cursor = '';
    });
});




/* When the user scrolls down, hide the navbar. When the user scrolls up, show the navbar */
var prevScrollpos = window.pageYOffset;
window.onscroll = function() {
  var currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    document.getElementById("navbar").style.top = "0";
  } else {
    document.getElementById("navbar").style.top = "-50px";
  }
  prevScrollpos = currentScrollPos;
}

