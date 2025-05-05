let properties = [];

mapboxgl.accessToken = 'pk.eyJ1IjoieGRkNDQiLCJhIjoiY205MWllMWk1MDFhdjJ3b2pyZGR2aDZkeiJ9.0hs7-AJr3fOz-izEVbmu-g';

// mapboxgl.accessToken = 'pk.eyJ1IjoieGRkNDQiLCJhIjoiY205MWR3dXU0MDBlcDJqb2hzc3cybmtkZSJ9.qXz-Sr2aJPDbGXfSqIEB2w';

let originalWorkingCoords = [-71.07641125665472, 42.351252717488386];
let workingCoords = [-71.07641125665472, 42.351252717488386];
let profile = 'cycling';
let travelTimeMinutes = 15;

const map = new mapboxgl.Map({
    container: 'vis1',
    style: 'mapbox://styles/mapbox/dark-v11',
    center: workingCoords,
    zoom: 12,
    minZoom: 10
});

var workingPlaceMarker;

map.setMaxPitch(0);
map.setMinPitch(0);
map.dragPan.disable();
map.dragRotate.disable();
map.touchZoomRotate.disableRotation();
map.doubleClickZoom.disable()
var isMoving = false;
var offset;

d3.csv('./files/mapc_region_residential_sales_Price.csv')
    .then(data => {
        properties = data
            .filter(d => d.lat && d.lon && d.price && !isNaN(d.lat) && !isNaN(d.lon) && !isNaN(+d.price))
            .map(d => ({
                address: d.address || 'Unknown Address',
                price: +d.price,
                lat: +d.lat,
                lon: +d.lon,
                year: +d.year || 'N/A'
            }));
            
        initializeMap();
    })
    .catch(error => {
        console.error('Error loading the CSV file:', error);
    });

