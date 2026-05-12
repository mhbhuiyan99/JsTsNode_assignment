// --- Global Variables ---
const propertyGrid = document.getElementById('property-grid');
const sortSelector = document.getElementById('sort-selector');
const IMAGE_SERVICE_URL = "https://beta.imgservice.rentbyowner.com/640x300/";
let map;
let markers = {};

// --- 1. Platform & Limit Detection ---
const getLimit = () => (window.innerWidth <= 1024 ? 4 : 6);

// --- 2. Map Initialization ---
async function initMap() {
    try {
        const response = await fetch('/map-config');
        const config = await response.json();
        
        if (!config.apiKey) {
            console.error("API Key missing from .env");
            return;
        }

        // Clean quotes and inject Google Script
        const cleanKey = config.apiKey.replace(/['"]+/g, '');
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${cleanKey}&callback=setupGoogleMap`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        window.setupGoogleMap = () => {
            map = new google.maps.Map(document.getElementById('live-map'), {
                center: { lat: 39.82, lng: -98.57 },
                zoom: 4
            });
            fetchProperties(); // Load properties only after map is ready
        };
    } catch (e) {
        console.error("Map initialization failed:", e);
    }
}



// Updated fetch function
async function fetchProperties() {
    const sortType = sortSelector ? sortSelector.value : 'most_popular';
    const limit = getLimit();
    try {
        const response = await fetch(`/get-property?sort=${sortType}&limit=${limit}`);
        const data = await response.json(); // data is now {all, grid}
        renderProperties(data);
    } catch (error) {
        console.error("Fetch Error:", error);
    }
}

function renderProperties(items) {
    if (!propertyGrid) return;
    
    const favorites = JSON.parse(localStorage.getItem('fav_resorts')) || [];
    
    // 1. Clear old markers from the map before re-rendering
    Object.values(markers).forEach(m => m.setMap(null));
    markers = {};

    // 2. Create map markers for ALL items in the current dataset
    items.forEach(item => syncMarker(item));

    // 3. Render HTML only for the properties that should be visible in the grid
    // Note: The 'items' array already comes limited from the server-side API
    propertyGrid.innerHTML = items.map(item => {
        const isFav = favorites.includes(item.ID);
        const imgUrl = `${IMAGE_SERVICE_URL}${item.Property.FeatureImage}`;

        return `
            <article class="hotel-card" 
                     id="tile-${item.ID}"
                     onmouseenter="highlightMarker('${item.ID}', true)" 
                     onmouseleave="highlightMarker('${item.ID}', false)">
                
                <div class="image-container">
                    <img src="${imgUrl}" alt="${item.Property.PropertyName}" 
                         onerror="this.src='https://via.placeholder.com/640x300?text=No+Image'">
                    <span class="price-tag">From $${Math.floor(item.Property.Price).toLocaleString()}</span>
                    
                    <button class="fav-btn ${isFav ? 'active' : ''}" 
                            onclick="toggleFavorite(event, '${item.ID}')">
                        ${isFav ? '❤️' : '🤍'}
                    </button>
                </div>
                
                <div class="card-content">
                    <div class="meta-row">
                        <span>★ ${item.Property.ReviewScore || '5.0'}</span>
                        <span>${item.Property.PropertyType}</span>
                    </div>
                    <h3>${item.Property.PropertyName}</h3>
                    <p class="location">${item.GeoInfo.Display}</p>
                    <div class="card-footer">
                        <span class="brand">Booking.com</span>
                        <button class="btn-availability">View Availability</button>
                    </div>
                </div>
            </article>
        `;
    }).join('');
}

const ICON_RED = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
const ICON_BLUE = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";

function syncMarker(item) {
    if (typeof google === 'undefined' || !map) return;
    
    const lat = parseFloat(item.GeoInfo.Lat);
    const lng = parseFloat(item.GeoInfo.Lng);

    const marker = new google.maps.Marker({
        position: { lat, lng },
        map: map,
        icon: ICON_RED, // Default color
        title: item.Property.PropertyName
    });

    // Handle marker clicks to highlight the tile in the grid
    marker.addListener('click', () => {
        // Reset all pins to Red
        Object.values(markers).forEach(m => m.setIcon(ICON_RED));
        // Set this specific pin to Blue
        marker.setIcon(ICON_BLUE);
        
        const tile = document.getElementById(`tile-${item.ID}`);
        if (tile) {
            tile.scrollIntoView({ behavior: 'smooth', block: 'center' });
            tile.classList.add('highlight-active');
            setTimeout(() => tile.classList.remove('highlight-active'), 3000);
        }
    });

    markers[item.ID] = marker;
}

window.highlightMarker = (id, isHovering) => {
    const marker = markers[id];
    if (!marker) return;

    if (isHovering) {
        marker.setIcon(ICON_BLUE); // Blue on select
        marker.setZIndex(google.maps.Marker.MAX_ZINDEX + 1);
        if (map) map.panTo(marker.getPosition());
    } else {
        marker.setIcon(ICON_RED); // Red on unselect
        marker.setZIndex(1);
    }
};


// Internal function to scroll to and highlight the grid tile
function highlightTile(id) {
    const tile = document.getElementById(`tile-${id}`);
    if (tile) {
        // Clear any previous highlights
        document.querySelectorAll('.hotel-card').forEach(card => card.classList.remove('highlight-active'));
        
        // Visual focus
        tile.scrollIntoView({ behavior: 'smooth', block: 'center' });
        tile.classList.add('highlight-active');
        
        // Temporary effect
        setTimeout(() => tile.classList.remove('highlight-active'), 3000);
    }
}

// --- 6. Favorite Logic ---
window.toggleFavorite = (event, id) => {
    event.stopPropagation();
    let favorites = JSON.parse(localStorage.getItem('fav_resorts')) || [];
    favorites = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id];
    localStorage.setItem('fav_resorts', JSON.stringify(favorites));
    fetchProperties(); // Re-render to update heart
};

// --- 7. Listeners ---
if (sortSelector) sortSelector.addEventListener('change', fetchProperties);
document.addEventListener('DOMContentLoaded', initMap);