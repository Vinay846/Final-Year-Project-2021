const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const dustbinSchema = new Schema({
    Id: {
        type: Number,
        required: true
    },
    location: {
        lat: {type: Number, required: true},
        lng: {type: Number, required: true},
    },
    status: {
        type: Number,
        default: 0,
    },
    address: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Dustbin', dustbinSchema);