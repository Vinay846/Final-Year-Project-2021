const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    mnumber: {
        type: String,
        required: true,
    },
    rfid: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    isGoogleAuth: {
        type: Boolean,
        default: false,
    },
    points: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Point'
        }
    ]

})

module.exports = mongoose.model('User', userSchema);