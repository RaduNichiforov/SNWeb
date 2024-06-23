const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Database setup
const db = new sqlite3.Database('./missing_sku.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS skus (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sku TEXT NOT NULL,
            status TEXT NOT NULL
        )`, (err) => {
            if (err) {
                console.error('Error creating table:', err.message);
            } else {
                console.log('Table "skus" is ready.');
            }
        });
    }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/add-sku', (req, res) => {
    const sku = req.body.sku;

    if (!sku) {
        res.status(400).send({ error: 'SKU is required' });
        return;
    }

    db.get('SELECT * FROM skus WHERE sku = ?', [sku], (err, row) => {
        if (err) {
            console.error('Error querying database:', err.message);
            res.status(500).send({ error: 'An error occurred' });
            return;
        }

        if (row) {
            res.status(200).send({ message: 'SKU already requested' });
        } else {
            db.run('INSERT INTO skus (sku, status) VALUES (?, ?)', [sku, 'requested'], (err) => {
                if (err) {
                    console.error('Error inserting into database:', err.message);
                    res.status(500).send({ error: 'An error occurred' });
                } else {
                    res.status(200).send({ message: 'SKU request added' });
                }
            });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
