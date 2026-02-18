const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
    hospitalName: String,
    bloodType: String,
    units: Number,
    state: String,
    district: String,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Request', RequestSchema);