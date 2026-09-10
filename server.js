const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname)));
app.use(express.static(path.join(__dirname, 'public')));

const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run("CREATE TABLE results (student_id TEXT, name TEXT, gender TEXT, class TEXT, math INTEGER, english INTEGER, science INTEGER)");
    
    const stmt = db.prepare("INSERT INTO results VALUES (?, ?, ?, ?, ?, ?, ?)");
    
    const students = [
        ['STU101', 'Musa Ahmadu', 'Male', 'SS 3', 85, 90, 88],
        ['STU102', 'Fatima Adam', 'Female', 'SS 3', 92, 88, 95],
        ['STU103', 'Umar Ahmadu', 'Male', 'SS 3', 70, 65, 72],
        ['STU104', 'Aisha Yusuf', 'Female', 'SS 3', 78, 82, 80],
        ['STU105', 'Amina Umar Ardo', 'Female', 'JSS 2', 60, 58, 62],
        ['STU106', 'Habiba Ahmadu', 'Female', 'JSS 3', 88, 91, 84],
        ['STU107', 'Sani Umar', 'Male', 'SS 3', 45, 50, 52],
        ['STU108', 'Maryam Hassan', 'Female', 'SS 3', 95, 96, 92],
        ['STU109', 'Aliyu Garba', 'Male', 'SS 3', 68, 70, 66],
        ['STU110', 'Hadiza Suleiman', 'Female', 'SS 3', 81, 79, 85],
        ['STU111', 'Abdulhamid Umar Ardo', 'Male', 'SS 1', 74, 76, 70],
        ['STU112', 'Aminu Dahiru', 'Male', 'SS 3', 59, 63, 61],
        ['STU113', 'Hajara Umar Ardo', 'Female', 'SS 1', 89, 87, 90],
        ['STU114', 'Mustapha Yakubu', 'Male', 'SS 3', 77, 80, 75],
        ['STU115', 'Rukayya Ahmed', 'Female', 'SS 3', 90, 94, 91]
    ];

    for (const student of students) {
        stmt.run(student);
    }
    stmt.finalize();
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'), (err) => {
        if (err) {
            res.sendFile(path.join(__dirname, 'index.html'));
        }
    });
});

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
            res.status(404).json({ message: "Student record not found" });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});