function initializeMap() {

    const minPrice = Math.max(1, d3.min(properties, d => d.price > 0 ? d.price : Infinity));
    const maxPrice = d3.max(properties, d => d.price);
    
    const colorScale = d3.scaleLog()
        .domain([minPrice, maxPrice])
        .range(['#fff5bf', '#e03174'])
        .interpolate(d3.interpolateHcl);

    map.on('load', () => {
        map.addSource('properties', {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: properties.map(prop => ({
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [prop.lon, prop.lat]
                    },
                    properties: prop
                }))
            }
        });

        map.addLayer({
            id: 'property-points',
            type: 'circle',
            source: 'properties',
            paint: {
                // Adjust circle size based on zoom level
                'circle-radius': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    10, 2,  // Smaller at zoom level 10
                    14, 5,  // Medium at zoom level 14
                    16, 8   // Larger at zoom level 16+
                ],
                'circle-color': ['get', 'color'],
                'circle-opacity': 0.7
            }
        });

        const featureCollection = map.getSource('properties')._data;
        featureCollection.features.forEach(feature => {
            const price = feature.properties.price;
            if (price <= 0) {
                feature.properties.color = '#cccccc';
            } else {
                feature.properties.color = colorScale(price);
            }
        });
        map.getSource('properties').setData(featureCollection);

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        map.addSource('iso', {
            type: 'geojson',
            data: {
                'type': 'FeatureCollection',
                'features': []
            }
        });
  
        map.addLayer(
            {
                'id': 'isoLayer',
                'type': 'fill',
                'source': 'iso',
                'layout': {},
                'paint': {
                    'fill-color': '#CCCCCC',
                    'fill-opacity': 0.25
                }
            },
            'poi-label'
        );
        getIso(true);

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        const workingPlace = document.createElement('div');
        workingPlace.id = 'working-place';
        
        workingPlace.style.width = `40px`;
        workingPlace.style.height = `40px`;
        workingPlace.style.backgroundImage = `url(./images/Technologist.png)`;
        workingPlace.style.backgroundSize = 'cover';
        workingPlace.style.backgroundColor = '#00000000';
        workingPlace.style.borderRadius = '0';
        
        workingPlaceMarker = new mapboxgl.Marker(workingPlace)
          .setLngLat(workingCoords)
          .addTo(map);

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        });

        map.on('mouseenter', 'property-points', (e) => {
            
            const coordinates = e.features[0].geometry.coordinates.slice();
            const properties = e.features[0].properties;
            
            const formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0
            });
            
            const price = formatter.format(properties.price);
            
            const popupContent = `
                <b>${properties.address}</b><br>
                Price: ${price}<br>
                Year: ${properties.year}<br>
            `;

            popup.setLngLat(coordinates)
                .setHTML(popupContent)
                .addTo(map);
        });

        map.on('mouseleave', 'property-points', () => {
            popup.remove();
        });

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        map.on("contextmenu", (e) => {});
        map.on("mousedown", (e) => {
            if (e.originalEvent.button === 0) {
                workingCoords = [e.lngLat['lng'], e.lngLat['lat']];
                workingPlaceMarker.setLngLat(workingCoords);
                getIso(true);
            } 
            if (e.originalEvent.button === 2) {
                isMoving = true;
                offset = e.point;
            } 
        });
        map.on("mousemove", (e) => {
            if (isMoving) {
                map.panBy([offset.x - e.point.x, offset.y - e.point.y], {
                duration: 0,
                });
                offset = e.point;
            }
        });
        map.on("mouseup", (e) => {
            isMoving = false;
        });

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        const legend = document.getElementById('legend1');
        legend.innerHTML = `
            <div id="price-stats">
                <p>Properties: ${properties.length}</p>
            </div>
        `;

        const numSteps = 8;
        const priceFormatter = new Intl.NumberFormat('en-US', {
            style: 'currency', 
            currency: 'USD', 
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });

        const logMin = Math.log(minPrice);
        const logMax = Math.log(maxPrice);
        const intervals = [];
        for (let i = 0; i <= numSteps; i++) {
            const logValue = logMin + (i / numSteps) * (logMax - logMin);
            intervals.push(Math.exp(logValue));
        }

        const intervalCounts = Array(numSteps).fill(0);
        properties.forEach(prop => {
            if (prop.price <= 0) return;
            
            for (let i = 0; i < numSteps; i++) {
                if (prop.price >= intervals[i] && prop.price < intervals[i+1]) {
                    intervalCounts[i]++;
                    break;
                }
            }
            if (prop.price === maxPrice) {
                intervalCounts[numSteps-1]++;
            }
        });

        for (let i = 0; i < numSteps; i++) {
            const rangeStart = intervals[i];
            const rangeEnd = intervals[i+1];
            const midpoint = Math.sqrt(rangeStart * rangeEnd);
            const color = colorScale(midpoint);
            
            const item = document.createElement('div');
            item.classList.add("price-group");
            const priceDisplay = `${priceFormatter.format(rangeStart)} - ${priceFormatter.format(rangeEnd)}`;
            const count = intervalCounts[i];
            const percentage = Math.round((count / properties.length) * 100);
            
            item.innerHTML = `
                <span style="background:${color}"></span>
                <p>${priceDisplay}<small style="background-color: #00000000;"> (${percentage}%)</small></p>
            `;
            legend.appendChild(item);
        }
        
    });

    document.getElementsByClassName('mapboxgl-ctrl-attrib-inner')[0].style.display = 'None';
    
}

async function getIso(refreshFilter) {
    const query = await fetch(
        `https://api.mapbox.com/isochrone/v1/mapbox/${profile}/${workingCoords[0]},${workingCoords[1]}?contours_minutes=${travelTimeMinutes}&polygons=true&access_token=${mapboxgl.accessToken}`,
        { method: 'GET' }
    );
    const data = await query.json();
    map.getSource('iso').setData(data);
    if (refreshFilter && map.getLayer('property-points')) {
        map.setFilter('property-points', ['within', data]);
    }
}

const travelTimeSlider = document.getElementById('travel-time');
const travelTimeText = document.getElementById('travel-time-text');
travelTimeText.textContent = `Preferred travel time: ${travelTimeSlider.value} minutes`;

travelTimeSlider.addEventListener('input', function() {
    travelTimeText.textContent = `Preferred travel time: ${this.value} minutes`;
    travelTimeMinutes = this.value;
    getIso(false);
});

travelTimeSlider.addEventListener('change', function() {
    getIso(true);
});

const travelButtons = document.querySelectorAll('.travel-btn');

travelButtons.forEach(button => {
    button.addEventListener('click', function() {
        travelButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        profile = this.dataset.method;
        getIso(true);
    });
});

const resetButton = document.getElementById("reset-work-place-btn");

resetButton.addEventListener('click', function() {
    workingCoords = originalWorkingCoords;
    workingPlaceMarker.setLngLat(workingCoords);
    getIso(true);
});