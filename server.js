const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public')); // Serve your static files from 'public' directory

app.post('/add-sku', (req, res) => {
  const { sku } = req.body;
  if (!sku) {
    return res.status(400).json({ message: 'SKU is required' });
  }

  db.run("INSERT INTO skus (sku) VALUES (?)", [sku], function(err) {
    if (err) {
      if (err.code === 'SQLITE_CONSTRAINT') {
        return res.status(409).json({ message: 'This SKU has already been requested and there is no update yet.' });
      }
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.status(201).json({ message: 'SKU has been added to the database.' });
  });
});

// Endpoint to get saved SKUs
app.get('/skus', (req, res) => {
  db.all("SELECT sku FROM skus", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.status(200).json(rows);
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
