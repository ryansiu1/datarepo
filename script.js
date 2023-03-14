//Add default public map token from your Mapbox account
mapboxgl.accessToken = 'pk.eyJ1IjoicnlhbnNpdSIsImEiOiJjbGRtMHJneGgwNHRxM3B0Ym5tb251bDg3In0.gJy3-nzKDytiGCJoqi1Y6w';

//Initializing the map
const map = new mapboxgl.Map({
    container: 'map', // Add div container ID for your map
    style: 'mapbox://styles/mapbox/dark-v11', // Add link to style URL, I used a default styling offered by Mapbox
    projection: 'globe', // Displays the web map as a globe, instead of the default Web Mercator
    center: [-97.425, 49.86], // starting position [longitude, latitude]
    zoom: 10, // starting zoom
    bearing: 0,
    minZoom: 2.5,
    maxZoom: 12.5
});

map.on('style.load', () => {
    map.setFog({}); // Set the default atmosphere style, this adds the 'foggy' like feature when fully zoomed out
});

//Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

//Add fullscreen option to the map
map.addControl(new mapboxgl.FullscreenControl());


//Create geocoder variable
const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    countries: "ca"
});

//Use geocoder div to position geocoder on page
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));

map.on('load', () => {
    //Adding the original boundaries layer
    map.addSource('original-boundaries', {
        type: 'geojson',
        // Use a URL from Lab 1.
        data: 'C:\\Users\\ryans\\OneDrive\\Desktop\\UTAT Web\\utat-web\\boundaries.json'
    });

    map.addLayer({
        'id': 'original-boundaries-layer',
        'type': 'fill',
        'source': 'original-boundaries',
        'paint': {
            'fill-color': '#0080ff', // blue color fill
            'fill-opacity': 0.5
        }
    });

    //Adding the proposed imaging site layer
    map.addSource('proposed-boundaries', {
        type: 'geojson',
        // Use a URL from Lab 1.
        data: 'C:\\Users\\ryans\\OneDrive\\Desktop\\UTAT Web\\utat-web\\proposed.json'
    });

    map.addLayer({
        'id': 'proposed-boundaries-layer',
        'type': 'fill',
        'source': 'proposed-boundaries',
        'paint': {
            'fill-color': '#ffffff', // blue color fill
            'fill-opacity': 0.5
        }
    });
});