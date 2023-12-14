const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        trim: true,
        required: true
    },
    tracker: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tracker'
    }],
});

module.exports = mongoose.model('User', userSchema);
