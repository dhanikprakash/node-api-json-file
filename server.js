const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 5000;

// Middleware for parsing JSON data
app.use(bodyParser.json());

// Get all items from the JSON collection
app.get('/api/items', (req, res) => {
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data file:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        const jsonCollection = JSON.parse(data);
        res.json(jsonCollection);
    });
});

// Get an item by ID from the JSON collection
app.get('/api/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data file:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        const jsonCollection = JSON.parse(data);
        const item = jsonCollection.find((item) => item.id === itemId);

        if (!item) {
            res.status(404).json({ error: 'Item not found' });
        } else {
            res.json(item);
        }
    });
});

// Update an item by ID in the JSON collection
app.put('/api/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data file:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        const jsonCollection = JSON.parse(data);
        const item = jsonCollection.find((item) => item.id === itemId);

        if (!item) {
            res.status(404).json({ error: 'Item not found' });
        } else {
            const { name, age } = req.body;
            item.name = name || item.name;
            item.age = age || item.age;
            fs.writeFile('data.json', JSON.stringify(jsonCollection), (err) => {
                if (err) {
                    console.error('Error writing data file:', err);
                    res.status(500).json({ error: 'Internal server error' });
                    return;
                }
                res.json(item);
            });
        }
    });
});

// Add a new item to the JSON collection
app.post('/api/items', (req, res) => {
    const { name, age } = req.body;

    if (!name || !age) {
        res.status(400).json({ error: 'Please provide both name and age for the new item' });
    } else {
        fs.readFile('data.json', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading data file:', err);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            const jsonCollection = JSON.parse(data);
            const newItem = {
                id: jsonCollection.length + 1,
                name,
                age,
            };
            jsonCollection.push(newItem);

            fs.writeFile('data.json', JSON.stringify(jsonCollection), (err) => {
                if (err) {
                    console.error('Error writing data file:', err);
                    res.status(500).json({ error: 'Internal server error' });
                    return;
                }
                res.json(newItem);
            });
        });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
