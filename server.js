const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database Setup
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run("CREATE TABLE students (id TEXT PRIMARY KEY, name TEXT)");
    db.run("CREATE TABLE results (student_id TEXT, subject TEXT, score INTEGER)");

    // Sample Data
    db.run("INSERT INTO students VALUES ('STU101', 'Musa Ahmadu')");
    db.run("INSERT INTO results VALUES ('STU101', 'Mathematics', 85)");
    db.run("INSERT INTO results VALUES ('STU101', 'English Language', 78)");
    db.run("INSERT INTO results VALUES ('STU101', 'Software Engineering', 92)");
});

// API Routes
app.post('/api/result', (req, res) => {
    const { studentId } = req.body;
    db.get("SELECT * FROM students WHERE id = ?", [studentId], (err, student) => {
        if (err || !student) {
            return res.status(404).json({ message: "Bamu sami wannan lamba ba (Student ID not found)" });
        }
        db.all("SELECT subject, score FROM results WHERE student_id = ?", [studentId], (err, rows) => {
            res.json({ name: student.name, id: student.id, results: rows });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});