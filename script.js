// Mapbox Access Token
mapboxgl.accessToken = 'pk.eyJ1IjoicGphYmFuZyIsImEiOiJjbTM1cGo4OHgwY2EwMmtzZnYyemNmMjFqIn0.hvkTejWtRearSYNFWROOSg';

const mapStyles = {
    streets: 'mapbox://styles/mapbox/streets-v11',
    light: 'mapbox://styles/mapbox/light-v10',
    dark: 'mapbox://styles/mapbox/dark-v10',
    outdoors: 'mapbox://styles/mapbox/outdoors-v11',
    satellite: 'mapbox://styles/mapbox/satellite-v9',
    satelliteStreets: 'mapbox://styles/mapbox/satellite-streets-v11',
    navigationDay: 'mapbox://styles/mapbox/navigation-day-v1',
    navigationNight: 'mapbox://styles/mapbox/navigation-night-v1'
};

// Initialize Map
const map = new mapboxgl.Map({
    container: 'map',
    style: mapStyles.streets, // Default style
    center: [3.3792, 6.5244], // Lagos, Nigeria
    zoom: 12
});

// Change Map Style Function
function changeMapStyle(styleKey) {
    if (mapStyles[styleKey]) {
        map.setStyle(mapStyles[styleKey]);
    } else {
        console.error('Style not found');
    }
}

// Event Listener for Dropdown Change
const mapStyleDropdown = document.getElementById('mapStyle');
mapStyleDropdown.addEventListener('change', (event) => {
    const selectedStyle = event.target.value;
    changeMapStyle(selectedStyle);
});

// Sample collecting and dropping off locations
const collectingLocations = [
    { name: 'Marina Post Office', address: '33 Marina, Lagos Island', coordinates: [3.3896, 6.4510] },
    { name: 'Ikeja Post Office', address: '1 Mobolaji Bank Anthony Way, Ikeja', coordinates: [3.3430, 6.5965] },
    { name: 'Yaba Post Office', address: 'Commercial Avenue, Sabo, Yaba', coordinates: [3.3715, 6.5143] },
    // Additional realistic locations here
];

const droppingLocations = [
    { name: 'Victoria Island Drop-off', address: '14 Kofo Abayomi St, Victoria Island', coordinates: [3.4218, 6.4333] },
    { name: 'Ikoyi Postal Drop-off', address: '45 Glover Rd, Ikoyi', coordinates: [3.4381, 6.4474] },
    { name: 'Lekki 2 Drop-off', address: 'Chevron Drive, Lekki', coordinates: [3.5311, 6.4500] },
    // Additional realistic locations here
];

// Initialize locations array and markers array
let currentLocations = collectingLocations; // Default to "Collecting" locations
let markers = [];

// DOM Elements
const locationList = document.getElementById('locationList');
const searchInput = document.getElementById('search');
const collectingBtn = document.getElementById('collectingBtn');
const droppingBtn = document.getElementById('droppingBtn');

// Load markers and list items based on currentLocations
function loadLocations() {
    // Clear existing markers and list items
    markers.forEach(marker => marker.remove());
    locationList.innerHTML = '';

    // Add markers and list items with popups
    currentLocations.forEach((location) => {
        // Calculate Distance (assuming a default center point in Lagos)
        const distance = calculateDistance([3.3792, 6.5244], location.coordinates).toFixed(2);

        // Create list item
        const listItem = document.createElement('div');
        listItem.classList.add('location-item');
        listItem.innerHTML = `
            <div class="location-name">${location.name}</div>
            <div class="location-address">${location.address}</div>
            <div class="location-distance">${distance} km away</div>
        `;
        listItem.onclick = () => focusOnLocation(location.coordinates);
        locationList.appendChild(listItem);

        // Create a map marker with a popup
        const popup = new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<h3>${location.name}</h3><p>${location.address}</p>`);

            const customMarker = document.createElement('div');
customMarker.className = 'custom-marker';
customMarker.style.backgroundImage = 'url("location-marker.png")'; // Add your custom icon URL
customMarker.style.width = '30px'; // Adjust the size
customMarker.style.height = '30px';
customMarker.style.backgroundSize = 'cover';
        
        const marker = new mapboxgl.Marker(customMarker)
            .setLngLat(location.coordinates)
            .setPopup(popup) // Attach the popup to the marker
            .addTo(map);
        
        markers.push(marker);
    });
}

// Toggle between Collecting and Dropping Off locations
collectingBtn.onclick = () => {
    collectingBtn.classList.add('active');
    droppingBtn.classList.remove('active');
    currentLocations = collectingLocations;
    loadLocations();
};

droppingBtn.onclick = () => {
    droppingBtn.classList.add('active');
    collectingBtn.classList.remove('active');
    currentLocations = droppingLocations;
    loadLocations();
};

// Search function to filter locations
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const locationItems = document.querySelectorAll('.location-item');

    locationItems.forEach((item, index) => {
        const name = currentLocations[index].name.toLowerCase();
        const address = currentLocations[index].address.toLowerCase();
        if (name.includes(searchTerm) || address.includes(searchTerm)) {
            item.style.display = 'block';
            markers[index].getElement().style.display = 'block';
        } else {
            item.style.display = 'none';
            markers[index].getElement().style.display = 'none';
        }
    });
});

// Focus on specific location on the map
function focusOnLocation(coordinates) {
    map.flyTo({ center: coordinates, zoom: 14 });
}

// Calculate distance (Haversine formula)
function calculateDistance(coord1, coord2) {
    const R = 6371; // Earth radius in km
    const dLat = (coord2[1] - coord1[1]) * Math.PI / 180;
    const dLon = (coord2[0] - coord1[0]) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(coord1[1] * Math.PI / 180) * Math.cos(coord2[1] * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const listViewBtn = document.getElementById('listViewBtn');
const mapViewBtn = document.getElementById('mapViewBtn');
const mapContainer = document.getElementById('map');

// Event Listener for Map Style Change
mapStyleDropdown.addEventListener('change', (event) => {
    const selectedStyle = event.target.value;
    map.setStyle(mapStyles[selectedStyle]);
});

// Toggle between List View and Map View in Mobile
listViewBtn.addEventListener('click', () => {
    listViewBtn.classList.add('active');
    mapViewBtn.classList.remove('active');
    locationList.style.display = 'block';
    mapContainer.style.display = 'none';
});

mapViewBtn.addEventListener('click', () => {
    mapViewBtn.classList.add('active');
    listViewBtn.classList.remove('active');
    locationList.style.display = 'none';
    mapContainer.style.display = 'block';
});

// Initial load
loadLocations();