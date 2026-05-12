# Beach Resort Booking UI Assignment

## Overview
This project is a hotel/resort booking UI built with vanilla HTML, CSS, and JavaScript, backed by a simple Express server.

The current implementation includes:
- hotel details page with resort hero and amenities
- booking card with a date range picker using `HotelDatepicker`
- nearby property cards and Google Maps markers
- image gallery modal for viewing property images

## Focus: Image Gallery Task
The key image task is to implement a modal gallery that opens when the **View All Images** button is clicked.

### Expected behavior
- Clicking the `View All Images` button opens a modal.
- The modal displays property images fetched from the `/images` asset folder.
- On desktop, the background page should remain fixed while the modal is open.
- Clicking outside the modal closes it.
- On mobile, the gallery should support touch swipe gestures.
- Next and previous buttons should navigate between images.
- An image counter should be shown in mobile view.

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
