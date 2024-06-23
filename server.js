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
    const { sku } = req.body;
    const sqlSelect = 'SELECT * FROM skus WHERE sku = ?';
    const sqlInsert = 'INSERT INTO skus (sku) VALUES (?)';

    db.get(sqlSelect, [sku], (err, row) => {
        if (err) {
            return res.json({ success: false, message: 'An error occurred.' });
        }
        if (row) {
            if (row.availability_date) {
                return res.json({ success: false, message: `SKU already reported. Expected availability on ${row.availability_date}.` });
            } else {
                return res.json({ success: false, message: 'SKU already reported. Waiting for update.' });
            }
        } else {
            db.run(sqlInsert, [sku], (err) => {
                if (err) {
                    return res.json({ success: false, message: 'An error occurred while adding the SKU.' });
                }
                return res.json({ success: true, message: 'SKU added successfully.' });
            });
        }
    });
});

// Admin route to update availability date (assuming this is secure and only admin has access)
app.post('/update-availability', (req, res) => {
    const { sku, availability_date } = req.body;
    const sqlUpdate = 'UPDATE skus SET availability_date = ? WHERE sku = ?';

    db.run(sqlUpdate, [availability_date, sku], (err) => {
        if (err) {
            return res.json({ success: false, message: 'An error occurred while updating the availability date.' });
        }
        return res.json({ success: true, message: 'Availability date updated successfully.' });
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
