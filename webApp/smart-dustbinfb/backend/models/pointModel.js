const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const pointSchema = new Schema({
    earn: {
        type: Number,
    },
    redeem: {
        type: Number,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now().toString()
    }
})

module.exports = mongoose.model('Point', pointSchema);