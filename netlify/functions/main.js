const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const User = require('./models/User');
const Request = require('./models/Request');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public')); // Serve HTML files
// Connect to MongoDB
mongoose.connect('mongodb+srv://akash:newpass@cluster0.ru1bluw.mongodb.net/?appName=Cluster0')
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));


// --- ROUTES ---

// 1. Register
app.post('/api/register', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.json({ success: true, message: "Registered successfully!" });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// 2. Login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (user) {
        res.json({ success: true, role: user.role, username: user.username });
    } else {
        res.json({ success: false, message: "Invalid credentials" });
    }
});

// 3. Post Blood Request (Hospital Only)
app.post('/api/requests', async (req, res) => {
    const newRequest = new Request(req.body);
    await newRequest.save();
    res.json({ success: true });
});

// 4. Get All Requests (For Donors)
app.get('/api/requests', async (req, res) => {
    const requests = await Request.find().sort({ date: -1 });
    res.json(requests);
});

// 5. Get All Users (For Admin)
app.get('/api/users', async (req, res) => {
    const users = await User.find();
    res.json(users);
});

// 6. Delete User (For Admin)
app.delete('/api/users/:id', async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

app.listen(3000, () => console.log('Server running on port 3000'));


// node server.js