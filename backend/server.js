const express = require('express');
// import express from 'express';
const app = express();
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
require('dotenv').config();
const bcrypt = require('bcrypt');

// Middleware
app.use(bodyParser.json());
app.use(cors());

constOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
};
app.use(cors(constOptions));
// app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'iloveyou<3',
    database: process.env.DB_NAME || 'quickhiremedb',

    // host: 'localhost',
    // user: 'root',
    // password: 'iloveyou<3',
    // database: 'QuickHireMeDB', //Database name
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ',err.message);
        process.exit(1);
        // return;
    }
    console.log('Connected to database!');
});

app.post('/LoginRegister', async (req, res) => {
    const { username, phoneNumber, email, password } = req.body;

    // const checkQuery = `SELECT * FROM userregistrationdetails WHERE email = ? OR phoneNumber = ? OR username = ?`;
    // db.query(checkQuery, [email, phoneNumber, username], (err, results) => {
    //     if (err) {
    //         console.error('Error checking for existing user:', err.message);
    //         return res.status(500).json({ success: false, message: 'Database error' });
    //     }
    //     if (results.length > 0) {
    //         let errorMessage = '';
    //         results.forEach((row) => {
    //             if (row.email === email) errorMessage = 'Email already exists';
    //             if (row.phoneNumber === phoneNumber) errorMessage = 'Phone number already exists';
    //             if (row.username === username) errorMessage = 'Username already exists';
    //         });
    //         return res.status(400).json({ success: false, message: errorMessage});
    //     }

    // });

    // Validate input
    if (!username || username.length > 30) {
        return res.status(400).json({ success: false, message: 'Invalid username' });
    }
    if (!phoneNumber || !/^\d{10}$/.test(phoneNumber)) {
        return res.status(400).json({ success: false, message: 'Invalid phone number' });
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email address' });
    }
    if (!password || password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    try {
        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = 'INSERT INTO userregistrationdetails (username, phoneNumber, email, password) VALUES (?, ?, ?, ?)';
        db.query(sql, [username, phoneNumber, email, hashedPassword], (err, result) => {
            if (err) {
                console.error('Error inserting data:', err.message);
                return res.status(500).json({ success: false, message: 'Database error' });
            }
            res.status(201).json({ success: true, message: 'Registration successful' });
        });
    } catch (error) {
        console.error('Error hashing password:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});




// Route to handle registration
// app.post('/LoginRegister', async (req, res) => {
//     const sql = "INSERT INTO UserRegistrationDetails (username, phoneNumber, email, password) VALUES (?, ?, ?, ?)";
//     const username = req.body.username;
//     const phoneNumber = req.body.phoneNumber;
//     const email = req.body.email;
//     const password = req.body.password;

//     // Validate input
//     if (!username || !phoneNumber || !email || !password) {
//         return res.json({ success: false, message: 'All fields are required' });
//     }

//     db.query(sql, [username, phoneNumber, email, password], (err, data) => {
//         if (err) {
//             console.error('Error inserting data: ', err);
//             return res.json({ success: false, message: 'Failed to register' });
//         }
//         res.json({ success: true, message: 'Registration successful' });
//     });
// });

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});