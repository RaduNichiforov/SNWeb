const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database
const db = new sqlite3.Database('missing_sku.db', (err) => {
    if (err) {
        console.error('Database opening error: ' + err.message);
    }
});

// Create table if not exists
db.run(`
    CREATE TABLE IF NOT EXISTS skus (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sku TEXT UNIQUE,
        availability_date TEXT
    )
`);

// Routes
app.post('/add-sku', (req, res) => {
    const { sku, availabilityDate } = req.body;
    const sqlSelect = 'SELECT * FROM skus WHERE sku = ?';
    const sqlInsert = 'INSERT INTO skus (sku, availability_date) VALUES (?, ?)';
    const sqlUpdate = 'UPDATE skus SET availability_date = ? WHERE sku = ?';

    db.get(sqlSelect, [sku], (err, row) => {
        if (err) {
            return res.json({ success: false, message: 'An error occurred.' });
        }
        if (row) {
            if (availabilityDate) {
                db.run(sqlUpdate, [availabilityDate, sku], (err) => {
                    if (err) {
                        return res.json({ success: false, message: 'An error occurred while updating the availability date.' });
                    }
                    return res.json({ success: true, message: 'SKU already exists. Availability date updated.' });
                });
            } else {
                return res.json({ success: false, message: 'SKU already exists. No availability date provided.' });
            }
        } else {
            db.run(sqlInsert, [sku, availabilityDate], (err) => {
                if (err) {
                    return res.json({ success: false, message: 'An error occurred while adding the SKU.' });
                }
                return res.json({ success: true, message: 'SKU added successfully.' });
            });
        }
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
