// trackerModel.js
const mongoose = require('mongoose');

const trackerSchema = mongoose.Schema({
    statusCode: {
        type: Number,
    },
    isUp: {
        type: Boolean,
    },
    contentHash: {
        type: String,
    },
    networkActivity: {
        type: [String],
    },
    cookies: {
        type: [Object],
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    responseTime: {
        type: Number, // Add this line
    },
    loadTime: {
        type: Number, // Add this line
    },
    url: {
        type: String, // Add this line
        unique: true,
    },
});


const Tracker = mongoose.model('Tracker', trackerSchema);

module.exports = Tracker;
