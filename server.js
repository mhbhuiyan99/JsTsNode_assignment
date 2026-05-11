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

    const fileName = fileMap[sortType];
    // UPDATED: Path now points to the 'data' folder
    const filePath = path.join(__dirname, 'data', fileName);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error("File Read Error:", err);
            return res.status(500).json({ error: "Data file not found" });
        }
        
        try {
            const jsonData = JSON.parse(data);
            const items = jsonData.Result.Items.slice(0, limit);
            res.json(items);
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