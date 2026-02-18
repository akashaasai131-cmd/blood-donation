const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // In real apps, hash this!
    role: { type: String, enum: ['donor', 'hospital', 'admin'], required: true },
    bloodType: { type: String }, // Only for donors
    name: { type: String },
    age: { type: Number },
    contact: { type: String },
    state: { type: String },
    district: { type: String }
});

module.exports = mongoose.model('User', UserSchema);