const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

let db = new sqlite3.Database('./missing_sku.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the missing_sku database.');
});

db.run(`CREATE TABLE IF NOT EXISTS skus (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sku TEXT
)`);

app.post('/api/sku', (req, res) => {
  let sku = req.body.sku;
  db.run(`INSERT INTO skus (sku) VALUES (?)`, [sku], function(err) {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.send('SKU saved successfully');
  });
});

app.get('/api/sku', (req, res) => {
  db.all(`SELECT * FROM skus`, [], (err, rows) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.json(rows);
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
