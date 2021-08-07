const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    accessToken: {
        type: String,
        default: null
    },
})

module.exports = mongoose.model('token', tokenSchema);