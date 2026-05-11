// --- Global Variables ---
const propertyGrid = document.getElementById('property-grid');
const sortSelector = document.getElementById('sort-selector');
const IMAGE_SERVICE_URL = "https://beta.imgservice.rentbyowner.com/640x300/";
let map;
let markers = {};

// --- 1. Platform & Limit Detection ---
// Desktop gets 6 items, Tablet/Mobile gets 4 items per your requirement.
const getLimit = () => (window.innerWidth <= 1024 ? 4 : 6);

// --- 2. Map Initialization ---
async function initMap() {
    try {
        const response = await fetch('/map-config');
        const config = await response.json();
        
        // Safety check for Office Map API library
        if (typeof OfficeMapAPI !== 'undefined') {
            map = new OfficeMapAPI.Map(document.getElementById('live-map'), {
                center: { lat: 39.82, lng: -98.57 },
                zoom: 4,
                apiKey: config.apiKey
            });
        } else {
            // Placeholder content if API is not available outside office
            const mapContainer = document.getElementById('live-map');
            if (mapContainer) {
                mapContainer.innerHTML = `
                    <div style="padding:20px; text-align:center; color:#666; background:#eee; height:100%;">
                        <p><strong>Office Map API Placeholder</strong></p>
                        <p>Hover over cards to see location logs in console.</p>
                    </div>`;
            }
        }
    } catch (e) {
        console.error("Map config fetch failed:", e);
    }
}

// --- 3. Property Data Fetching ---
async function fetchProperties() {
    const sortType = sortSelector ? sortSelector.value : 'most_popular';
    const limit = getLimit();
    
    try {
        const response = await fetch(`/get-property?sort=${sortType}&limit=${limit}`);
        if (!response.ok) throw new Error('API fetch failed');
        
        const items = await response.json();
        renderProperties(items);
    } catch (error) {
        console.error("Fetch Error:", error);
        if (propertyGrid) {
            propertyGrid.innerHTML = "<p>Error loading properties. Ensure the server is running.</p>";
        }
    }
}

// --- 4. Rendering Logic ---
function renderProperties(items) {
    if (!propertyGrid) return;
    
    // Retrieve favorites from LocalStorage
    const favorites = JSON.parse(localStorage.getItem('fav_resorts')) || [];
    
    // Clear existing markers before re-rendering
    markers = {};

    propertyGrid.innerHTML = items.map(item => {
        const isFav = favorites.includes(item.ID);
        const imgUrl = `${IMAGE_SERVICE_URL}${item.Property.FeatureImage}`;
        
        // Create marker in memory/map if API exists
        syncMarker(item);

        return `
            <article class="hotel-card" 
                     onmouseenter="highlightMarker('${item.ID}', true)" 
                     onmouseleave="highlightMarker('${item.ID}', false)">
                <div class="image-container">
                    <img src="${imgUrl}" alt="${item.Property.PropertyName}" onerror="this.src='https://via.placeholder.com/640x300?text=No+Image'">
                    <span class="price-tag">From $${Math.floor(item.Property.Price).toLocaleString()}</span>
                    
                    <button class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleFavorite(event, '${item.ID}')">
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

// --- 5. Marker & Interaction Logic ---
function syncMarker(item) {
    if (typeof OfficeMapAPI === 'undefined' || !map) return;
    
    markers[item.ID] = new OfficeMapAPI.Marker({
        position: { lat: parseFloat(item.GeoInfo.Lat), lng: parseFloat(item.GeoInfo.Lng) },
        map: map,
        title: item.Property.PropertyName
    });
}

window.highlightMarker = (id, isHovering) => {
    if (isHovering) console.log(`Highlighting Marker: ${id}`);
    
    const marker = markers[id];
    if (!marker) return;

    // Trigger office-specific marker animations
    if (isHovering) {
        marker.setAnimation('BOUNCE'); 
    } else {
        marker.setAnimation(null);
    }
};

// --- 6. Favorite (LocalStorage) Logic ---
window.toggleFavorite = (event, id) => {
    // Prevent the click from triggering other card events
    event.stopPropagation();

    let favorites = JSON.parse(localStorage.getItem('fav_resorts')) || [];
    
    if (favorites.includes(id)) {
        favorites = favorites.filter(favId => favId !== id);
    } else {
        favorites.push(id);
    }
    
    localStorage.setItem('fav_resorts', JSON.stringify(favorites));
    
    // Refresh the current view to update the heart icon
    fetchProperties();
};

// --- 7. Event Listeners & Initialization ---
if (sortSelector) {
    sortSelector.addEventListener('change', fetchProperties);
}

// Handle window resizing for responsive limits
let resizeDebounce;
window.addEventListener('resize', () => {
    clearTimeout(resizeDebounce);
    resizeDebounce = setTimeout(fetchProperties, 300);
});

// Start everything once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    fetchProperties();
});