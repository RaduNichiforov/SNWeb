const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('missing_sku.db'); // Using a file-based database for persistence

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS skus (id INTEGER PRIMARY KEY AUTOINCREMENT, sku TEXT UNIQUE)");
});

module.exports = db;
