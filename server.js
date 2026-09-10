const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Serve static files from root and public directories
app.use(express.static(path.join(__dirname)));
app.use(express.static(path.join(__dirname, 'public')));

// Database setup
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run("CREATE TABLE results (student_id TEXT, name TEXT, math INTEGER, english INTEGER, science INTEGER)");
    db.run("INSERT INTO results VALUES ('STU101', 'Musa Ahmadu', 85, 90, 88)");
});

// Root Route: Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'), (err) => {
        if (err) {
            res.sendFile(path.join(__dirname, 'index.html'));
        }
    });
});

// API Route to fetch result
app.get('/api/result/:id', (req, res) => {
    const studentId = req.params.id;
    db.get("SELECT * FROM results WHERE student_id = ?", [studentId], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (row) {
            res.json(row);
        } else {
            res.status(404).json({ message: "Sakamako ba a same shi ba" });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 