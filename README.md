# Beach Resort Booking UI Assignment

## Overview
This project is a hotel/resort booking UI built with vanilla HTML, CSS, and JavaScript, backed by a simple Express server.

The current implementation includes:
- hotel details page with resort hero and amenities
- booking card with a date range picker using `HotelDatepicker`
- nearby property cards and Google Maps markers
- image gallery modal for viewing property images

## Features

### Image Gallery
- **View All Images** modal that opens when the button is clicked
- Desktop: background page remains fixed while modal is open
- Mobile: supports touch swipe gestures for image navigation
- Next and previous buttons for manual navigation
- Image counter display in mobile view
- Click outside modal to close

### Show More/Less
- Expandable sections in the About and Amenities areas
- Additional text dynamically inserted when expanded
- Collapse back to original state with Show Less button

### Date Picker
- Hotel date range picker using the `HotelDatepicker` library
- Selected date range auto-populates check-in and check-out fields
- Initial price set to $2026 per night
- Total price automatically calculated based on selected date range
- Past dates are not selectable
- Check-out date must be at least one day after check-in
- Single date cannot be selected
- Popup Submit button finalizes selection and closes the picker
- Popup Clear button resets the selection

### Nearby Properties Grid
- Resort cards display with images, ratings, and pricing
- Sort dropdown with options: Most Popular, Highest Price, Lowest Price
- Favorites feature with heart icon (❤️ / 🤍)
- Responsive grid layout

### localStorage
- Favorites list persists across page reloads
- Property IDs stored in `fav_resorts` key
- Adding/removing favorites updates localStorage automatically

### Google Map
- Property markers displayed on interactive map
- Hover over a resort card highlights corresponding marker on map
- Click on map marker highlights and scrolls to corresponding resort card
- Bidirectional synchronization between grid and map


## Run the project
1. Install dependencies:
   ```bash
   npm install
   ```
   This installs the required packages, including `express` and `dotenv`.

2. Create a `.env` file at the project root to enable the map feature:
   ```env
   MAP_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
   ```

3. Start the server:
   ```bash
   node server.js
   ```

4. Open the app in your browser:
   ```
   http://localhost:3000
   ```

## Notes
- The image gallery is implemented in `script.js` and styled in `styles.css`.
- Property cards in the Nearby Properties section are loaded by `client.js` from the `/get-property` API.
- The server serves static files and provides the `/get-property` and `/map-config` endpoints.

## Project files to inspect
- `index.html` — page structure and gallery trigger
- `styles.css` — gallery modal styling and mobile layout
- `script.js` — image modal open/close, swipe support, and price picker logic
- `client.js` — nearby property card rendering and map marker sync
- `server.js` — Express server and API routes

## Validation
Make sure the following are working correctly:
- `View All Images` opens the gallery modal
- Modal closes when clicking outside it
- Desktop background remains fixed while viewing the modal
- Mobile image slider supports swipe + prev/next controls
- Image counter appears for mobile browsing
- Gallery images load from the `/images` folder or endpoint
