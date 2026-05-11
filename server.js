const express = require('express'); // 1. Import Express
const app = express();

app.get('/images', (req, res) => {
    const propertyImages = [
        "images/hero-main.jpg",
        "images/grid-1.jpg",
        "images/grid-2.jpg",
        "images/grid-3.jpg",
        "images/grid-4.jpg",
        // Add more image paths as needed
    ];
    res.json(propertyImages);
});