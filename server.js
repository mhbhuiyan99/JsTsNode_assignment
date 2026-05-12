require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve all static files (html, css, js) from the root directory
app.use(express.static(__dirname));

app.get('/get-property', (req, res) => {
    const sortType = req.query.sort || 'most_popular';
    const limit = parseInt(req.query.limit) || 6;

    const fileMap = {
        'most_popular': 'most_popular.json',
        'highest_price': 'highest_price.json',
        'lowest_price': 'lowest_price.json'
    };

    const filePath = path.join(__dirname, 'data', fileMap[sortType]);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: "Data file not found" });

        try {
            const jsonData = JSON.parse(data);
            const allItems = jsonData.Result.Items; // Full list for markers
            const gridItems = allItems.slice(0, limit); // Limited list for cards

            // Send as an object instead of an array
            res.json({
                all: allItems,
                grid: gridItems
            });
        } catch (parseErr) {
            res.status(500).json({ error: "Error parsing JSON" });
        }
    });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// Create an endpoint to get the map configuration safely
app.get('/map-config', (req, res) => {
    res.json({ apiKey: process.env.MAP_API_KEY });
});