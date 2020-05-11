let sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const databasePath = path.join(__dirname, '/db.database');
const schemaPath = path.join(__dirname, '/schema.sql');

let initDatabase = !fs.existsSync(databasePath);
let db = new sqlite3.Database(databasePath);
if(initDatabase) {
    fs.readFile(schemaPath, "utf8", function(err, data) {
        db.exec(data);
    });
}

module.exports = db;
